import {useState,useContext,useEffect} from "react";
import {differenceInCalendarDays} from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { SiEthereum } from 'react-icons/si';



const startPayment = async ({ setError, setTxs, ether, addr }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress(addr);
    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.utils.parseEther(ether)
    });
    console.log({ ether, addr });
    console.log("tx", tx);
    setTxs([tx]);
  } catch (err) {
    setError(err.message);
  }
};

export default function BookingBox({listing}) {
    const [parkingFrom,setParkingFrom] = useState('');
    const [parkingUntil,setParkingUntil] = useState('');
    const [name,setName] = useState('');
    const [phone,setPhone] = useState('');
    const [redirect,setRedirect] = useState('');
    const {user} = useContext(UserContext);
    const [error, setError] = useState();
    const [txs, setTxs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: (numberOfDays * listing.price).toString(),
      addr: listing.walletAddress,
    });
  };

  async function handleContinue() {
    const response = await axios.post('/bookings', {parkingFrom,parkingUntil,name,phone,
      listing:listing._id,price:numberOfDays * listing.price,});
      const bookingId = response.data._id
    setRedirect('/account/bookings/' + bookingId);
  }

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    let numberOfDays = 0;
    if (parkingFrom && parkingUntil) {
        numberOfDays = differenceInCalendarDays(new Date(parkingUntil), new Date(parkingFrom));
    }

    if (redirect) {
        return <Navigate to ={redirect} />
    }

    return (
      <form className="bg-white shadow p-4 rounded-2xl" onSubmit={handleSubmit}>
      <div className="">
      <div className="text-2xl font-bold">
  <span className="inline-block align-middle mr-2"><SiEthereum size={24} /></span>
  Price: {listing.price} ETH / per day
</div>
        
              <div className="border rounded-2xl mt-4">
                <div className="flex">
                <div className="py-3 px-4">
                <label>Parking From:</label>
                <input type="date" value={parkingFrom} onChange={ev => setParkingFrom(ev.target.value)} />
              </div>
              <div className="py-3 px-4 border-l">
                <label>Parking Until:</label>
                <input type="date" value={parkingUntil} onChange={ev => setParkingUntil(ev.target.value)} />
              </div>
                </div> 
                
                    <div className="py-3 px-4 border-t">
                        <label >Full Name:</label>
                        <input type="text" value={name} onChange={ev => setName(ev.target.value)} />
                        <label>Mobile number:</label>
                        <input type="tel" value={phone} onChange={ev => setPhone(ev.target.value)} />
                        <label>Wallet Address:</label>
                        <input
  type="text"
  value={listing.walletAddress}
  className="input input-bordered block w-full focus:ring focus:outline-none border rounded-2xl bg-gray-50 text-gray-500 font-semibold text-lg cursor-default"
  placeholder="Recipient Address"
  readOnly
  style={{ pointerEvents: "none", fontSize: "14.5px" }}
/>



                        <label>Total Price (ETH) :</label>
                        <input
                        name="ether"
                        value={numberOfDays * listing.price}
                        className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-500 font-semibold text-lg cursor-default "
                        placeholder="Amount in ETH"
                        readOnly
                        style={{ pointerEvents: "none" }}
                        />
                    </div>
                
              </div>


        
        {txs.length === 0 && (
          <div className="mt-4">
  <button
    type="submit"
    className="primary"
  >
    Book this listing
    {numberOfDays > 0 && (
                    <span> ({numberOfDays * listing.price} ETH)</span>
                )}
  </button>
  </div>
)}
{txs.length > 0 && (
  <button type="button" onClick={handleContinue} className="primary mt-4">
    Continue to bookings page
  </button>
)}
        
        <ErrorMessage message={error} />
          <TxList txs={txs} />
      </div>
    </form>
    );
}

