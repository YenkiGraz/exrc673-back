const express = require('express');
const geocoderMiddleware = require("../middlewares/geocoderMiddleware");
const router = express.Router();
const Container = require('../models/Container')
const logger = require("../logger/functionLogger");

/* GET all containers. */
router.get('/', async (req, res, next) => {
    try {
        const containers = await Container.find()

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

/* POST create a container. */
router.post('/', geocoderMiddleware, async (req, res, next) => {
    try {
        const container = await Container.create(req.body)

        logger.info('Create a new container', {container})

        res.status(200).send(container)
    } catch (e) {
        logger.error(new Error(`Failed to create a new container: ${e}`));
    }
});

/* PATCH edit container location. */
router.patch('/location/:id', geocoderMiddleware, async (req, res, next) => {
    try {
        const container = await Container.findById(req.params.id)
        container.location.coordinates = [req.body.location.latitude, req.body.location.longitude]
        container.location.address = req.body.location.address
        container.save()

        logger.info('Change a container location', {container})

        res.status(200).send(container)
    } catch (e) {
        logger.error(new Error(`Failed to edit a container location: ${e}`));
    }
});

/* PATCH edit container last emptying. */
router.patch('/emptying/:id', async (req, res, next) => {
    try {
        const container = await Container.findById(req.params.id)
        container.lastEmptying = req.body.lastEmptying
        container.save()

        logger.info('Update the container last emptying', {container})

        res.status(200).send()
    } catch (e) {
        logger.error(new Error(`Failed to edit a container last emptying: ${e}`));
    }
});

/* DELETE a container. */
router.delete('/:id', async (req, res, next) => {
    try {
        const container = await Container.deleteOne({_id: req.params.id})
        if (container.deletedCount > 0) {
            logger.info('Deleting a container properly', {container})

            res.status(200).send()
        } else {
            throw new Error('Container was not deleted properly')
        }
    } catch (e) {
        logger.error(e);
    }
});

module.exports = router;
