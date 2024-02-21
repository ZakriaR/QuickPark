import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


export default function IndexPage() {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    axios.get("/listings").then((response) => {
      setListings(response.data);
    });
  }, []);

  const filteredListings = listings
    .filter((listing) =>
      listing.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((listing) => {
      if (minPrice && maxPrice) {
        return listing.price >= parseFloat(minPrice) && listing.price <= parseFloat(maxPrice);
      } else if (minPrice) {
        return listing.price >= parseFloat(minPrice);
      } else if (maxPrice) {
        return listing.price <= parseFloat(maxPrice);
      } else {
        return true;
      }
    });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  return (
    <div>
      <div className="flex items-center rounded-full border-2 border-primary px-2 py-0.5 mb-4 max-w-md mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Where are you going?"
          className="bg-transparent w-full outline-none"
        />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5271ff" className="w-8 h-8">
  <path d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a4.125 4.125 0 102.338 7.524l2.007 2.006a.75.75 0 101.06-1.06l-2.006-2.007a4.125 4.125 0 00-3.399-6.463z" clipRule="evenodd" />
</svg>

      </div>
      <div className="flex justify-center items-center mb-4 max-w-md mx-auto">
        <label htmlFor="minPrice" className="mr-2">
          Min price:
        </label>
        <input
          type="number"
          id="minPrice"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="border border-gray-300 px-4 py-2 rounded-2xl w-24"
          placeholder="0"
        />
        <span className="mx-2">to</span>
        <label htmlFor="maxPrice" className="mr-2">
          Max price:
        </label>
        <input
          type="number"
          id="maxPrice"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="border border-gray-300 rounded-2xl px-4 py-2 w-24"
          placeholder="0.005"
        />
        <span className="mx-2">ETH</span>
      </div>

      <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredListings.length > 0 &&
          filteredListings.map((listing) => (
            <Link to={"/listing/" + listing._id} key={listing._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {listing.photos?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square"
                    src={"http://localhost:4000/uploads/" + listing.photos?.[0]}
                    alt=""
                  />
                )}
              </div>
              <h2 className="font-bold">{listing.address}</h2>
              <h3 className="text-sm text-gray-500">{listing.title}</h3>
              <div className="mt-2">
                <span className="font-bold">{listing.price} ETH</span> per day
              </div>
            </Link>
          ))}
        {filteredListings.length === 0 && (
          <p className="text-center">Please login to view listings.</p>
        )}
      </div>
    </div>
  );
}


