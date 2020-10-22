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

//weather.wrapper = document.querySelector(".weather__wrapper");

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
    keyboardFocus: keyboardFocus
  };
})();

/*
TODO
UX ->
[DONE]WHEN CLICKED SOMEWHERE OUTSIDE, COLLAPSE SUGGESTIONS LIST
[DONE]ENABLE ARROW KEYS TO SELECT A CITY
[DONE]WHEN CLICKED ON INPUT, AUTOMATICALLY DELETE TEXT
[DONE]404 ERROR HANDLING WITH WEATHER API

OPTIMIZE CODE 

JUMP OPTIONS
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
    numOfListItems = 4,
    line = "";
  for (var id in matchResults) {
    line = `<li class="suggested-item--${count}"  tabindex="-1"><span data-id=${id}>${matchResults[id]}</span></li>`;
    weather.querySection.suggestionsList.insertAdjacentHTML("beforeend", line);
    count++;
    if (count > numOfListItems) {
      break;
    }
  }
  if (count === 0) {
    line = `<li><span>no results found</span></li>`;
    weather.querySection.suggestionsList.insertAdjacentHTML("beforeend", line);
  }
};

weather.querySection.fetchCitySuggestions = function () {
  weather.querySection.error.hidden = true;
  className.remove(weather.querySection.input, "redBorder");

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
    weather.querySection.suggestionsList.innerHTML = "";
  }
};

weather.querySection.autocompleteInputField = function (e) {
  if (e.target && e.target.nodeName == "SPAN") {
    className.remove(weather.querySection.input, "redBorder");
    weather.querySection.input.value = e.target.innerText;
    weather.location.cityID = e.target.dataset.id;
    weather.location.isAutocomplete = true;
  }
  //after selection done, collapse suggestions
  this.innerHTML = "";
};

weather.forecast.handleForecastData = function (data) {
  if (data) {
    var temperature = data.main?.temp;
    var name = data.name;
    var timeStamp = data.timezone;
    return {
      temperature,
      name,
      timeStamp,
    };
  }
};

weather.card.updateWeatherCard = function (obj) {
  if (obj) {
    weather.card.updateTemperature(obj.temperature);
    weather.card.updateLocName(obj.name);
    weather.card.updateBackground(obj.timeStamp);
  }
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
      return "NaN";
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

//let timeout;
weather.fetchForecast = function () {
  clearTimeout(weather.timeout);
  weather.querySection.suggestionsList.innerHTML = "";
  var id = parseInt(weather.location.cityID);

  var cityParam = `id=${id}`,
    keyParam = `appid=${weather.forecast.API_KEY}`;

  //search for weather
  if (id) {
    const weatherUrl = weather.forecast.BASE_API + cityParam + "&" + keyParam;
    fetch(weatherUrl)
      .then(function (response) {
        if (response.status === 404) {
          weather.querySection.error.hidden = false;
          weather.querySection.error.innerText = "NO DATA FOUND";
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
    weather.querySection.error.hidden = false;
    className.add(weather.querySection.input, "redBorder");
  }
};

weather.querySection.debounceQuery = debounce(function () {
  console.log("debounce");
  weather.querySection.fetchCitySuggestions();
}, 800);

weather.querySection.resetInput = function () {
  weather.location.cityID = "";
  weather.querySection.input.value = "";
  weather.querySection.error.hidden = true;
  className.remove(weather.querySection.input, "redBorder");
};

weather.querySection.handleKeyboardFocus = function (event) {
  event.stopPropagation();
  var inputField = weather.querySection.input;

  switch (event.key) {
    case "Down":
    case "ArrowDown":
      //check if there is input match list
      if (document.querySelector(`.suggested-item--${weather.location.matchNumber}`)) {
        if (document.activeElement === inputField) {
          weather.location.keyboardFocus = true;
        } else if (
          //if end of the list, restart the list
          !document.querySelector(`.suggested-item--${weather.location.matchNumber}`).nextSibling
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
        document.querySelector(`.suggested-item--${weather.location.matchNumber}`)
      ) {
        //if at the start of list, focus on input field
        if (
          !document.querySelector(`.suggested-item--${weather.location.matchNumber}`)
            .previousSibling
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

    default:
      weather.location.keyboardFocus = false;
      weather.location.matchNumber = 0;
  }

  if (weather.location.keyboardFocus) {
    document.querySelector(`.suggested-item--${weather.location.matchNumber}`).focus();
    inputField.value = document.querySelector(
      `.suggested-item--${weather.location.matchNumber}`
    ).innerText;
    weather.location.cityID = document.querySelector(
      `.suggested-item--${weather.location.matchNumber}`
    ).firstChild.dataset.id;
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
  weather.querySection.handleKeyboardFocus
);

//when clicked outside, collapse suggestions list
weather.main.addEventListener("click", function (e) {
  e.stopPropagation();
  weather.querySection.suggestionsList.innerHTML = "";
});


//DEBOUNCE
function debounce(func, wait) {
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(weather.timeout);
      func(...args);
    };

    clearTimeout(weather.timeout);
    weather.timeout = setTimeout(later, wait);
  };
}