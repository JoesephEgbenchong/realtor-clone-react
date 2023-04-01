import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination} from "swiper";
import "swiper/css/bundle";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import ContactOwner from '../components/ContactOwner';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function Listing() {

    const auth = getAuth();
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sharedLinkCopied, setSharedLinkCopied] = useState(false);
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    const [contactLandlord, setContactLandlord] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setListing(docSnap.data());
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId])

    if(loading){
        return <Spinner />
    }

  return (
    <main>
        <Swiper slidesPerView={1} navigation pagination={{type: "progressbar"}} effect="fake" 
        modules={[EffectFade]} autoplay={{delay: 3000}}>
            {listing.imgUrls.map((url, index) =>(
                <SwiperSlide key={index}>
                    <div className="relative w-full overflow-hidden h-[300px]" style={{ 
                        background: `url(${listing.imgUrls[index]}) center no-repeat`, 
                        backgroundSize: "cover"}}>

                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        <div className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer rounded-full border-2
         border-gray-400 w-12 h-12 flex justify-center items-center" onClick={() =>{
            navigator.clipboard.writeText(window.location.href)
            setSharedLinkCopied(true);
            setTimeout(() => {
                setSharedLinkCopied(false);
            }, 2000);
         }}>
            <FaShare className="text-lg text-slate-500" />
        </div>
        {sharedLinkCopied && (<p className="fixed top-[23%] right-[5%] font-semibold 
        border-2 border-gray-400 rounded-md bg-white z-10 p-2">Link copied</p>)}

        <div className="flex flex-col md:flex-row max-w-6xl lg:mx-auto m-4 p-4 rounded-lg shadow-lg bg-white
         lg:space-x-5">
            <div className=" w-full">
                <p className="text-2xl font-bold text-blue-900">
                    {listing.name} - ${listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 
                    listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
                <p className="flex items-center mt-6 mb-3 font-semibold">
                    <FaMapMarkerAlt className="text-green-700 mr-1" />{listing.address}
                </p>
                <div className="flex justify-start items-center space-x-4 w-[75%]">
                    <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white 
                     text-center font-semibold shadow-md">
                        {listing.type === "rent" ? "On Rent" : "For Sale"}
                    </p>
                    {listing.offer && (
                    <p className="w-full max-w-[200px] bg-green-800 rounded-md shadow-md text-white font-semibold
                     p-1 text-center">
                        ${(listing.regularPrice - listing.discountedPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} discount
                    </p>)}
                </div>
                <p className="mt-3 mb-3">
                    <span className="font-semibold">Description -</span>
                    {listing.description}
                </p>
                <ul className='flex items-center space-x-2 lg:space-x-10 text-sm font-semibold'>
                    <li className="flex items-center whitespace-nowrap">
                        <FaBed className="text-lg mr-3"/>
                        {+listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : `${listing.bedrooms} Bedroom`}
                    </li>
                    <li className="flex items-center whitespace-nowrap">
                        <FaBath className="text-lg mr-3"/>
                        {+listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : `${listing.bathrooms} Bathroom`}
                    </li>
                    <li className="flex items-center whitespace-nowrap">
                        <FaParking className="text-lg mr-3"/>
                        {listing.parking ? "Parking Spot" : "No Parking"}
                    </li>
                    <li className="flex items-center whitespace-nowrap">
                        <FaChair className="text-lg mr-3"/>
                        {listing.furniture ? "Furnished" : "Not Furnished"}
                    </li>
                </ul>
                {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
                    <div className='mt-6'>
                        <button onClick={() => setContactLandlord(true)} className='px-7 py-3 bg-blue-600 text-white font-semibold
                            w-full cursor-pointer shadow-md rounded-md hover:bg-blue-700 hover:shadow-lg 
                            transition duration-150 ease-in-out active:bg-blue-900 focus:shadow-lg uppercase'>
                        Contact Landlord
                        </button>
                    </div>
                )}
                {contactLandlord && <ContactOwner userRef={listing.userRef} listing={listing} />} 
                
            </div>
            <div className="w-full overflow-x-hidden h-[200px] lg:h-[400px] z-10 mt-6 md:mt-0 md:ml-2">
                <MapContainer center={[listing.geolocation.lat, listing.geolocation.lng]} 
                zoom={13} scrollWheelZoom={false} style={{height:"100%", width:"100%"}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                        <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    </main>
  )
}
