import {Link,useParams} from "react-router-dom";
import {useEffect,useState} from "react";
import axios from "axios";
import BookingBox from "../BookingBox";
import ListingGallery from "../ListingGallery";
import MapLink from "../MapLink";

export default function ListingPage() {
    const {id} = useParams();
    const [listing,setListing] = useState(null);
    
    useEffect(() => {
      if (!id) {
        return;
      }
      axios.get('/listings/'+id).then(response =>{
        setListing(response.data);
      });
    }, [id]);

    if (!listing) return '';

    
    return (
      <div className="mt-4 bg-secondary -mx-8 px-8 py-8">
        <h1 className="text-3xl">{listing.title}</h1>
        <MapLink>{listing.address}</MapLink>
          <ListingGallery listing={listing} />
        <div className="mt-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
          <div>
          <div className="my-4">
          <h2 className="font-semibold text-2xl">Description</h2>
          {listing.description}
        </div>
            Parking From: {listing.parkingFrom}<br />
            Parking Until: {listing.parkingUntil}<br />
            <h2 className="mt-4 font-semibold text-2xl">Extra Info</h2>
            <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{listing.extraInfo}</div>
        </div>
          <div>
            <BookingBox listing={listing} />
          </div>
  
        </div>
      </div>
    );
    
} 