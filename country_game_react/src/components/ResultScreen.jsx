import { useState, useEffect } from "react";
/*

What does this component do?

Shows Two Countries, the statistic, and the game

*/

function ResultScreen({ result, countries, statistic, onClickToPlayAgain }) {
  //// Bar Animation ////
  // Get Max Value
  const value1 = statistic.getValue(countries[0]);
  const value2 = statistic.getValue(countries[1]);
  const maxValue = Math.max(value1, value2);

  // Calculate percentage widths for the bars
  const percentage1 = (value1 / maxValue) * 100;
  const percentage2 = (value2 / maxValue) * 100;

  // State to control animation
  const [animatedWidth1, setAnimatedWidth1] = useState(0);
  const [animatedWidth2, setAnimatedWidth2] = useState(0);

  // Trigger animation when component mounts
  useEffect(() => {
    // Small delay to ensure the transition is visible
    const timer = setTimeout(() => {
      setAnimatedWidth1(percentage1);
      setAnimatedWidth2(percentage2);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage1, percentage2]);

  return (
    <div className="card shadow-lg">
      <div className="card-body">
        <h2
          className={`text-center mb-4 ${
            result === "correct" ? "text-success" : "text-danger"
          }`}
        >
          {result === "correct" ? "✓ Correct!" : "✗ Incorrect!"}
        </h2>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="card-title text-center">
                  {countries[0].name.common}
                </h3>
                <p className="flag-emoji text-center my-3">
                  {countries[0].flag}
                </p>
                <div className="bar-container">
                  <div
                    className="animated-bar"
                    style={{ width: `${animatedWidth1}%` }}
                  ></div>
                  <span
                    className={`bar-value ${
                      percentage1 <= 66 ? "dark-text" : ""
                    }`}
                  >
                    {value1.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="card-title text-center">
                  {countries[1].name.common}
                </h3>
                <p className="flag-emoji text-center my-3">
                  {countries[1].flag}
                </p>
                <div className="bar-container">
                  <div
                    className="animated-bar"
                    style={{ width: `${animatedWidth2}%` }}
                  ></div>
                  <span
                    className={`bar-value ${
                      percentage2 <= 66 ? "dark-text" : ""
                    }`}
                  >
                    {value2.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-primary btn-lg"
            onClick={onClickToPlayAgain}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;
