$(document).ready(function () {
  const weatherKey = "1893546eadda6ea230333e67a557c549";
  const date = moment().format("MMMM Do YYYY")
  console.log(date)
  const month = moment().format("MM");
  const day = moment().format("DD");
  console.log(month, day);

  const historyURL = "http://numbersapi.com/" + month + "/" + day + "/date";
  let lat = "";
  let long = "";
  let fivedayURL = "";
  let basicURL = "";

  function basicData(location) {
    basicURL =
      "https://api.openweathermap.org/data/2.5/weather?" +
      location +
      "&appid=" +
      weatherKey;
  }

  function fiveDay() {
    fivedayURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      long +
      "&exclude=current,minutely,hourly&appid=" +
      weatherKey;
  }
  function weatherAjax() {
    $.ajax({
      url: basicURL,
      method: "GET",
    }).then(function (cityData) {
      console.log(cityData);
      lat = cityData.coord.lat;
      long = cityData.coord.lon;
      console.log("current coords", lat, long)
      fiveDay()
      console.log("fiveDayUrl", fivedayURL)
      const unix = cityData.dt;
      const milli = unix * 1000;
      const date = new Date(milli);
      const humanizedLong = date.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      });
      humanizedShort = date.toLocaleString("en-US", {
        weekday: "long"
      });
      $('#cityName').text(cityData.name);
      $('#date').text(humanizedLong);

      $.ajax({
        url: fivedayURL,
        method: "GET",
      }).then(function (onecall) {
        console.log(onecall);
        for (let i = 0; i < 6; i++) {
          $('#day' + i).empty();
          console.log(i);
          const todayIcon = onecall.daily[i].weather[0].icon;
          console.log(todayIcon)

          const unix = onecall.daily[i].dt;
          const milli = unix * 1000;
          const date = new Date(milli);
          humanizedShort = date.toLocaleString("en-US", {
            weekday: "long"
          });

          const dates = $('<h6>');
          dates.text(humanizedShort);

          const weatherIcon = $('<img>');
          weatherIcon.attr('src', 'https://openweathermap.org/img/w/' + todayIcon + '.png')
          weatherIcon.html('<span>' + humanizedLong + '</span>');

          const temp = $('<p class="font-weight-bold">');
          temp.text('Temperature: ');

          const ul = $('<ul class="font-weight-bold">');
          const morn = $('<li class="font-weight-normal">');
          morn.text('Morning: ' + Math.floor(((onecall.daily[i].temp.morn) - 273.15) * 1.8 + 32) + '°F');

          const day = $('<li class="font-weight-normal">');
          day.text('Day: ' + Math.floor(((onecall.daily[i].temp.day) - 273.15) * 1.8 + 32) + '°F');

          const eve = $('<li class="font-weight-normal">');
          eve.text('Evening: ' + Math.floor(((onecall.daily[i].temp.eve) - 273.15) * 1.8 + 32) + '°F');

          const humid = $('<p class="font-weight-bold">');
          humid.text('Humidity: ' + onecall.daily[i].humidity + '%');

          const uvi = $('<p class="font-weight-bold">');
          uvi.text('UV Index: ' + onecall.daily[i].uvi);

          ul.append(morn, day, eve);
          $('#day' + i).append(dates, weatherIcon, temp, ul, humid, uvi);





          //Weather icon `<img src="https://openweathermap.org/img/w/${todayIcon}.png"></img>`
          //Temperature: morn, day, eve  (Math.floor(((onecall.daily[i].temp.morn) - 273.15) * 1.8 + 32)); °
          // morn =
          // day =
          // eve =
          //Humidity:  %
          //uv index: 

        }

      })

    });
  }

  function geoFindMe() {
    function success(position) {
      console.log("hi i'm paul");
      console.log(position);
      basicData("lat=" + position.coords.latitude + "&lon=" + position.coords.longitude)
      console.log("i'm praying", basicURL)
      weatherAjax()
    }

    function error() {
      status.textContent = "Unable to retrieve your location";
    }

    if (!navigator.geolocation) {
      status.textContent = "Geolocation is not supported by your browser";
    } else {
      status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  geoFindMe();

  $("#searchBtn").on("click", function () {
    event.preventDefault();
    basicData("q=" + $("#searchSpace").val())
    weatherAjax()
  });

  $.ajax({
    url: historyURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $("#history").text(response);
  });
});

