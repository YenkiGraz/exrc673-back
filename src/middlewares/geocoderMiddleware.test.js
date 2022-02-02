const {getAddressByLocation, geocoder, initAddress} = require('./geocoderMiddleware');

describe('geocoderMiddleware', () => {
    describe('test get address by location', () => {
        test('spy on geocoder', async () => {
            const geocoderSpy = jest.spyOn(geocoder, 'reverse')
            const location = {
                latitude: 31.7619663,
                longitude: 35.1830909
            };

            await getAddressByLocation(location)

            expect(geocoderSpy).toHaveBeenCalled()
        })
    })

    describe('init address', () => {
        test('send location and address and expect to get nothing', async () => {
            const body = {
                address: 'Kadish Luz St, Jerusalem, Israel',
                location: {
                    latitude: 31.7619663,
                    longitude: 35.1830909
                }
            }

            expect(await initAddress(body)).toBeFalsy()
        })

        test('send location and expect to get also an address', async () => {
            const body = {
                location: {
                    latitude: 31.7619663,
                    longitude: 35.1830909
                }
            }

            await initAddress(body)

            expect(body.location.address).toBe('מסוף אגד, Kadish Luz St, Jerusalem, Israel')
        })

        test('send request without address and coords and throw error', async () => {
            try {
                await initAddress({})
            } catch (e) {
                expect(e.message).toBe('{code: 400, error: "Wrong properties"}');
            }
        })
    })
})