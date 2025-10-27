import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import GameScreen from "./components/GameScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import { getRandomStatistic } from "./gameLogic";
import { useCountrySelection } from "./gameLogic";
import { checkAnswer } from "./gameLogic";
import gdpData from "./assets/gdp_data.json";

function App() {
  // State Variables to Track Game Status
  const [countries, updateCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStat, setSelectedStat] = useState(null);
  const [gameState, setGameState] = useState("idle"); // "idle", "playing", "answered"
  const [roundResult, setRoundResult] = useState(null); // "correct" or "incorrect"
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [lastAnswer, setLastAnswer] = useState();

  async function fetchCountries() {
    const apiUrl =
      "https://restcountries.com/v3.1/all?fields=cca3,name,population,languages,borders,area,flag,independent";

    try {
      // 1. Fetch data
      const response = await fetch(apiUrl);

      // 2. Check for success
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 3. Parse JSON
      const countryData = await response.json();

      // 4. filter down to independent countries
      const filteredCountryData = countryData.filter(
        (country) => country.independent
      );
      console.log("Countries filtered:", filteredCountryData.length);

      // 5. Save to state
      updateCountries(filteredCountryData);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  }
  // Fetch countries once on initialization
  useEffect(() => {
    fetchCountries();
  }, []);

  // Add GDP data to countries
  useEffect(() => {
    if (countries.length > 0) {
      // Filter GDP data for 2022
      const gdp2022Data = gdpData.filter((entry) => entry.Year === 2022);

      // Create a map for quick lookup by country code
      const gdpMap = {};
      gdp2022Data.forEach((entry) => {
        gdpMap[entry["Country Code"]] = entry.Value;
      });

      // Add GDP in billions USD to each country
      function roundNumber(number, digits) {
        var multiple = Math.pow(10, digits);
        var roundedNum = Math.round(number * multiple) / multiple;
        return roundedNum;
      }

      const countriesWithGDP = countries.map((country) => {
        const gdpValue = gdpMap[country.cca3] || null;
        return {
          ...country,
          "gdp-2022": roundNumber(gdpValue / 1000000000, 2),
        };
      });

      updateCountries(countriesWithGDP);
    }
  }, [countries.length]); // Only run when countries are first loaded

  // Start the game
  const playGame = () => {
    // Logic here keeps the same country if the player answers correctly
    const twoCountries =
      roundResult === "correct"
        ? lastAnswer === "country1"
          ? useCountrySelection(countries, selectedCountries, 1)
          : useCountrySelection(countries, selectedCountries, 2)
        : useCountrySelection(countries);

    // Logic here sets up for a new round
    setSelectedCountries(twoCountries);
    const randomStat = getRandomStatistic();
    setSelectedStat(randomStat);
    setGameState("playing");
    setRoundResult(null);
  };

  // Handle answer
  const handleAnswer = (answer) => {
    const isCorrect = checkAnswer(answer, selectedStat, selectedCountries);
    setLastAnswer(answer);
    if (isCorrect) {
      setRoundResult("correct");
      const newStreak = streak + 1;
      setStreak(newStreak);
      // Update highest streak if current streak is higher
      if (newStreak > highestStreak) {
        setHighestStreak(newStreak);
      }
    } else {
      setRoundResult("incorrect");
      setStreak(0);
    }
    setGameState("answered");
  };

  return (
    <div className="container my-2">
      <div className="text-center">
        <h1 className="display-3 fw-bold mb-4">Country Comparison Game</h1>
        <div className="mb-4">
          <span className="badge bg-primary fs-4 me-2">Streak: {streak}</span>
          <span className="badge bg-success fs-4">Best: {highestStreak}</span>
        </div>
      </div>

      {gameState === "idle" && (
        <div className="text-center">
          <button className="btn btn-primary btn-lg" onClick={playGame}>
            Play
          </button>
        </div>
      )}

      {/* This section shows when the round is live */}
      {gameState === "playing" &&
      selectedCountries.length === 2 &&
      Boolean(selectedStat) ? (
        <GameScreen
          statistic={selectedStat}
          countries={selectedCountries}
          onAnswerClick={handleAnswer}
        />
      ) : null}

      {/* This section shows when the round is over */}
      {gameState === "answered" ? (
        <ResultScreen
          result={roundResult}
          countries={selectedCountries}
          statistic={selectedStat}
          onClickToPlayAgain={playGame}
        />
      ) : null}
    </div>
  );
}

export default App;
