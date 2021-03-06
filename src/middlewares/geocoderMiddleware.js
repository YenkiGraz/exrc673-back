const NodeGeocoder = require('node-geocoder');
const ApiError = require("../error/ApiError");
require('dotenv').config()

const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY
};

const geocoder = NodeGeocoder(options);

const initAddress = async (body) => {
    if (body.address !== undefined && body.location !== undefined) {
        return
    }

    if (!body.address && body.location !== undefined) {
        await getAddressByLocation(body.location);
        return
    }

    if (body.location === undefined && body.address === undefined) {
        throw new ApiError.BadRequest('Wrong properties')
    }
}

const getAddressByLocation = async (location) => {
    const geoObj = await geocoder.reverse({lat: location.latitude, lon: location.longitude});

    location.address = geoObj[0].formattedAddress;
    location.coordinates = [geoObj[0].latitude, geoObj[0].longitude];
}

const geocoderMiddleware = async (req, res, next) => {
    try {
        await initAddress(req.body)
        next()
    } catch (err) {
        next(new ApiError.InternalError(err))
    }
}

module.exports = {
    geocoderMiddleware,
    initAddress,
    getAddressByLocation,
    geocoder
}