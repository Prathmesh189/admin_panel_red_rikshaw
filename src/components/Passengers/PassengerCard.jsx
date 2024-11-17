import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfilePopup from "./ProfilePopup";
import { IndianRupee ,PhoneCall,BadgeCheck,ArrowRightToLine} from 'lucide-react';
import driverImage from '../../assets/driverimg.jpg';
<<<<<<< HEAD
import  defaultUser from "../../assets/default_user.png"
import  blockedUser from "../../assets/blocked_user.png"
=======
import defaultUserImage from "../../assets/default_user.png"
import blockedUser from "../../assets/blocked_user.png"
>>>>>>> 3c785cfb9e2ff8aef7de25a24da5269995d17c74
const PassengerCard= ({passenger })=>{
  
  
  const navigate = useNavigate();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(500);


  const handleViewProfile = () => {
    navigate(`/Home/passengerProfile`, { state: { passenger: passenger } }); 
  };
  
    return(
        <div className="p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                 <div className="relative bg-white  rounded-lg ">
      {/* Status at top-right corner */}
          <div className={`absolute right-1 text-sm text-white  rounded-full ${ passenger.is_active ? 'bg-green-600' : 'bg-red-600'}`}>
                  <BadgeCheck className="h-6 w-6 text-white outline-none" />
          </div>

      {/* Driver image and ratings */}
          <div className="flex items-center mb-4">
<<<<<<< HEAD
          <img src={ passenger.blockStatus ? blockedUser : (passenger.profile_image || defaultUser)} alt={`Profile picture of ${passenger.name}`} className="w-16 h-16 rounded-full object-cover shadow-md" />
=======
          
            <img src={ passenger.blockStatus ? blockedUser: passenger.profile_img || defaultUserImage } alt="" className="w-16 h-16 rounded-full object-cover shadow-md"/>
>>>>>>> 3c785cfb9e2ff8aef7de25a24da5269995d17c74

            <div className="flex flex-col text-black ">
              <h1 className="text-m font-bold  text-gray-900 pl-4 my-2">{passenger.name}</h1>
              <p className="text-sm flex font-medium text-gray-700 my-2 ml-3">
                <IndianRupee className="h-5 w-5 mr-4 color-black-900 "/>
<<<<<<< HEAD
                {passenger.balance && 0}
=======
                {passenger.bankDetails ? passenger.bankDetails.balance.toFixed(2) : walletBalance}
>>>>>>> 3c785cfb9e2ff8aef7de25a24da5269995d17c74
              </p>
              <p className="text-sm  flex font-medium text-gray-700 ml-3">
                <PhoneCall className="h-4 w-4 mr-4 color-black-900"/>
                {passenger.phone}
              </p>
              
            </div>
          </div>

      {/* View Profile button at bottom-right corner */}
          <div className="my-2 flex justify-between">
          <span className=" text-yellow-500 ">{passenger.total_rides} rides</span>
            <button onClick={handleViewProfile} className="flex items-center text-center text-blue-500 text-sm  font-semibold  rounded-lg pl-12   ">
              View Profile
              <ArrowRightToLine className="h-4 w-4 ml-2" />
            </button>
          </div>
          </div>
        {/* <ProfilePopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
                          
        /> */}
      </div>


        
    )
}

export default PassengerCard;