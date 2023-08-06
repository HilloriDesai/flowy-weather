# Flowy-weather
Weather app to display current weather of a city using NextJS for the front end, Express backend and the OpenWeatherMap API.

Pre-requisites: nodejs, npm

1. Clone the repo to your local folder.

2. Go to 'weather-app' folder and run `npm run build` command to build the modules.

3. After successful build, run `npm run start`. Visit `localhost:3000` to open the application.

4. Open another terminal and run `node express-server.js` to start the backend server at port 5000.

5. Enter a city name in the search bar and get its current weather data.


Difficulties faced:

1. Using tsx for the main component was causing issues with weatherData. State variable cannot be given another type and without type the variable in tsx part was throwing errors. Changed to jsx instead considering time.

2. Integrating with backend - network issues.
CORS issue when trying to call the weather api from frontend. Added cors config to allow localhost:3000 calls to the backend.

3. Jest tests were failing due to time taken in rendering the pages. Added setTimeOut to wait for a minute before comparing the results.

