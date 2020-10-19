import { className } from "../js_modules/helper_functions.mjs";

var weather = {
  card: {},
  querySection: {},
  forecast: {},
  location: {},
  timeout: ""
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
    handleData;

  return {
    BASE_API: BASE_API,
    locations: locations,
    cityID: cityID,
    handleData: handleData,
  };
})();

/*
TODO
1.0 Make suggestions list scrollable
1.0.1 Design scroll bar
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
    numOfListItems = 10,
    line = "";
  for (var id in matchResults) {
    line = `<li><span data-id=${id}>${matchResults[id]}</span></li>`;
    weather.querySection.suggestionsList.insertAdjacentHTML("beforeend", line);
    count++;
    if (count > numOfListItems) {
      break;
    }
  }
  if(count === 0) {
    line = `<li><span>no results found</span></li>`;
    weather.querySection.suggestionsList.insertAdjacentHTML("beforeend", line);
  }
};

weather.querySection.fetchCitySuggestions = function () {
  //custom insert, autocomplete is off
  //weather.location.isAutocomplete = false;
  weather.querySection.error.hidden = true;
  //weather.location.cityID = "";
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
        return response.json();
      })
      .then(weather.forecast.handleForecastData)
      .then(weather.card.updateWeatherCard)
      .catch(function (error) {
        console.log(console.log(error));
      });
 
  } 
   //if there is no city id :(
  else {
    console.log("NO ID")
    weather.querySection.error.hidden = false;
    className.add(weather.querySection.input, "redBorder");
  }
};

weather.querySection.debounceQuery = debounce(function(){
  weather.querySection.fetchCitySuggestions();
}, 800);


//EVENT LISTENERS

weather.querySection.suggestionsList.addEventListener(
  "click",
  weather.querySection.autocompleteInputField
);
weather.querySection.submitBtn.addEventListener("click", weather.fetchForecast);
weather.querySection.input.addEventListener("keyup", weather.querySection.debounceQuery);
weather.querySection.input.addEventListener("click", weather.querySection.debounceQuery);
weather.querySection.input.addEventListener("keydown", function(){weather.location.cityID = "";})

//DEBOUNCE
function debounce(func, wait) {
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(weather.timeout);
      func(...args);
    }
    
   clearTimeout(weather.timeout);
   weather.timeout = setTimeout(later, wait);
  };
}




