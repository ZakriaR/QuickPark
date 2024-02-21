export default function PlaceImage({listing,index=0,className=null}) {
    if (!listing.photos?.length) {
        return '';
    }

    if (!className) {
        className='object-cover';
    }

    return (
        <img className={className} src={'http://localhost:4000/uploads/'+listing.photos[index]} alt="" />
    );
}