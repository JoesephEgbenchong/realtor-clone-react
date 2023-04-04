import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';
import { useParams } from 'react-router-dom';

export default function Category() {

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  //state for checking lastFetchedListing
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(8));
        const querySnap = await getDocs(q);
        //for handling lastFetched listing for determining the state of "Load more" button
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);
        //proceed with fetching data
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data()
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings")
      }
    }

    fetchListings();
  }, [params.categoryName]);

  const fetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), startAfter(lastFetchedListing), limit(4));
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data()
        });
      });
      setListings((prevState) => [...prevState, ...listings]);
    } catch (error) {
      toast.error("Could not fetch additional listings")
    }
  }

  if(loading){
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className='text-center text-3xl mt-6 font-bold mb-6'>Places for {params.categoryName}</h1>
      {listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </main>
          {lastFetchedListing && (
            <div className='flex justify-center items-center'>
              <button className='bg-white px-3 py-1.5 text-gray-700
               border border-gray-300 mb-6 mt-6 hover:border-slate-600 transition duration-150
               ease-in-out rounded-full' onClick={fetchMoreListings}>Load more</button>
            </div>
          )}
        </>
      ) : (<p>There are no current offers</p>)}
    </div>
  )
}
