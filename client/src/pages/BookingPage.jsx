import {useParams} from "react-router-dom";
import {useState,useEffect} from "react";
import axios from "axios";
import MapLink from "../MapLink";
import ListingGallery from "../ListingGallery";
import BookingPeriod from "../BookingPeriod";

export default function BookingPage() {
    const {id} = useParams();
    const [booking,setBooking] = useState(null);
    useEffect(() => {
        if (id) {
            axios.get('/bookings').then(response => {
                const foundBooking = response.data.find(({_id}) => _id === id);
                if (foundBooking) {
                    setBooking(foundBooking);
                }
            });
        }
    }, [id]);

    if (!booking) {
        return '';
    }

    return (
        <div className="my-8">
            <h1 className="text-3xl">{booking.listing.title}</h1>
            <MapLink className="my-2 block">{booking.listing.address}</MapLink>
            <div className="bg-secondary p-6 my-6 rounded-2xl flex items-center justify-between">
                <div>
                <h2 className="text-2xl mb-4">Booking Information:</h2>
                <BookingPeriod booking={booking} />
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl">
                    <div>Total Price</div>
                    <div className="text-3xl">{booking.price} ETH</div>
                </div>
            </div>
            <ListingGallery listing={booking.listing} />
        </div>

    );
}