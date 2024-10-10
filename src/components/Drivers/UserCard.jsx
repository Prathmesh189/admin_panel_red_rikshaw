import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import driverImage from '../../assets/driverimg.jpg';
import rikshawicon from '../../assets/rickshaw.png';
import { BadgeCheck,PhoneCall ,ArrowRightToLine} from 'lucide-react';

const UserCard= ({driver})=>{
console.log(driver);

  const navigate = useNavigate();
  const handleViewProfile = () => {
<<<<<<< HEAD
    navigate(`/Home/driverProfile`, { state: { driver: driver } });
=======
    navigate('/Home/driverProfile'); 
>>>>>>> ce44213aad336f953038bb6eef20d4ff704d2095
  };
    return(
        <div className="p-3 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <div className="relative bg-white  rounded-lg ">
      {/* Status at top-right corner */}
          <div className={`absolute top-2 right-2 text-sm text-white  rounded-full ${ driver.isActive ? 'bg-green-600' : 'bg-red-600'}`}>
              <BadgeCheck className="h-6 w-6 text-white outline-none" />
          </div>

      {/* Driver image and ratings */}
          <div className="flex items-center mb-4">
          <img src={driverImage} alt="" className="w-16 h-16 rounded-full object-cover shadow-md"/>
            <div className="flex flex-col ">
              <h2 className="text-m font-bold text-gray-900 pl-4 my-2">{driver.name}</h2>
              <p className="text-sm flex font-medium text-gray-600 mt-2 ml-3">
                <img src={rikshawicon} alt="" className="w-6 h-6 mr-2"/>
                {driver.vehicle_number}
              </p>
              <p className="text-sm  flex font-medium text-gray-600 ml-3">
                <PhoneCall className="h-4 w-4 mr-4 color-black-900"/>
                {driver.phone}
              </p>
              {/* Add star icons or other rating visuals here if needed */}
            </div>
          </div>

      {/* Vehicle number and phone number */}
          <div className="mb-4">
          <span className=" text-yellow-500 ">{'★'.repeat(Math.floor(driver.rating))}</span>
            
          </div>

      {/* View Profile button at bottom-right corner */}
          <div className="my-2 absolute top-20  right-2">
          
          <button 
  onClick={() => handleViewProfile(driver._id)} 
  className="flex items-center text-center text-blue-500 text-sm py-10 font-semibold rounded-lg"
>
  View Profile
  <ArrowRightToLine className="h-4 w-4 ml-2" />
</button>
          </div>
          </div>
      </div>
        
     


        
    )
}

export default UserCard;