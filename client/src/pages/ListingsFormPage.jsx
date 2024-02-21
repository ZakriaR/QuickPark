import PhotosUploader from "../PhotosUploader";
import {useState,useEffect} from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import {Navigate,useParams} from "react-router-dom";

export default function ListingsFormPage () {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [extraInfo,setExtraInfo] = useState('');
    const [parkingFrom,setParkingFrom] = useState('');
    const [parkingUntil,setParkingUntil] = useState('');
    const [price,setPrice] = useState('');
    const [walletAddress,setWalletAddress] = useState('');
    const [redirect,setRedirect] = useState(false);

    useEffect(() => {
        if(!id) {
            return;
        }
        axios.get('/listings/'+id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setExtraInfo(data.extraInfo);
            setParkingFrom(data.parkingFrom);
            setParkingUntil(data.parkingUntil);
            setPrice(data.price);
            setWalletAddress(data.walletAddress)
        });
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }

    function preInput(header,description) {
        return (
        <>
        {inputHeader(header)}
        {inputDescription(description)}
        </>
        );
    }

    async function saveListing(ev) {
        ev.preventDefault();
        const listingData = {
            title, address, addedPhotos, description, extraInfo, parkingFrom, parkingUntil, price, walletAddress,
        };
        if (id) {
            await axios.put('/listings', {
                id,
                ...listingData
                });
            setRedirect(true);
        } else {
            await axios.post('/listings', listingData);
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/account/listings'} />
    }

    return (
        <div>
            <AccountNav />
                <form onSubmit={saveListing}>
                    {preInput('Title', 'Title for your listing')}
                    <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Listing title"/>
                    {preInput('Address', 'Address for your parking spot')}
                    <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address"/>
                    {preInput('Photos', 'Please upload clear photos of the parking spot')}
                    <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                    {preInput('Description', 'Description of the parking spot')}
                    <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                    {preInput('Extra Info', 'Please add any extra information')}
                    <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                    {preInput('Parking Times', 'Please add parking spot availability times')}
                    <div className="w-1/6 grid gap-2 sm:grid-cols-2">
                        <div>
                            <h3 className="mt-2 -mb-1">Parking From</h3>
                            <input type="text" value={parkingFrom} onChange={ev => setParkingFrom(ev.target.value)} placeholder="14" />
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">Parking Until</h3>
                            <input type="text" value={parkingUntil} onChange={ev => setParkingUntil(ev.target.value)} placeholder="11" />
                        </div>
                    </div>
                    {preInput('Crypto Wallet Address', 'Please add your wallet address')}
                    <input type="text" value={walletAddress} onChange={ev => setWalletAddress(ev.target.value)} />
                    {preInput('Price', 'Please add the price in ETH')}
                    <div className="w-1/6 grid">
                        <h3 className="mt-2 -mb-1">Price (ETH)</h3>
                        <input type="text" value={price} onChange={ev => setPrice(ev.target.value)} placeholder="" />
                    </div>
                    <button className="primary my-4">Save</button>
                </form>
            </div>
    );
}