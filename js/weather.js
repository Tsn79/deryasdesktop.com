import { className } from "../js_modules/helper_functions.mjs";

//Design inspiration: https://codepen.io/Errec/pen/ZprVwZ
var weather = {
  card: {},
  querySection: {},
  forecast: {},
  location: {},
  timeout: {},
  wrapper: {},
};

weather.main = document.querySelector("#weather");

weather.card.container = document.querySelector(".weather__card");
weather.card.brick = document.querySelector("#brick");
weather.card.character = document.querySelector("#character");
weather.card.location = document.querySelector("#city");
weather.card.temperature = document.querySelector("#temperature");
weather.card.tempUnit = document.querySelector("#temp-unit");
weather.card.textContainer = document.querySelector("#card-text");
weather.card.sky = document.querySelector("#weather-sky");

weather.querySection.input = document.querySelector("#input-city");
weather.querySection.submitBtn = document.querySelector("#submit");
weather.querySection.error = document.querySelector("#error");
weather.querySection.suggestionsList = document.querySelector(
  ".suggested-results"
);

//weather.wrapper = document.querySelector(".weather__wrapper");

weather.forecast = (function () {
  const API_KEY = config.OPEN_WEATHER_API_KEY,
    BASE_API = `https://api.openweathermap.org/data/2.5/weather?`,
    UNIT_PARAM = "&units=metric";
  var handleForecastData;

  return {
    API_KEY: API_KEY,
    BASE_API: BASE_API,
    handleForecastData: handleForecastData,
    UNIT_PARAM: UNIT_PARAM,
  };
})();

weather.location = (function () {
  const BASE_API = `https://api.teleport.org/api/cities/?search=`;
  var locations = {},
    cityID = "",
    handleData,
    //the number of auto-suggest items
    matchNumber = 0,
    //set keyboard focus for auto-suggest list item
    keyboardFocus = false;

  return {
    BASE_API: BASE_API,
    locations: locations,
    cityID: cityID,
    handleData: handleData,
    matchNumber: matchNumber,
    keyboardFocus: keyboardFocus,
  };
})();

weather.querySection.deleteAutoSuggestList = function () {
  weather.querySection.suggestionsList.innerHTML = "";
};

weather.location.handleData = function (data) {
  weather.querySection.deleteAutoSuggestList();
  weather.deleteObjProps(weather.location.locations);

  var dataArray = data._embedded["city:search-results"];

  for (var i = 0; i < dataArray.length; i++) {
    var city = dataArray[i]["matching_full_name"],
      href = dataArray[i]._links["city:item"].href,
      regex = /\d+/,
      id = href.match(regex);
    weather.location.locations[`'${id}'`] = city;
  }
  //console.table(weather.location.locations)
  return weather.location.locations;
};

weather.deleteObjProps = function (obj) {
  if (typeof obj === "object" && !Array.isArray(obj)) {
    for (let prop in obj) {
      delete obj[prop];
    }
  }
};

weather.querySection.addAutoSuggestLine = function (template) {
  if (typeof template === "string") {
    weather.querySection.suggestionsList.insertAdjacentHTML(
      "beforeend",
      template
    );
  }
};

weather.populateSuggestionsList = function (matchResults) {
  var count = 0,
    numOfListItems = 4,
    template = "";
  for (var id in matchResults) {
    template = '<li class="suggested-item--'
      .concat(count, '"  tabindex="-1"><span data-id=')
      .concat(id, ">")
      .concat(matchResults[id], "</span></li>");
    weather.querySection.addAutoSuggestLine(template);
    count++;
    if (count > numOfListItems) {
      break;
    }
  }
  if (count === 0) {
    template = "<li><span>no results found</span></li>";
    return weather.querySection.addAutoSuggestLine(template);
  }
};

weather.querySection.hideErrorMsg = function () {
  weather.querySection.error.hidden = true;
  className.remove(weather.querySection.input, "redBorder");
};

weather.querySection.setErrorMsg = function (msg = "error") {
  msg = msg.toUpperCase();
  if (typeof msg === "string") {
    weather.querySection.error.hidden = false;
    weather.querySection.error.textContent = msg;
  }
};

