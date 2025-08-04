import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
    client: {type: String, required: true},
    name: {type: String, required: true},
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'closed'],
        required: true
    },
    start_date: {type: Date, required: true},
    end_date: {type: Date, required: true},
});

export const Deal = mongoose.model('Deal', dealSchema);