const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    listing: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Listing'},
    user: {type:mongoose.Schema.Types.ObjectId, required:true},
    parkingFrom: {type:Date, required:true},
    parkingUntil: {type:Date, required:true},
    name: {type:String, required:true},
    phone: {type:String, required:true},
    price: Number,
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;