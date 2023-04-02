import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useState } from 'react'
import { useEffect } from 'react';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from 'react-router-dom';

export default function Slider() {

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchListings = async () => {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      }
      fetchListings();
    }, []);
  
    if(loading){
      return <Spinner />;
    }
  
    if(listings.length === 0){
      return <></>;
    }
  

  return (
    listings && (
        <>
            <Swiper slidesPerView={1} navigation pagination={{type: "progressbar"}} effect="fake"
                modules={[EffectFade]} autoplay={{delay: 3000}}>
                {listings.map((listing) => (
                    <SwiperSlide key={listing.id} onClick={() => navigate(`category/${listing.data.type}/${listing.id}`)}>
                        <div className='relative w-full h-[300px] overflow-hidden' style={{ 
                            background: `url(${listing.data.imgUrls[0]}) center no-repeat`,
                            backgroundSize: "cover"
                        }}>
                        </div>
                        <p className="absolute text-[#f1faee] left-1 top-3 font-medium 
                        max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
                            {listing.data.name}
                        </p>
                        <p className="absolute text-[#f1faee] left-1 bottom-1 font-semibold 
                        max-w-[90%] bg-[#e64936] shadow-lg opacity-90 p-2 rounded-tr-3xl">
                            ${listing.data.offer ? listing.data.discountedPrice.
                            toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                            : 
                            listing.data.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            {listing.data.type === "rent" && " /month"}
                        </p>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
  );
}
