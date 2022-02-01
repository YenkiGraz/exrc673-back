const Container = require("../models/ContainerSchema");
const {addToCache} = require("../cache/cache");

const msToMinutes = (ms) => {
    if (ms <= 0) return 0;

    let second = ms / 1000;
    let minutes = second / 60

    return parseFloat(minutes.toFixed(2))
}

const getContainersByLastEmptying = async (time) => {
    const date = new Date();

    const containers = await Container.aggregate([{
        $project: {
            distanceTime: {
                $subtract: [date, '$lastEmptying']
            },
            color: '$color',
            location: '$location',
            containerType: '$containerType',
            lastEmptying: '$lastEmptying'
        },
    }])


    let filteredContainers = containers.filter(container => {
        let distance = msToMinutes(container.distanceTime)
        delete container.distanceTime;

        return distance <= time;
    })

    return filteredContainers;
}

const getContainersByAddress = async (location, radius) => {
    const nearContainers = await Container.aggregate([{
        $geoNear: {
            near: {
                type: "Point",
                coordinates: [location.latitude, location.longitude]
            },
            distanceField: "dist.calculated",
            maxDistance: parseInt(radius) * 1000,
            spherical: true
        }
    }])

    nearContainers.forEach(container => {
        delete container.dist
    })

    return nearContainers;
}

const getAllContainers = async () => {
    return Container.find()
}

const createNewContainer = async (newContainer) => {
    return Container.create(newContainer)
}

const editContainerLocation = async (id, newLocation, newAddress) => {
    const container = await Container.findById(id)
    container.location.coordinates = [newLocation.latitude, newLocation.longitude]
    container.location.address = newAddress
    container.save()

    return container;
}

const editContainerLastEmptying = async (id, lastEmptying) => {
    const container = await Container.findById(id)
    container.lastEmptying = lastEmptying
    container.save()
    addToCache(container)

    return container;
}

const deleteContainer = async (id) => {
    const container = await Container.deleteOne({_id: id})

    if (container.deletedCount === 0) {
        throw new Error('Container was not deleted properly')
    }

    return container
}

module.exports = {
    getContainersByLastEmptying,
    getContainersByAddress,
    getAllContainers,
    createNewContainer,
    editContainerLocation,
    editContainerLastEmptying,
    deleteContainer,
    msToMinutes
}