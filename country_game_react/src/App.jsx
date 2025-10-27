import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import GameScreen from "./components/GameScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import { getRandomStatistic } from "./gameLogic";
import { useCountrySelection } from "./gameLogic";
import { checkAnswer } from "./gameLogic";

function App() {
  // State Variables to Track Game Status
  const [countries, updateCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStat, setSelectedStat] = useState(null);
  const [gameState, setGameState] = useState("idle"); // "idle", "playing", "answered"
  const [roundResult, setRoundResult] = useState(null); // "correct" or "incorrect"
  const [streak, setStreak] = useState(0);

  async function fetchCountries() {
    const apiUrl =
      "https://restcountries.com/v3.1/all?fields=cca3,name,population,timezones,languages,borders,area,flag";

    try {
      // 1. Fetch data
      const response = await fetch(apiUrl);

      // 2. Check for success
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 3. Parse JSON
      const countryData = await response.json();
      console.log("Countries fetched:", countryData.length);

      // 4. Save to state
      updateCountries(countryData);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  }
  // Fetch countries once on initialization
  useEffect(() => {
    fetchCountries();
  }, []);

  // Start the game
  const playGame = () => {
    const twoCountries = useCountrySelection(countries);
    setSelectedCountries(twoCountries);
    const randomStat = getRandomStatistic();
    setSelectedStat(randomStat);
    setGameState("playing");
    setRoundResult(null);
  };

  // Handle answer
  const handleAnswer = (answer) => {
    const isCorrect = checkAnswer(answer, selectedStat, selectedCountries);

    if (isCorrect) {
      setRoundResult("correct");
      setStreak(streak + 1);
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
        <span className="badge bg-primary fs-4 mb-4">Streak: {streak}</span>
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