weather.querySection.fetchCitySuggestions = function () {
  weather.querySection.hideErrorMsg();
  var input = weather.querySection.input.value,
    url = weather.location.BASE_API + input;

  if (input && input.length > 1) {
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(weather.location.handleData)
      .then(weather.populateSuggestionsList)
      ["catch"](function (error) {
        console.log(error);
      });
  } else {
    //if input is empty or no longer than 1 character
    weather.querySection.deleteAutoSuggestList();
  }
};

weather.querySection.autocompleteInputField = function (e) {
  if (e.target && e.target.nodeName == "SPAN") {
    className.remove(weather.querySection.input, "redBorder");
    weather.querySection.input.value = e.target.textContent;
    weather.location.cityID = e.target.dataset.id;
  }
  //after selection done, collapse suggestions
  weather.querySection.deleteAutoSuggestList();
};

weather.forecast.handleForecastData = function (data) {
  try {
    var temperature = data.main.temp,
      name = data.name,
      timeStamp = data.timezone,
      condition = data.weather[0].icon;
    return {
      temperature: temperature,
      name: name,
      timeStamp: timeStamp,
      condition: condition,
    };
  } catch (_unused) {
    weather.querySection.setErrorMsg("forecast data not available");
  }
};

weather.card.updateWeatherCard = function (forecast) {
  if (typeof forecast === "object" && !Array.isArray(forecast)) {
    weather.card.showTempResult(forecast.temperature);
    weather.card.updateLocName(forecast.name);
    weather.card.updateBackground(forecast.condition);
    weather.card.updateSky(forecast.condition);
  }
};

//https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
weather.card.updateSky = function (conditionCode) {
  className.remove(weather.card.container, "animate-thunder");
  console.log(conditionCode);
  var template = "";

  switch (conditionCode) {
    case "11d":
    case "11n":
      template = `<img class="cloud" src="../images/weather/cloud.png" alt="an image of cloud">
      <img class="thunder" src="../images/weather/thunder.png" alt="an image of thunder">`;
      className.add(weather.card.container, "animate-thunder");
      break;

    case "09d":
    case "09n":
      template = `<img class="cloud" src="../images/weather/cloud.png" alt="an image of cloud">
      <div class="drops">
      <img class="drop" src="../images/weather/drop.png" alt="an image of drop">
      <img class="drop" src="../images/weather/drop.png" alt="an image of drop">
      <img class="drop" src="../images/weather/drop.png" alt="an image of drop">
      </div>`;
      break;

    case "10d":
      template = `<img class="cloud" src="../images/weather/cloud.png" alt="an image of cloud">
        <img class="sun-behind-cloud" src="../images/weather/sun.png" alt="image of sun">
        <div class="drops">
          <img class="drop" src="../images/weather/drop.png" alt="an image of drop">
          <img class="drop" src="../images/weather/drop.png" alt="an image of drop">
          <img class="drop" src="../images/weather/drop.png" alt="an image of drop">
          </div>`;
      break;

    case "10n":
      template = `<img class="cloud" src="../images/weather/cloud.png" alt="an image of cloud">
        <img class="moon-behind-cloud" src="../images/weather/moon.png" alt="an image of moon">
        <div class="drops">
          <img class="drop" src="../images/weather/drop.png" alt="an image of drop">
          <img class="drop" src="../images/weather/drop.png" alt="an image of drop">
          <img class="drop" src="../images/weather/drop.png" alt="an image of drop">
          </div>`;
      break;

    case "13d":
    case "13n":
      template = `<img class="cloud" src="../images/weather/cloud.png" alt="an image of cloud">
        <div class="flakes">
        <img class="flake" src="../images/weather/snow.png" alt="an image of snowflake">
        <img class="flake" src="../images/weather/snow.png" alt="an image of snowflake">
        <img class="flake" src="../images/weather/snow.png" alt="an image of snowflake">
        </div>`;
      break;

    case "50d":
    case "50n":
      template = `<img class="fog fog-up" src="../images/weather/fog.png" alt="image of fog">
     <img class="fog fog-down" src="../images/weather/fog.png" alt="image of fog">`;
      break;

    case "01d":
      template = `<img class="sun" src="../images/weather/sun.png" alt="an image of sun">`;
      break;

    case "01n":
      template = `<img class="moon" src="../images/weather/moon.png" alt="an image of moon">
        <img class="star star--one" src="../images/weather/star.png" alt="an image of star">
        <img class="star star--two" src="../images/weather/star.png" alt="an image of star">`;
      break;

    case "02d":
      template = `<img class="cloud" src="../images/weather/cloud.png" alt="an image of cloud">
        <img class="sun-behind-cloud" src="../images/weather/sun.png" alt="image of sun">`;
      break;

    case "02n":
      template = `<img class="cloud" src="../images/weather/cloud.png" alt="an image of cloud">
        <img class="moon-behind-cloud" src="../images/weather/moon.png" alt="an image of moon">`;
      break;

    case "03d":
    case "03n":
      template = `<img class="cloud" src="../images/weather/cloud.png" alt="an image of cloud"></img>`;
      break;

    case "04d":
    case "04n":
      template = `<img class="cloud" src="../images/weather/cloud.png" alt="an image of cloud"></img>
          <img class="dark-cloud" src="../images/weather/dark-cloud.png" alt="an image of dark cloud"></img>`;
      break;
  }
  weather.card.sky.innerHTML = template;
};

