const request = require('postman-request');
const _log = require('../../common/log');

const geo_at = 'pk.eyJ1IjoiZGV2bWlrZSIsImEiOiJja29vbGY4eTUwY2RhMnBzano5bGxjcXV5In0.jxai2zuV4KF7xz5c5RfZ3A';
const geo_baseUrl = `https://api.mapbox.com/geocoding/v5/`;

/**
 * uses mapbox api to extract coordinates by search string.
 * @param dest - string.
 * @param callback - this callback should accept 2 params: error, data, both nullable.
 */
const getCoordsByDestination = (dest, callback) => {
    const geo_endpoint = `mapbox.places/${dest}.json?access_token=${geo_at}`;
    request(
        {
            url: `${geo_baseUrl}${geo_endpoint}`,
            json: true
        },
        (err, response) => {
            if (err) {
                _log.error('HTTP REQUEST ERROR','something went wrong with the request to mapbox.');
                callback('something went wrong with request', null);
            }
            else if (response.body.features && response.body.features.length > 0) {
                _log.success(' HTTP REQUEST SUCCESS ','successful request to mapbox!');
                const features = response.body.features[0];
                const location = features.place_name;
                const long = features.geometry.coordinates[0];
                const lat = features.geometry.coordinates[1];
                _log.misc(`The coordinates for ${location} are as follows: long = ${long}, lat = ${lat}`);

                callback(null, {long, lat, location});
            } else {
                _log.error('REQUEST RETURNED AN ERROR','A request reached mapbox but returned an error / no results.');
                callback('result is empty or containing some sort of error', null);
            }
        }
    );
}

module.exports = {
    getCoordsByDestination
}