import { className } from "../js_modules/helper_functions.mjs";

var weather = {
  card: {},
  querySection: {},
  forecast: {},
  location: {},
};

weather.card.container = document.querySelector(".weather__card");
weather.card.mysteryBox = document.querySelector("#box");
weather.card.character = document.querySelector("#character");
weather.card.location = document.querySelector("#city");
weather.card.temperature = document.querySelector("#temperature");
weather.card.textContainer = document.querySelector("#card-text");

weather.querySection.input = document.querySelector("#input-city");
weather.querySection.submitBtn = document.querySelector("#submit");
weather.querySection.error = document.querySelector("#error");
weather.querySection.suggestionsList = document.querySelector(
  ".suggested-results"
);

weather.forecast = (function () {
  const API_KEY = config.OPEN_WEATHER_API_KEY,
    BASE_API = `https://api.openweathermap.org/data/2.5/weather?`;
  var handleForecastData;

  return {
    API_KEY: API_KEY,
    BASE_API: BASE_API,
    handleForecastData: handleForecastData,
  };
})();

weather.location = (function () {
  const BASE_API = `https://api.teleport.org/api/cities/?search=`;
  var locations = {},
    cityID = "",
    isAutocomplete = false,
    handleData;

  return {
    BASE_API: BASE_API,
    locations: locations,
    cityID: cityID,
    isAutocomplete: isAutocomplete,
    handleData: handleData,
  };
})();

/*
TODO
3.1. When user use input area instead of suggestions, match suggestion automatically with the first result of fetch API
3.2. According to is autocompleteInputField=true / false, on submit, re-fetch data or not.

4. Once search button is pressed, request weather data with corresponding city id
4.1. City id is in quotes, strip out of them. 
4.2. If new input is the same as previous one, do not fetch api

5. Rewrite id regex search in a more proper way 

6. Evaluate API responses and write scenenarios
*/

weather.location.handleData = function (data) {
  weather.querySection.suggestionsList.innerHTML = "";
  weather.location.locations = {};

  var dataArray = data._embedded["city:search-results"];

  for (var i = 0; i < dataArray.length; i++) {
    var city = dataArray[i]["matching_full_name"];
    var href = dataArray[i]._links["city:item"].href;
    var regex = /\d+/,
      id = href.match(regex);
    weather.location.locations[`'${id}'`] = city;
  }

  return weather.location.locations;
};

weather.populateSuggestionsList = function (matchResults) {
  var count = 0,
    numOfListItems = 4;
  for (var id in matchResults) {
    var line = `<li><span data-id=${id}>${matchResults[id]}</span></li>`;
    weather.querySection.suggestionsList.insertAdjacentHTML("beforeend", line);
    count++;
    if (count > numOfListItems) {
      break;
    }
  }
};

weather.querySection.fetchCitySuggestions = function (e) {
  //custom insert, autocomplete is off
  weather.location.isAutocomplete = false;
  weather.querySection.error.hidden = true;
  className.remove(weather.querySection.input, "redBorder");
  var input = this.value.trim();
  var url = weather.location.BASE_API + input;

  if (input && input.length > 1) {
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(weather.location.handleData)
      .then(weather.populateSuggestionsList)
      .catch(function (error) {
        console.log(error);
      });
  } else {
    //if input is empty or no longer than 1 character
    weather.querySection.suggestionsList.innerHTML = "";
  }
};

weather.querySection.autocompleteInputField = function (e) {
  if (e.target && e.target.nodeName == "SPAN") {
    weather.querySection.input.value = e.target.innerText;
    weather.location.cityID = e.target.dataset.id;
    weather.location.isAutocomplete = true;
  }
  //after selection done, collapse suggestions
  this.innerHTML = "";
};

weather.forecast.handleForecastData = function (data) {
  var temperature = data["main"]["temp"];
  var name = data["name"];
  var timeStamp = data["timezone"];
  return {
    temperature,
    name,
    timeStamp,
  };
  //console.log("temperature is " + temperature + "\n" + "name is " + name + "\n" + "timestamp is " + timeStamp);
};

weather.card.updateWeatherCard = function (obj) {
  weather.card.updateTemperature(obj.temperature);
  weather.card.updateLocName(obj.name);
  weather.card.updateBackground(obj.timeStamp);
};

weather.card.updateTemperature = function (temp) {
  //Decide if fahrenheit or celsius
  var convertedTemp = weather.convertTemperature(temp, "celsius");
  weather.card.temperature.innerHTML = convertedTemp + "&#176;" + "C";
};

weather.convertTemperature = function (temperature, unit) {
  var celsiusDeg = temperature - 273.15;
  switch (unit) {
    case "celsius":
      return Math.round(celsiusDeg);
    case "fehrenheit":
      return Math.round(celsiusDeg * (9 / 5) + 32);
    default:
      return NaN;
  }
};

weather.card.updateLocName = function (name) {
  weather.card.location.innerHTML = name;
};

weather.card.updateBackground = function (timeStamp) {
  var isDayTime = weather.calculateDayTime(timeStamp);

  switch (isDayTime) {
    case true:
      className.add(weather.card.container, "bg-day");
      className.add(weather.card.textContainer, "black");
      className.remove(weather.card.container, "bg-night");
      className.remove(weather.card.textContainer, "white");
      break;

    case false:
      className.add(weather.card.container, "bg-night");
      className.add(weather.card.textContainer, "white");
      className.remove(weather.card.container, "bg-day");
      className.remove(weather.card.textContainer, "black");
      break;
  }
};

weather.calculateDayTime = function (timeStamp) {
  var date = new Date();
  // convert to msec since Jan 1 1970
  var localTime = date.getTime();
  // obtain local UTC offset and convert to msec
  var localOffset = date.getTimezoneOffset() * 60000;
  // obtain UTC time in msec
  var utc = localTime + localOffset;
  //convert timezone from seconds in msec
  var locationTime = utc + timeStamp * 1000;
  var nd = new Date(locationTime);
  var hours = nd.getHours();
  const isDayTime = hours > 6 && hours < 20;
  return isDayTime;
};

weather.querySection.autocompleteInvalidInput = function () {
  var url = weather.location.BASE_API + weather.querySection.input.value;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(weather.location.handleData)
    .then(function (matchResults) {
      //populate the input text area with the first match automatically
      for (var id in matchResults) {
        weather.location.cityID = id;
        weather.querySection.input.value = matchResults[id];
        break;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

weather.fetchForecast = function () {
  var id = parseInt(weather.location.cityID);
  var cityParam = `id=${id}`,
    keyParam = `appid=${weather.forecast.API_KEY}`;

  //custom input without using dropdown selection
  if (!weather.location.isAutocomplete) {
    weather.querySection.autocompleteInvalidInput();
  }
  //search for weather
  if (id) {
    const weatherUrl = weather.forecast.BASE_API + cityParam + "&" + keyParam;
    fetch(weatherUrl)
      .then(function (response) {
        return response.json();
      })
      .then(weather.forecast.handleForecastData)
      .then(weather.card.updateWeatherCard)
      .catch(function (error) {
        console.log(console.log(error));
      });
    //if there is no city id :(
  } else {
    weather.querySection.error.hidden = false;
    className.add(weather.querySection.input, "redBorder");
  }
};

//EVENT LISTENERS
weather.querySection.input.addEventListener(
  "input",
  weather.querySection.fetchCitySuggestions
);
weather.querySection.suggestionsList.addEventListener(
  "click",
  weather.querySection.autocompleteInputField
);
weather.querySection.submitBtn.addEventListener("click", weather.fetchForecast);
