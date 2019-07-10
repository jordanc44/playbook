# Playbook Deskclock

A simple desk clock for the Blackberry Playbook. Optimized for the Playbook screen, but CSS can be modified to better fit other tablets. 

![alt text](http://i.imgur.com/B6kpwkv.jpg "Playbook Deskclock")

### Setup

1. In `js/script.js`, modify the following values. 
   ```javascript
	var NEWS_API_KEY = "<<NEWS_API_KEY>>"; // https://newsapi.org/register
	var DARK_SKY_API_KEY = "<<DARK_SKY_API_KEY>>"; // https://darksky.net/dev/register
	
	var POSITION_LAT = 43.7524089; // Default location for weather, fallback
	var POSITION_LON = -79.2567648; // if browser is not able to get location
   ```
2. Host it somewhere.
3. Download **OragamiBrowser** from Blackberry World, navigate to website.
4. In the OragamiBrowser menu, turn on "Keep screen on".
5. Your desk clock is ready to go. Time, date, news and weather should refresh automatically.

> Note, the API keys included in this project are the limited free tiers and are not guaranteed to work.

### Credits

* [Dark Sky Weather API](https://darksky.net/dev/register) - Gets the current weather
* [News API](https://newsapi.org/) - Gets current news articles