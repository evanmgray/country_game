import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [countries, updateCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStat, setSelectedStat] = useState(null);
  const [gameState, setGameState] = useState("idle"); // "idle", "playing", "answered"
  const [result, setResult] = useState(null); // "correct" or "incorrect"
  const [streak, setStreak] = useState(0);

  async function fetchCountries() {
    const apiUrl =
      "https://restcountries.com/v3.1/all?fields=cca3,name,population,timezones,languages,borders,area";
    /* Example Data 
        {
      "name": {
        "common": "United Kingdom",
        "official": "United Kingdom of Great Britain and Northern Ireland",
        "nativeName": {
          "eng": {
            "official": "United Kingdom of Great Britain and Northern Ireland",
            "common": "United Kingdom"
          }
        }
      },
      "cca3": "GBR",
      "languages": {
        "eng": "English"
      },
      "borders": [
        "IRL"
      ],
      "area": 242900,
      "population": 67215293,
      "timezones": [
        "UTC-08:00",
        "UTC-05:00",
        "UTC-04:00",
        "UTC-03:00",
        "UTC-02:00",
        "UTC",
        "UTC+01:00",
        "UTC+02:00",
        "UTC+06:00"
      ]
    } 
      */

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

  useEffect(() => {
    fetchCountries();
  }, []);

  // Pick Two Random Countries
  const getTwoRandomCountries = () => {
    const getRandomIndex = (excludeIndex = -1) => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * countries.length);
      } while (randomIndex === excludeIndex && countries.length > 1);
      return randomIndex;
    };

    const index_1 = countries.length > 0 ? getRandomIndex() : -1;
    const index_2 = countries.length > 1 ? getRandomIndex(index_1) : -1;

    const country_1 = index_1 >= 0 ? countries[index_1] : null;
    const country_2 = index_2 >= 0 ? countries[index_2] : null;

    if (country_1 && country_2) {
      setSelectedCountries([country_1, country_2]);
    }
  };

  // Pick a random statistic
  const getRandomStatistic = () => {
    const stats = [
      { name: "Population", getValue: (country) => country.population },
      {
        name: "Number of Official Languages",
        getValue: (country) =>
          country.languages ? Object.keys(country.languages).length : 0,
      },
      {
        name: "Number of Border Countries",
        getValue: (country) => (country.borders ? country.borders.length : 0),
      },
      { name: "Area", getValue: (country) => country.area },
    ];

    const randomStat = stats[Math.floor(Math.random() * stats.length)];
    setSelectedStat(randomStat);
    return randomStat;
  };

  // Start the game
  const playGame = () => {
    getTwoRandomCountries();
    getRandomStatistic();
    setGameState("playing");
    setResult(null);
  };

  // Handle answer
  const handleAnswer = (answer) => {
    const value1 = selectedStat.getValue(selectedCountries[0]);
    const value2 = selectedStat.getValue(selectedCountries[1]);

    let correctAnswer;
    if (value1 > value2) {
      correctAnswer = "country1";
    } else if (value2 > value1) {
      correctAnswer = "country2";
    } else {
      correctAnswer = "equal";
    }

    if (answer === correctAnswer) {
      setResult("correct");
      setStreak(streak + 1);
    } else {
      setResult("incorrect");
      setStreak(0);
    }
    setGameState("answered");
  };

  return (
    <>
      <h1>Country Comparison Game</h1>
      <p>Streak: {streak}</p>

      {gameState === "idle" && <button onClick={playGame}>Play</button>}

      {gameState === "playing" &&
        selectedCountries.length === 2 &&
        selectedStat && (
          <div>
            <h2>{selectedStat.name}</h2>

            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <h3>{selectedCountries[0].name.common}</h3>
                <button onClick={() => handleAnswer("country1")}>Higher</button>
              </div>

              <button onClick={() => handleAnswer("equal")}>Equal</button>

              <div>
                <h3>{selectedCountries[1].name.common}</h3>
                <button onClick={() => handleAnswer("country2")}>Higher</button>
              </div>
            </div>
          </div>
        )}

      {gameState === "answered" && (
        <div>
          <h2>{result === "correct" ? "Correct!" : "Incorrect!"}</h2>
          <p>
            {selectedCountries[0].name.common}:{" "}
            {selectedStat.getValue(selectedCountries[0])}
          </p>
          <p>
            {selectedCountries[1].name.common}:{" "}
            {selectedStat.getValue(selectedCountries[1])}
          </p>
          <button onClick={playGame}>Play Again</button>
        </div>
      )}
    </>
  );
}

export default App;
