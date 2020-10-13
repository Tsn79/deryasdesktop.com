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

weather.querySection.input = document.querySelector("#input-city");
weather.querySection.submitBtn = document.querySelector("#submit");
weather.querySection.suggestionsList = document.querySelector(".suggested-results");

//example api call: api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
//https://openweathermap.org/current
weather.forecast = (function () {
  const API_KEY = ``,
    BASE_API = `https://api.openweathermap.org/data/2.5/weather?`;

  return {
    API_KEY: API_KEY,
    BASE_API: BASE_API,
  };
})();

weather.location = (function () {
  const BASE_API = `https://api.teleport.org/api/cities/?search=`;
  var locations = {},
    cityID = "",
    isAutocomplete = false,
    handleData,
    populateSuggestionsList;

  return {
    BASE_API: BASE_API,
    locations: locations,
    cityID: cityID,
    isAutocomplete: isAutocomplete,
    handleData: handleData,
    populateSuggestionsList: populateSuggestionsList,
  };
})();

/*
TODO
1. Connect user input with list of predefined cities and offer max 5 cities in the selection.
https://developers.teleport.org/api/reference/#!/cities/searchCities

2. Save city name/city id pairs on object

3. Once that line is clicked, fill input field with that text

3.1. When user use input area instead of suggestions, match suggestion automatically with the first result of fetch API
3.2. According to is autocompleteInputField=true / false, on submit, re-fetch data or not.

4. Once search button is pressed, request weather data with corresponding city id
4.1. City id is in quotes, strip out of them. 

5. Rewrite id regex search in a more proper way 
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

weather.location.populateSuggestionsList = function (matchResults) {
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

weather.fetchCitySuggestions = function (e) {
  //custom insert, autocomplete is off
  weather.location.isAutocomplete = false;
  var input = this.value.trim();
  var url = weather.location.BASE_API + input;

  if (input && input.length > 1) {
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(weather.location.handleData)
      .then(weather.location.populateSuggestionsList)
      .catch(function (error) {
        console.log(error);
      });
  } else {
    //if input is empty or no longer than 1 character
    weather.querySection.suggestionsList.innerHTML = "";
  }
};

weather.autocompleteInputField = function (e) {
  if (e.target && e.target.nodeName == "SPAN") {
    weather.querySection.input.value = e.target.innerText;
    weather.location.cityID = e.target.dataset.id;
    weather.location.isAutocomplete = true;
  }
  //after selection done, collapse suggestions
  this.innerHTML = "";
};

//EVENT LISTENERS
weather.querySection.input.addEventListener("input", weather.fetchCitySuggestions);
weather.querySection.suggestionsList.addEventListener(
  "click",
  weather.autocompleteInputField
);

//TEST
weather.querySection.submitBtn.addEventListener("click", function () {
  var id = parseInt(weather.location.cityID);
  var cityParam = `id=${id}`,
    keyParam = `appid=${weather.forecast.API_KEY}`;

  //custom input without using dropdown selection 
  if (!weather.location.isAutocomplete) {
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
  }

  //search for weather
  var weatherUrl = weather.forecast.BASE_API + cityParam + "&" + keyParam;
  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(JSON.stringify(data, null, 4));
    })
    .catch(function (error) {
      console.log(console.log(error));
    });
});
