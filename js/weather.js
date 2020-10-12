var weather = {
  card: {},
  search: {},
  getForecast: {},
  getCities: {},
};

weather.card.container = document.querySelector(".weather__card");
weather.card.mysteryBox = document.querySelector("#box");
weather.card.character = document.querySelector("#character");
weather.card.location = document.querySelector("#city");
weather.card.temperature = document.querySelector("#temperature");

weather.search.input = document.querySelector("#input-city");
weather.search.submitBtn = document.querySelector("#submit");
weather.search.suggestions = document.querySelector(".suggested-results");

//example api call: api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
//https://openweathermap.org/current
weather.getForecast = (function () {
  const API_KEY = `8e7f3b60ff84824634967b3db3ee45af`,
    baseApi = `api.openweathermap.org/data/2.5/weather?`,
    cityParam = `q=${weather.search.input}`,
    keyParam = `appid=${API_KEY}`;

  return {
    API_KEY: API_KEY,
    baseApi: baseApi,
    cityParam: cityParam,
    keyParam: keyParam,
  };
})();

/*
TODO
1. Connect user input with list of predefined cities and offer max 5 cities in the selection.
https://developers.teleport.org/api/reference/#!/cities/searchCities

2. Save city name/city id pairs on object

3. Once that line is clicked, fill input field with that text
*/

weather.getCities = (function () {
  const baseApi = `https://api.teleport.org/api/cities/?search=`;
  var locations = {};

  return {
    baseApi: baseApi,
    locations: locations,
  };
})();


weather.fetchSearchResults = function(e) {
  var input = e.target.value.trim();

  if (input && input.length > 1) {
    var url = weather.getCities.baseApi + input;

    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        weather.search.suggestions.innerHTML = "";
        weather.getCities.locations = {};

        var dataArray = data._embedded["city:search-results"];

        for (var i = 0; i < dataArray.length; i++) {
          var city = dataArray[i]["matching_full_name"];
          var href = dataArray[i]._links["city:item"].href;
          var regex = /\d+/,
            id = href.match(regex);
          weather.getCities.locations[`'${id}'`] = city;
        }

        var count = 0;
        for (var id in weather.getCities.locations) {
          var line = `<li><span>${weather.getCities.locations[id]}</span></li>`;
          weather.search.suggestions.insertAdjacentHTML("beforeend", line);
          count++;
          if (count > 4) {
            break;
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    //if input is empty or no longer than 1 character
    weather.search.suggestions.innerHTML = "";
  }
}

//EVENT LISTENERS
weather.search.input.addEventListener("input", weather.fetchSearchResults);

  
weather.search.suggestions.addEventListener("click", function (e) {
  if (e.target && e.target.nodeName == "SPAN") {
    weather.search.input.value = e.target.innerText;
    //console.log(e.target.innerText)
  }
  //after selection done, collapse suggestions
  this.innerHTML = "";
});
