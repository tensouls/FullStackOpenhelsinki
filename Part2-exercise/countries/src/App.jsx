import { useState, useEffect } from 'react'
import axios from 'axios';

function App() {
    const [countries, setCountries] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [weather, setWeather] = useState({});
    
    useEffect(()=> {
        axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`).then(res => {
            setCountries(res.data);
        })
    }, [])
    
    useEffect(() => {
        setFiltered(countries.filter(c => c.name.common.toLowerCase().includes(search.toLocaleLowerCase())));
    }, [search, countries]);

    useEffect(()=> {
        if (selectedCountry) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${selectedCountry.latlng[0]}&lon=${selectedCountry.latlng[1]}&units=metric&appid=6c6f09c0a4f6ab8d6a127dac56d3f17d`).then(res => {
                console.log(res.data.weather[0].icon);
                setWeather(res.data)
            })
        }
    }, [selectedCountry])

    const handleShowClick = (country) => {
        setSelectedCountry(country);
    }
    
    

    const countryDetails = (country) => {
        return (
            <div>
                <h2>{country.name.common}</h2>
                <p>capital: {country.capital}</p>
                <p>area: {country.area}</p>
                <h4>languages:</h4>
                <ul>
                    {Object.values(country.languages).map((l, index) => (
                        <li className='country-list' key={index}>{l}</li>
                    ))}
                </ul>
                <h3>Flag:</h3>
                <img src={country.flags.png} alt="Country flag" style={{ width: '150px', height: '100px' }} />
                <h3>weather in {country.capital}</h3>
                {weather && weather.main && weather.weather && (
                    <div>
                        <h3>Weather:</h3>
                        <p>Temperature: {weather.main.temp} °C</p>
                        <p>Weather: {weather.weather[0].description}</p>
                        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather icon" />
                    </div>
                )}
                <button onClick={() => setSelectedCountry(null)}>Back</button>
            </div>
        )
    }

    const ShowCountries = ({ filtered }) => {
        if (filtered.length >= 10) {
            return (
                <p>Too many matches, please specify another filter</p>
            )
        } else {
            return (
                <ul>
                    {filtered.map(c => (
                        <li key={c.cca3}>
                            {c.name.common}
                            <button onClick={() => handleShowClick(c)}>show</button>
                        </li>
                    ))}
                </ul>
            )
        }
    }

    const Weather = () => {
        return (
            <p>weather</p>
        )
    }

    return (
        <div>
            <h2>countries</h2>
            <form>
                find countries: <input type="text" onChange={(e) => setSearch(e.target.value)} value={search} />
            </form>
            {selectedCountry ? countryDetails(selectedCountry) : <ShowCountries filtered={filtered} />}
            <Weather />
        </div>
    )
}

export default App;
