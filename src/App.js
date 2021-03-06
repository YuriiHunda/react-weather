import React, { useState, useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import moment from "moment";

import Header from "./components/header/Header";
import Card from "./components/card/Card";
import Loader from "./components/loader/Loader";

import "./App.css";

function App() {
  const [data, setData] = useState({
    dt: Date.now(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();

  const [search, setSearch] = useState("Ivano-Frankivsk");

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(inputRef.current.value);
    e.target.reset();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const onErrorClick = () => {
    setSearch("Ivano-Frankivsk");
  };

  useEffect(() => {
    const res = async () => {
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${search}&units=metric&lang=uk&appid=${process.env.REACT_APP_API_KEY}`
      ).then((res) => res.json());
      setData(data);
    };
    res();
  }, [search]);

  const dates = {
    today: moment(),
    tomorrow: moment().add(1, "days"),
    theDayAfterTomorrow: moment().add(2, "days"),
    twoDaysAfterTomorrow: moment().add(3, "days"),
    threeDaysAfterTomorrow: moment().add(4, "days"),
  };

  const cityName =
    search.split("")[0].toUpperCase() + search.split("").slice(1).join("");

  return (
    <div className="app">
      {data.cod === "200" ? (
        isLoading ? (
          <Loader />
        ) : (
          <div className="main">
            <div className="city-container">
              <span className="city-text">
                Weather in <span className="city">{cityName}</span>
              </span>
              <form onSubmit={onSearchSubmit} className="searchbox">
                <input type="text" placeholder="Search city" ref={inputRef} />
              </form>
            </div>
            <Header dates={dates} />
            <Switch>
              <Route
                path={`/`}
                exact
                render={() => <Card weather={data} currentDate={dates.today} />}
              />
              <Route
                path={`/${moment(dates.tomorrow).date()}`}
                exact
                render={() => (
                  <Card weather={data} currentDate={dates.tomorrow} />
                )}
              />
              <Route
                path={`/${moment(dates.theDayAfterTomorrow).date()}`}
                exact
                render={() => (
                  <Card
                    weather={data}
                    currentDate={dates.theDayAfterTomorrow}
                  />
                )}
              />
              <Route
                path={`/${moment(dates.twoDaysAfterTomorrow).date()}`}
                exact
                render={() => (
                  <Card
                    weather={data}
                    currentDate={dates.twoDaysAfterTomorrow}
                  />
                )}
              />
              <Route
                path={`/${moment(dates.threeDaysAfterTomorrow).date()}`}
                exact
                render={() => (
                  <Card
                    weather={data}
                    currentDate={dates.threeDaysAfterTomorrow}
                  />
                )}
              />
            </Switch>
          </div>
        )
      ) : data.cod === "404" ? (
        <div className="code-404">
          There is no city called{" "}
          <span className="code-404-city-name">{search}</span>
          <button className="code-404-button" onClick={onErrorClick}>
            Got it! Go back.
          </button>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default App;