weather.card.showTempResult = function (temp) {
  weather.card.temperature.innerHTML =
    weather.card.tempUnit.textContent === "C"
      ? Math.round(temp) + "&#176;" + "C"
      : weather.convertToFehrenheit(temp) + "&#176;" + "F";
};

weather.convertToFehrenheit = function (temperature) {
  temperature =
    typeof temperature === "string" ? parseInt(temperature) : temperature;
  if (typeof temperature === "number" && temperature) {
    return Math.round(temperature * (9 / 5) + 32);
  }

  //return strResult + "&#176;" + "F";
};

weather.convertToCelcius = function (temperature) {
  temperature =
    typeof temperature === "string" ? parseInt(temperature) : temperature;
  if (typeof temperature === "number" && temperature) {
    return Math.round(((temperature - 32) * 5) / 9);
    //return strResult + "&#176;" + "C";
  }
};

weather.card.updateLocName = function (name) {
  weather.card.location.innerHTML = name;
};

weather.card.updateBackground = function (conditionCode) {
  var dayOrNight = weather.isDayOrNight(conditionCode);

  switch (dayOrNight) {
    case "day":
      className.add(weather.card.container, "bg-day");
      className.add(weather.card.textContainer, "black");
      className.remove(weather.card.container, "bg-night");
      className.remove(weather.card.textContainer, "white");
      break;

    case "night":
      className.add(weather.card.container, "bg-night");
      className.add(weather.card.textContainer, "white");
      className.remove(weather.card.container, "bg-day");
      className.remove(weather.card.textContainer, "black");
      break;

    default:
      className.add(weather.card.container, "bg-day");
      className.add(weather.card.textContainer, "black");
      className.remove(weather.card.container, "bg-night");
      className.remove(weather.card.textContainer, "white");
  }
};

//rewrite
weather.isDayOrNight = function (conditionCode) {
  var isDay = conditionCode.indexOf("d") > -1,
    isNight = conditionCode.indexOf("n") > -1;

  if (isDay) {
    return "day";
  } else if (isNight) {
    return "night";
  }
};

weather.fetchForecast = function () {
  window.clearTimeout(weather.timeout);
  weather.querySection.deleteAutoSuggestList();
  var id = parseInt(weather.location.cityID);
  var base = weather.forecast.BASE_API,
    cityIdParam = "id=".concat(id),
    keyParam = "&appid=".concat(weather.forecast.API_KEY),
    unitParam = weather.forecast.UNIT_PARAM; //search for weather

  if (id && typeof id === "number") {
    var weatherUrl = base + cityIdParam + keyParam + unitParam;
    fetch(weatherUrl)
      .then(function (response) {
        if (response.status === 404) {
          return weather.querySection.setErrorMsg("forecast data not found");
        } else {
          return response.json();
        }
      })
      .then(weather.forecast.handleForecastData)
      .then(weather.card.updateWeatherCard)
      ["catch"](function (error) {
        console.log(error);
      });
  } //if there is no city id :(
  else {
    console.log("NO ID");
    return weather.querySection.setErrorMsg("sorry, i can't find match");
  }
};

weather.querySection.debounceQuery = debounce(function () {
  console.log("debounce");
  weather.querySection.fetchCitySuggestions();
}, 800);

weather.querySection.resetInput = function () {
  weather.location.cityID = "";
  weather.querySection.input.value = "";
  return weather.querySection.hideErrorMsg();
};

