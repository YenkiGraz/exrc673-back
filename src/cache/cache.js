const NodeCache = require("node-cache");

const cache = new NodeCache();
const CACHE_TTL_IN_SECONDS = process.env.CACHE_TTL

const addToCache = (container) => {
    cache.set(container._id.toString(), JSON.stringify(container), CACHE_TTL_IN_SECONDS)
}

const getFromCache = (reqTime) => {
    const date = new Date();
    let listOfContainers = [];

    const cacheKeys = cache.keys();
    let cacheVal;

    cacheKeys.forEach(key => {
        cacheVal = JSON.parse(cache.get(key))

        let distanceTimeInMs = (date - cache.get(key).lastEmptying);
        let distanceTimeInMinute = msToMinutes(distanceTimeInMs);

        if (distanceTimeInMinute < reqTime) {
            listOfContainers.push(cache.get(key));
        }
    })

    return listOfContainers
}

const msToMinutes = (ms) => {
    let second = ms / 1000;
    let minutes = second / 60

    return parseFloat(minutes.toFixed(2))
}

module.exports = {
    getFromCache,
    addToCache
}