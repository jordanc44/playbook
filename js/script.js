$(document).ready(function() {
  var NEWS_API_KEY = "574d0460cd504c03803eea38c30af26b"; // https://newsapi.org/register
  var DARK_SKY_API_KEY = "c07f1495a798ae4d752d6c3abf6ee9e9"; // https://darksky.net/dev/register

  // Default location (for weather)
  var POSITION_LAT = 43.7524089;
  var POSITION_LON = -79.2567648;

  // Refresh intervals
  var UPDATE_TIME_INTERVAL = 1000 * 60;
  var UPDATE_WEATHER_INTERVAL = 1000 * 60 * 60;
  var UPDATE_NEWS_INTERVAL = 1000 * 60 * 60;
  var CYCLE_NEWS_INTERVAL = 1000 * 60;

  // Updates the clock and date
  function updateDateTime() {
    $("#clock").html(moment().format("hh:mm"));
    $("#date").html(
      moment()
        .format('ddd[<br>]MMM[<br><span id="date-day">]D[</span>]')
        .toUpperCase()
    );
  }

  // Retrieves weather periodically
  function updateWeather() {
    var url =
      "https://cors.io/?https://api.darksky.net/forecast/" +
      DARK_SKY_API_KEY + "/" + POSITION_LAT + "," + POSITION_LON + "?units=auto";
    $.ajax({
      url: url,
      type: "GET",
      success: function(data) {
        try {
          data = JSON.parse(data);
          $("#weather-summary").html(data.currently.summary);
          $("#weather-low").html(Math.round(data.daily.data[0].temperatureLow));
          $("#weather-high").html(
            Math.round(data.daily.data[0].temperatureHigh)
          );
          $("#weather-icon").html(
            setWeatherIcon(
              data.currently.icon,
              data.daily.data[0].sunsetTime,
              data.daily.data[0].sunriseTime
            )
          );
        } catch (err) {
          console.log(err.message);
        }
      },
      error: function(err) {
        console.log(err.message);
      }
    });
  }

  // Retrieves news articles periodically
  var cycleNewsInterval = null;
  function updateNews() {
    $.ajax({
      url:
        "http://newsapi.org/v1/articles?source=google-news&sortBy=top&apiKey=" +
        NEWS_API_KEY,
      dataType: "json"
    }).done(function(data) {
      try {
        var articles = data.articles;
        var index = 0;
        if (cycleNewsInterval) {
          clearInterval(cycleNewsInterval);
        }
        setNewsArticle(data.articles[index]);
        cycleNewsInterval = setInterval(function() {
          index++;
          index = index % articles.length;
          setNewsArticle(data.articles[index]);
        }, CYCLE_NEWS_INTERVAL);
      } catch (err) {
        console.log(err.message);
      }
    });
  }

  // Updates the news section with the given article
  function setNewsArticle(article) {
    $("#news-title").html(article.title);
    $("#news-description").html(article.description);

    var imageUrl =
      article.urlToImage ||
      "https://www.dcsltd.co.uk/wp-content/themes/dcs/images/ui.news-image-placeholder.jpg";
    $("#news-image").attr("src", imageUrl);
    $("#news").click(function() {
      window.open(article.url);
    });
  }

  // Call update methods on load, and set an interval so it refreshes
  updateDateTime();
  updateNews();
  setInterval(updateDateTime, UPDATE_TIME_INTERVAL);
  setInterval(updateWeather, UPDATE_WEATHER_INTERVAL);
  setInterval(updateNews, UPDATE_NEWS_INTERVAL);

  // Attempt to get user location
  var geoSuccess = function(position) {
    POSITION_LAT = position.coords.latitude;
    POSITION_LON = position.coords.longitude;
    updateWeather();
  };
  updateWeather();
  navigator.geolocation.getCurrentPosition(geoSuccess, null);

  // Helper function to turn a Dark Sky weather icon into a weather icon class
  function setWeatherIcon(iconId, sunset, sunrise) {
    var icon = "wi-day-sunny";
    var sunriseHour = new Date(sunrise * 1000).getHours();
    var sunsetHour = new Date(sunset * 1000).getHours();
    var currentHour = new Date().getHours();
    var isDay = currentHour > sunriseHour && currentHour <= sunsetHour;

    switch (iconId) {
      case "clear-day":
        icon = "wi-day-sunny";
        break;
      case "clear-night":
        icon = "wi-night-clear";
        break;
      case "partly-cloudy-day":
        icon = "wi-day-cloudy";
        break;
      case "partly-cloudy-night":
        icon = "wi-night-partly-cloudy";
        break;
      case "tornado":
        icon = "wi-tornado";
        break;
      case "rain":
        icon = isDay ? "wi-day-rain" : "wi-night-rain";
        break;
      case "snow":
        icon = isDay ? "wi-day-snow" : "wi-night-snow";
        break;
      case "sleet":
        icon = isDay ? "wi-day-sleet" : "wi-night-sleet";
        break;
      case "wind":
        icon = isDay ? "wi-day-windy" : "wi-cloudy-windy";
        break;
      case "fog":
        icon = isDay ? "wi-day-fog" : "wi-night-fog";
        break;
      case "cloudy":
        icon = isDay ? "wi-day-cloudy" : "wi-night-cloudy";
        break;
      case "hail":
        icon = isDay ? "wi-day-hail" : "wi-night-hail";
        break;
      case "thunderstorm":
        icon = isDay ? "wi-day-thunderstorm" : "wi-night-thunderstorm";
        break;
    }
    return '<i class="wi ' + icon + '"></i>';
  }
});
