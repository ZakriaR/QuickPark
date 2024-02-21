const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    extraInfo: String,
    parkingFrom: Number,
    parkingUntil: Number,
    price: Number,
    walletAddress: String,
});

const ListingModel = mongoose.model('Listing', listingSchema);

module.exports = ListingModel;
