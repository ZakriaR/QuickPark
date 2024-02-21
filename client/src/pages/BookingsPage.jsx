import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import ListingImage from "../ListingImage";
import { Link } from "react-router-dom";
import BookingPeriod from "../BookingPeriod";
import { SiEthereum } from 'react-icons/si';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
              to={"/account/bookings/" + booking._id}
              className="flex gap-4 bg-secondary rounded-2xl overflow-hidden mb-4"
              key={booking._id}
            >
              <div className="w-48">
                <ListingImage
                  listing={booking.listing}
                  className="h-full object-cover"
                />
              </div>
              <div className="py-3 pr-3 grow">
                <h2 className="text-1.5xl font-bold mb-2">{booking.listing.title}</h2>
                <div className="text-xl">
                  <BookingPeriod
                    booking={booking}
                    className="mb-2 mt-4 text-gray-500"
                  />
                  <div className="flex gap-1">
                  <span className="inline-block align-middle "><SiEthereum size={24} /></span>
                    <span className="text-xl">
                      Total Price: {booking.price} ETH
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}




