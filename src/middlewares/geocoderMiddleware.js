const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY
};

const geocoder = NodeGeocoder(options);

const geocoderMiddleware = async (req, res, next) => {
    let geoObj;

    if (!req.body.address && req.body.location !== undefined) {
        geoObj = await geocoder.reverse({lat: req.body.location.latitude, lon: req.body.location.longitude});

        req.body.location.address = geoObj[0].formattedAddress
        req.body.location.coordinates = [geoObj[0].latitude, geoObj[0].longitude]
    }

    if (!req.body.location && req.body.address !== undefined) {
        geoObj = await geocoder.geocode(req.body.address);
        req.body.location = {
            address: geoObj[0].formattedAddress,
            coordinates: [geoObj[0].latitude, geoObj[0].longitude]
        }
    }

    next()
}

module.exports = geocoderMiddleware