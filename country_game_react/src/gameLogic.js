// Statistics configuration for the country comparison game

export const statistics = [
  {
    name: "Population",
    getValue: (country) => country.population,
  },
  {
    name: "Number of Land Border Countries",
    getValue: (country) => (country.borders ? country.borders.length : 0),
  },
  {
    name: "Area (square km)",
    getValue: (country) => country.area,
  },
  {
    name: "GDP (2022, $Billion)",
    getValue: (country) => country["gdp-2022"] || 0,
  },
];

export const getRandomStatistic = () => {
  return statistics[Math.floor(Math.random() * statistics.length)];
};

// Logic to pick two random countries from the large list

export const useCountrySelection = (
  countries,
  lastCountries = null,
  countryToKeep = null
) => {
  const getRandomIndex = (excludeIndex = -1, excludeCountry = null) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * countries.length);
    } while (
      (randomIndex === excludeIndex && countries.length > 1) ||
      (excludeCountry && countries[randomIndex]?.cca3 === excludeCountry.cca3)
    );
    return randomIndex;
  };

  const getTwoRandomCountries = () => {
    // If countryToKeep is specified, keep one country and get a new one
    if (countryToKeep !== null && lastCountries && lastCountries.length === 2) {
      const keptCountry =
        countryToKeep === 1 ? lastCountries[0] : lastCountries[1];

      // Get a new random country (excluding the kept country)
      const newIndex = getRandomIndex(-1, keptCountry);
      const newCountry = countries[newIndex];

      // Position the kept country (left or right)
      return countryToKeep === 1
        ? [keptCountry, newCountry]
        : [newCountry, keptCountry];
    }

    // Default behavior: get two completely random countries
    const index_1 = countries.length > 0 ? getRandomIndex() : -1;
    const index_2 = countries.length > 1 ? getRandomIndex(index_1) : -1;

    const country_1 = index_1 >= 0 ? countries[index_1] : null;
    const country_2 = index_2 >= 0 ? countries[index_2] : null;

    if (country_1 && country_2) {
      return [country_1, country_2];
    }
    return [];
  };

  return getTwoRandomCountries;
};

// Game logic for checking answers
export const checkAnswer = (answer, selectedStat, selectedCountries) => {
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

  return answer === correctAnswer;
};
