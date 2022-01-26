const express = require('express');
const geocoderMiddleware = require("../middlewares/geocoderMiddleware");
const router = express.Router();
const logger = require("../logger/functionLogger");
const {getFromCache} = require("../cache/cache");
const {
    getContainersByLastEmptying,
    getContainersByAddress,
    getAllContainers,
    createNewContainer,
    editContainerLocation,
    editContainerLastEmptying,
    deleteContainer
} = require("../services/container");

router.get('/', async (req, res, next) => {
    try {
        const containers = await getAllContainers()
        logger.info('Return all containers', {containers})

        res.status(200).json({
            success: true,
            count: containers.length,
            data: containers
        })
    } catch (e) {
        logger.error(new Error(`Failed to return all containers: ${e}`));
    }
});

router.post('/', geocoderMiddleware, async (req, res, next) => {
    try {
        const container = await createNewContainer(req.body)
        logger.info('Create a new container', {container})

        res.status(200).send(container)
    } catch (e) {
        logger.error(new Error(`Failed to create a new container: ${e}`));
    }
});

router.get('/location/:lat/:lng/:radius', geocoderMiddleware, async (req, res, next) => {
    try {
        const location = {
            latitude: parseFloat(req.params.lat),
            longitude: parseFloat(req.params.lng)
        }

        let neaContainers = await getContainersByAddress(location, req.params.radius)
        logger.info('Return containers in specific radius', {neaContainers})

        res.status(200).send(neaContainers)
    } catch (e) {
        logger.error(new Error(`Failed to return containers in specific radius: ${e}`));
    }
});

router.patch('/location/:id', geocoderMiddleware, async (req, res, next) => {
    try {
        const id = req.params.id;
        const location = req.body.location;
        const address = req.body.location.address

        const container = await editContainerLocation(id, location, address)
        logger.info('Change a container location', {container})

        res.status(200).send(container)
    } catch (e) {
        logger.error(new Error(`Failed to edit a container location: ${e}`));
    }
});

router.get('/emptying/:time', async (req, res, next) => {
    try {
        const cacheTtlInMinutes = process.env.CACHE_TTL / 60;
        let lastEmptyingContainers = [];

        if (req.params.time <= cacheTtlInMinutes) {
            lastEmptyingContainers = getFromCache(parseInt(req.params.time))
        }

        if (lastEmptyingContainers.length === 0) {
            lastEmptyingContainers = await getContainersByLastEmptying(parseInt(req.params.time))
        }

        logger.info('Return last emptying containers', {lastEmptyingContainers})

        res.status(200).send(lastEmptyingContainers)
    } catch (e) {
        logger.error(new Error(`Failed to return last emptying containers: ${e}`));
    }
});

router.patch('/emptying/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const lastEmptying = req.body.lastEmptying;

        const container = await editContainerLastEmptying(id, lastEmptying)
        logger.info('Update the container last emptying', {container})

        res.status(200).send()
    } catch (e) {
        logger.error(new Error(`Failed to edit a container last emptying: ${e}`));
    }
});

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id

    try {
        const container = await deleteContainer(id)
        logger.info('Deleting a container properly', {container})

        res.status(200).send()
    } catch (e) {
        logger.error(e);
    }
});

module.exports = router;
