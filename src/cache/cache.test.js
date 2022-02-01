const {addToCache, msToMinutes, getFromCache, cache} = require("./cache");

describe('cache', () => {
    describe('addToCache', () => {
        beforeEach(() => {
            cache.flushAll();
        })

        test('Did cache.set() called', () => {
            const cacheSpy = jest.spyOn(cache, 'set')
            const container = {
                color: 'red',
                containerType: 'Bottle Recycle',
                location: {
                    latitude: 31.7619663,
                    longitude: 35.1830909,
                    address: 'מסוף אגד, Kadish Luz St, Jerusalem, Israel',
                    coordinates: [31.7617356, 35.1830265]
                },
                lastEmptying: '2022-02-01T12:32:59.618Z'
            }

            addToCache(container)

            expect(cacheSpy).toHaveBeenCalledWith('1', JSON.stringify(container), undefined)
        })
    })

    describe('getFromCache', () => {
        beforeEach(() => {
            const currentDate = new Date();

            // Init 4 containers to four different minutes
            for (let i = 0; i < 4; i++) {
                addToCache({
                        _id: i,
                        color: 'red',
                        containerType: 'Bottle Recycle',
                        location: {
                            latitude: 31.7619663,
                            longitude: 35.1830909,
                            address: 'מסוף אגד, Kadish Luz St, Jerusalem, Israel',
                            coordinates: [31.7617356, 35.1830265]
                        },
                        lastEmptying: new Date(currentDate.getTime() + (i + 1) * 60000)
                    }
                )
            }
        })

        afterEach(() => {
            cache.flushAll();
        })

        test('Did cache.keys() called', () => {
            const cacheSpy = jest.spyOn(cache, 'keys')
            getFromCache(1)

            expect(cacheSpy).toHaveBeenCalled()
        })

        test('Request items who add at the last minute and return just one item', () => {
            expect(getFromCache(1).length).toBe(1)
            expect(getFromCache(0).length).toBe(0)
        })

        test('Request items who add at the last two minute and return two items', () => {
            expect(getFromCache(2).length).toBe(2)
            expect(getFromCache(0).length).toBe(0)
        })

        test('Request items who add at the last three minute and return three items', () => {
            expect(getFromCache(3).length).toBe(3)
            expect(getFromCache(0).length).toBe(0)
        })

        test('Request items who add at the last four minute and return all items', () => {
            expect(getFromCache(4).length).toBe(4)
            expect(getFromCache(0).length).toBe(0)
        })
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
})