const mongoose = require('mongoose');
const Container = require('../models/ContainerSchema');
const {msToMinutes} = require("./container");
require('dotenv').config()

describe('Container service tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.DEV_MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => {

        })
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    describe('msToMinutes', () => {
        test('check numbers less and equal to 0 and except get 0', () => {
            expect(msToMinutes(0)).toBe(0)
            expect(msToMinutes(-1)).toBe(0)
        })

        test('check positive numbers and except get number greater than 0', () => {
            expect(msToMinutes(1000)).toBeGreaterThan(0)
        })

        test('check max numbers after point', () => {
            const minutes = msToMinutes(1000)
            const MAX_NUM_AFTER_POINT = 2

            expect(minutes.toString().split('.')[1].length <= MAX_NUM_AFTER_POINT).toBe(true)
        })
    })

    describe('Container schema test', () => {
        beforeAll(async () => {
            await Container.remove({});
        })

        afterEach(async () => {
            await Container.remove({});
        })

        test('add container', async () => {
            let container = await Container.create({
                color: 'red',
                containerType: 'Bottle Recycle',
                location: {
                    latitude: 31.7619663,
                    longitude: 35.1830909,
                    address: 'מסוף אגד, Kadish Luz St, Jerusalem, Israel',
                    coordinates: [31.7617356, 35.1830265]
                },
                lastEmptying: new Date()
            });

            await container.save();

            expect(container.color).toBe('red')
            expect(container.containerType).toBe('Bottle Recycle')
            expect(typeof container.location).toBe('object')
            expect(container.lastEmptying).toBeTruthy()
        })

        test('delete container', async () => {
            let container = await Container.create({
                color: 'red',
                containerType: 'Bottle Recycle',
                location: {
                    latitude: 31.7619663,
                    longitude: 35.1830909,
                    address: 'מסוף אגד, Kadish Luz St, Jerusalem, Israel',
                    coordinates: [31.7617356, 35.1830265]
                },
                lastEmptying: new Date()
            });

            await container.save();

            expect(await Container.deleteOne({color: 'red'})).toEqual({deletedCount: 1});
        })

        test('edit container', async () => {
            let container = await Container.create({
                color: 'red',
                containerType: 'Bottle Recycle',
                location: {
                    latitude: 31.7619663,
                    longitude: 35.1830909,
                    address: 'מסוף אגד, Kadish Luz St, Jerusalem, Israel',
                    coordinates: [31.7617356, 35.1830265]
                },
                lastEmptying: new Date()
            });

            await container.save();
            container.color = 'green';
            const updatedContainer = await container.save()

            expect(await Container.findOne({color: 'red'})).toBeFalsy()
            expect(updatedContainer.color).toBe('green');
        })

        test('get specific container', async () => {
            await Container.create({
                color: 'red',
                containerType: 'Bottle Recycle',
                location: {
                    address: 'מסוף אגד, Kadish Luz St, Jerusalem, Israel',
                    coordinates: [31.7617356, 35.1830265]
                },
                lastEmptying: new Date()
            });

            await Container.create({
                color: 'green',
                containerType: 'Bottle Recycle',
                location: {
                    address: 'מסוף אגד, Kadish Luz St, Jerusalem, Israel',
                    coordinates: [31.7617356, 35.1830265]
                },
                lastEmptying: new Date()
            });

            expect((await Container.find({color: 'red'})).length).toBe(1)
            expect((await Container.find({color: 'green'})).length).toBe(1)
            expect((await Container.find({color: 'yellow'})).length).toBe(0)
        })

        test('get all containers', async () => {
            await Container.create({
                color: 'red',
                containerType: 'Bottle Recycle',
                location: {
                    address: 'מסוף אגד, Kadish Luz St, Jerusalem, Israel',
                    coordinates: [31.7617356, 35.1830265]
                },
                lastEmptying: new Date()
            });

            await Container.create({
                color: 'green',
                containerType: 'Bottle Recycle',
                location: {
                    address: 'מסוף אגד, Kadish Luz St, Jerusalem, Israel',
                    coordinates: [31.7617356, 35.1830265]
                },
                lastEmptying: new Date()
            });

            expect((await Container.find({})).length).toBe(2)
        })
    })
})


