const mongoose = require('mongoose');

const ContainerSchema = new mongoose.Schema({
    containerId: {
        type: String,
    }, location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        address: {
            type: String,
            required: true
        }
    },
    color: {
        type: String,
        required: [true, 'Please add container color']
    },
    containerType: {
        type: String,
        required: [true, 'Please add container type']
    },
    lastEmptying: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model('Container', ContainerSchema)