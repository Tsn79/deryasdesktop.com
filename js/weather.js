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

weather.querySection.addAutoSuggestLine = function (line) {
  if (typeof line === "string") {
    weather.querySection.suggestionsList.insertAdjacentHTML("beforeend", line);
  }
};

weather.populateSuggestionsList = function (matchResults) {
  var count = 0,
    numOfListItems = 4,
    line = "";
  for (var id in matchResults) {
    line = `<li class="suggested-item--${count}"  tabindex="-1"><span data-id=${id}>${matchResults[id]}</span></li>`;
    weather.querySection.addAutoSuggestLine(line);
    count++;
    if (count > numOfListItems) {
      break;
    }
  }
  if (count === 0) {
    line = `<li><span>no results found</span></li>`;
    return weather.querySection.addAutoSuggestLine(line);
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

  var input = weather.querySection.input.value;
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
    var temperature = data.main?.temp;
    var name = data.name;
    var timeStamp = data.timezone;
    return {
      temperature,
      name,
      timeStamp,
    };
  } catch {
    weather.querySection.setErrorMsg("forecast data not available");
  }
};

weather.card.updateWeatherCard = function (obj) {
  if (typeof obj === "object") {
    weather.card.updateTemperature(obj.temperature);
    weather.card.updateLocName(obj.name);
    weather.card.updateBackground(obj.timeStamp);
  }
};

weather.card.updateTemperature = function (temp) {
  weather.card.temperature.innerHTML =
    weather.card.tempUnit.textContent === "C"
      ? Math.round(temp) + "&#176;" + "C"
      : weather.convertToFehrenheit(temp);
};

weather.convertToFehrenheit = function (temperature) {
  var result = Math.round(temperature * (9 / 5) + 32);
  return result + "&#176;" + "F";
};

weather.convertToCelcius = function (temperature) {
  var result = Math.round(((temperature - 32) * 5) / 9);
  return result + "&#176;" + "C";
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

weather.fetchForecast = function () {
  window.clearTimeout(weather.timeout);
  weather.querySection.deleteAutoSuggestList();

  var id = parseInt(weather.location.cityID);

  var base = weather.forecast.BASE_API,
    cityIdParam = `id=${id}`,
    keyParam = `&appid=${weather.forecast.API_KEY}`,
    unitParam = weather.forecast.UNIT_PARAM;

  //search for weather
  if (id && typeof id === "number") {
    const weatherUrl = base + cityIdParam + keyParam + unitParam;
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
      .catch(function (error) {
        console.log(error);
      });
  }
  //if there is no city id :(
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
  var inputField = weather.querySection.input;

  switch (event.key) {
    case "Down":
    case "ArrowDown":
      //check if there is auto-suggest results
      if (
        document.querySelector(
          `.suggested-item--${weather.location.matchNumber}`
        )
      ) {
        if (document.activeElement === inputField) {
          weather.location.keyboardFocus = true;
        } else if (
          //if end of the list, restart the list
          !document.querySelector(
            `.suggested-item--${weather.location.matchNumber}`
          ).nextSibling
        ) {
          weather.location.matchNumber = 0;
          //else go to the next list item
        } else {
          weather.location.matchNumber++;
        }
      }
      break;

    case "Up":
    case "ArrowUp":
      if (
        document.activeElement ===
        document.querySelector(
          `.suggested-item--${weather.location.matchNumber}`
        )
      ) {
        //if at the start of list, focus on input field
        if (
          !document.querySelector(
            `.suggested-item--${weather.location.matchNumber}`
          ).previousSibling
        ) {
          weather.location.matchNumber = 0;
          inputField.focus();
          weather.location.keyboardFocus = false;
          //else, go to the previous list item
        } else {
          weather.location.matchNumber--;
        }
      }
      break;

    case "Enter":
      weather.fetchForecast();
      weather.location.keyboardFocus = false;
      weather.location.matchNumber = 0;
  }

  if (weather.location.keyboardFocus) {
    document
      .querySelector(`.suggested-item--${weather.location.matchNumber}`)
      .focus();
    inputField.value = document.querySelector(
      `.suggested-item--${weather.location.matchNumber}`
    ).textContent;
    weather.location.cityID = document.querySelector(
      `.suggested-item--${weather.location.matchNumber}`
    ).firstChild.dataset.id;
  }
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
    weather.card.temperature.innerHTML = weather.convertToFehrenheit(
      parseInt(weather.card.temperature.textContent)
    );
  } else {
    weather.card.tempUnit.textContent = "C";
    weather.card.temperature.innerHTML = weather.convertToCelcius(
      parseInt(weather.card.temperature.textContent)
    );
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
