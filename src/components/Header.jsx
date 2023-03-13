import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function () {

    const location = useLocation(); //gets the path of the route
    const navigate = useNavigate(); //enables navigation to the path upon clicking the element
    
    const isActive = (path) => {
        if (location.pathname === path) {
            return "text-black border-b-[3px] border-red-500";
        } else {
            return "text-gray-400 border-b-transparent";
        }
      };

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
            <div>
                <img src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg' alt='realtor-logo' 
                className="h-5 cursor-pointer" onClick={() => navigate("/")} />
            </div>
            <div>
                <ul className="flex space-x-10">
                    <li className={`cursor-pointer py-3 text-sm font-semibold ${isActive("/")}`} 
                    onClick={() => navigate("/")}>Home</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold ${isActive("/offers")}`} 
                    onClick={() => navigate("/offers")}>Offers</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold ${isActive("/sign-in")}`} 
                    onClick={() => navigate("/sign-in")}>Sign In</li>
                </ul>
            </div>
        </header>
    </div>
  )
}
