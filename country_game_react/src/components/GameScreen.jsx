import { useState } from "react";
/*

What does this component do?

Shows Two Countries, the statistic, and the game

*/

function GameScreen({ statistic, countries, onAnswerClick }) {
  return (
    <div className="card shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-center mb-4">{statistic.name}</h2>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="card-title">{countries[0].name.common}</h3>
                <p className="flag-emoji my-3">{countries[0].flag}</p>
                <button
                  className="btn btn-primary btn-lg w-100"
                  onClick={() => onAnswerClick("country1")}
                >
                  Higher
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="card-title">{countries[1].name.common}</h3>
                <p className="flag-emoji my-3">{countries[1].flag}</p>
                <button
                  className="btn btn-success btn-lg w-100"
                  onClick={() => onAnswerClick("country2")}
                >
                  Higher
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => onAnswerClick("equal")}
          >
            Equal
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameScreen;
