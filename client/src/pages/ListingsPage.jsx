import {Link, useParams} from "react-router-dom";
import AccountNav from "../AccountNav";
import {useState, useEffect} from "react";
import axios from "axios";
import ListingImage from "../ListingImage";

export default function ListingsPage() {
    const [listings,setListings] = useState([]);
    useEffect(() => {
        axios.get('/user-listings').then(({data}) => {
          setListings(data);
        });
      }, []);

    return (
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/listings/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                    Add new listing
                </Link>
            </div>
            <div className="mt-4">
                {listings.length > 0 && listings.map(listing => (
                    <Link to={'/account/listings/'+listing._id} className="flex gap-4 bg-secondary p-4 rounded-2xl mb-4">
                        <div className="flex w-32 h-32 bg-secondary">
                            <ListingImage listing={listing} />
                        </div>
                        <div>
                            <h2 className="text-1.5xl font-bold">{listing.title}</h2>
                            <p className="text-md mt-2">{listing.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
            
        </div>
    );
}