weather.querySection.handleKeyboardFocus = function (event) {
  if (
    ["Down", "ArrowDown", "Up", "ArrowUp", "Enter"].indexOf(event.key) === -1
  ) {
    return;
  }
  switch (event.key) {
    case "Down":
    case "ArrowDown":
      event.preventDefault();
      event.stopPropagation();
      //check if there is auto-suggest results
      if (
        document.querySelector(
          ".suggested-item--".concat(weather.location.matchNumber)
        )
      ) {
        if (document.activeElement === weather.querySection.input) {
          weather.location.keyboardFocus = true;
        } else if (
          //if end of the list, restart the list
          !document.querySelector(
            ".suggested-item--".concat(weather.location.matchNumber)
          ).nextSibling
        ) {
          weather.location.matchNumber = 0; //else go to the next list item
        } else {
          weather.location.matchNumber++;
        }
      }

      break;

    case "Up":
    case "ArrowUp":
      event.preventDefault();
      event.stopPropagation();
      if (
        document.activeElement ===
        document.querySelector(
          ".suggested-item--".concat(weather.location.matchNumber)
        )
      ) {
        //if at the start of list, focus on input field
        if (
          !document.querySelector(
            ".suggested-item--".concat(weather.location.matchNumber)
          ).previousSibling
        ) {
          weather.location.matchNumber = 0;
          weather.querySection.input.focus();
          weather.location.keyboardFocus = false; //else, go to the previous list item
        } else {
          weather.location.matchNumber--;
        }
      }

      break;

    case "Enter":
      event.preventDefault();
      event.stopPropagation();

      weather.fetchForecast();
      weather.location.keyboardFocus = false;
      weather.location.matchNumber = 0;
      break;
  }

  if (weather.location.keyboardFocus) {
    document
      .querySelector(".suggested-item--".concat(weather.location.matchNumber))
      .focus();
    weather.querySection.input.value = document.querySelector(
      ".suggested-item--".concat(weather.location.matchNumber)
    ).textContent;
    weather.location.cityID = document.querySelector(
      ".suggested-item--".concat(weather.location.matchNumber)
    ).firstChild.dataset.id;
  }
  return false;
};

weather.card.jumpToBrick = function () {
  className.add(weather.card.character, "jump");
  className.add(weather.card.brick, "shake");
  return weather.card.hitBrick();
};

weather.card.jumpBack = function () {
  className.remove(weather.card.character, "jump");
  className.remove(weather.card.brick, "shake");
};

weather.card.hitBrick = function () {
  if (weather.card.tempUnit.textContent === "C") {
    weather.card.tempUnit.textContent = "F";
    weather.card.temperature.innerHTML =
      weather.convertToFehrenheit(weather.card.temperature.textContent) +
      "&#176;" +
      "F";
  } else {
    weather.card.tempUnit.textContent = "C";
    weather.card.temperature.innerHTML =
      weather.convertToCelcius(weather.card.temperature.textContent) +
      "&#176;" +
      "C";
  }
};

//EVENT LISTENERS
weather.querySection.suggestionsList.addEventListener(
  "click",
  weather.querySection.autocompleteInputField
);

weather.querySection.submitBtn.addEventListener("click", weather.fetchForecast);

weather.querySection.input.addEventListener(
  "input",
  weather.querySection.debounceQuery
);

weather.querySection.input.addEventListener(
  "click",
  weather.querySection.resetInput
);

//USE ARROW KEYS TO NAVIGATE BETWEEN AUTO-SUGGEST LIST
weather.main.addEventListener(
  "keydown",
  weather.querySection.handleKeyboardFocus,
  false
);

//when clicked outside, collapse suggestions list
weather.main.addEventListener(
  "click",
  weather.querySection.deleteAutoSuggestList
);

weather.card.brick.addEventListener("mousedown", weather.card.jumpToBrick);

weather.card.brick.addEventListener("mouseup", weather.card.jumpBack);

//DEBOUNCE
function debounce(func, wait) {
  return function executedFunction(...args) {
    const later = () => {
      window.clearTimeout(weather.timeout);
      func(...args);
    };

    window.window.clearTimeout(weather.timeout);
    weather.timeout = window.setTimeout(later, wait);
  };
}


//WHEN WINDOW CLOSED, CANCEL ALL OPERATIONS
//BG ANIMATION