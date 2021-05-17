const request = require('postman-request');
const _log = require('../../common/log');

const weather_ak = '29e32b76dcfd2ec88b9df1de04dd544a';
const weather_baseUrl = `http://api.weatherstack.com/`;

const getWeatherAtCoords = ({long,lat}, callback ) => {
    const endpoint = `current?access_key=${weather_ak}&query=${long},${lat}`;
    request(
        {
            url: `${weather_baseUrl}${endpoint}`,
            json: true
        },
        (err, response) => {
            if (err) {
                _log.error('HTTP REQUEST ERROR','something went wrong with the request to weatherStack.');
                callback('Unable to fetch weather data!', null);
            }
            else if (response.body.error) {
                _log.error('REQUEST RETURNED AN ERROR','A request reached weatherStack but returned an error / no results.');
                callback('Unable to fetch weather data!', null);
            }
            else if (response.body.current) {
                const {temperature, feelslike} = response.body.current;
                _log.success(' HTTP REQUEST SUCCESS ','successful request to weatherStack!');
                callback(null, {temperature, feelslike});
            }
        }
    );
};

module.exports = {
    getWeatherAtCoords
}

