import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [value, setValue] = useState("");
  const [flagImage, setFlagImage] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchWeatherData = () => {
      if (selectedCountry) {
        const lat = selectedCountry.latlng[0];
        const lon = selectedCountry.latlng[1];
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6c6f09c0a4f6ab8d6a127dac56d3f17d`;

        axios
          .get(`${url}`)
          .then((response) => {
            console.log(response.data);
            setWeatherInfo(response.data);
          })
          .catch(`${Error}, sorry error getting weather info`);
      }
    };
    fetchWeatherData();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchFlagImage = () => {
      if (selectedCountry) {
        const flagUrl = selectedCountry.flags.png;

        axios
          .get(flagUrl, { responseType: "blob" })
          .then((response) => {
            const imageUrl = URL.createObjectURL(response.data);
            setFlagImage(imageUrl);
          })
          .catch((error) => {
            console.error("Error fetching flag image:", error);
          });
      }
    };

    fetchFlagImage();
  }, [selectedCountry]);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((Response) => setCountries(Response.data))
      .catch((Error) => console.log(`error fetching data, ${Error}`));
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleFiltering = () => {
    setFilteredCountries(
      countries.filter((country) =>
        country.name.common.toLowerCase().includes(value)
      )
    );
  };

  useEffect(() => {
    handleFiltering();
  }, [value, countries]);

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
  };

  const renderCountry = () => {
    if (!selectedCountry) return null;

    return (
      <ul>
        <li>{selectedCountry.name.common}</li>
        <li>capital: {selectedCountry.capital}</li>
        <li>area: {selectedCountry.area}</li>
        <li>
          <div>
            <h3>languages:</h3>{" "}
            {Object.values(selectedCountry.languages).map((language, index) => (
              <ul key={index}>
                <li key={index}>{language}</li>
              </ul>
            ))}
          </div>
        </li>
        <li>flag</li>
        <li>
          <img
            src={flagImage}
            alt="country flag"
            style={{ maxWidth: "100px" }}
          />
        </li>
        <div>
          {weatherInfo ? (
            <>
              <h2>Weather in {selectedCountry.capital}</h2>
              <img
                src={`https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}.png`}
                alt="Weather Icon"
              />
              <p>temperature: {weatherInfo.main.temp} celcius</p>
              <p>wind speed: {weatherInfo.wind.speed} m/s</p>
            </>
          ) : (
            <p>loading...</p>
          )}
        </div>
      </ul>
    );
  };

  return (
    <>
      <form>
        find countries: <input value={value} onChange={handleChange} />
      </form>
      <div>
        {filteredCountries.length > 10 ? (
          "Too many matches, specify another filter"
        ) : (
          <ul>
            {filteredCountries.map((c) => (
              <li key={c.cca2}>
                <div>
                  {c.name.common}
                  <button onClick={() => handleShowCountry(c)}>show</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {renderCountry()}
    </>
  );
}

export default App;
