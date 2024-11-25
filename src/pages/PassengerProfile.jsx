import React, { useState } from 'react';
import Header from "../components/common/Header";
import { ChevronLeft, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import driverImage from '../assets/driverimg.jpg';
import PassengerRides from '../components/Passengers/PassengerRides';
import defaultUser from "../assets/default_user.png"
import blockedUser from "../assets/blocked_user.png"
import ApiConfig from '../Consants/ApiConfig';
import DriverTransactionTable from '../components/Drivers/DriverTransactionTable';
import axios from 'axios';

const PassengerProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [passenger, setPassenger] = useState(location.state.passenger); // State for passenger data
    const [loading, setLoading] = useState(false); // Loading state for API call
    const [activeTab, setActiveTab] = useState('Rides');
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [status, setStatus] = useState('Block');
    const [walletBalance, setWalletBalance] = useState(0);
    const [lockBalance, setLockBalance] = useState(0);
    const [showAddMoneyPopup, setShowAddMoneyPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [password, setPassword] = useState('');
    const [addAmount,setAddAmount] = useState(0)
    console.log(passenger)

    const togglePopup = () => {
        setShowAddMoneyPopup(!showAddMoneyPopup);
    };

    const toggleStatus = () => {
        const newStatus = status === 'Block' ? 'Unblock' : 'Block';
        setStatus(newStatus);
    };

    // const handleBlockToggle = async () => {
    //     setLoading(true);
    //     try {
    //         // Sending the PUT request to toggle block status on the backend
    //         const response = await fetch(ApiConfig.putBlockStatus(passenger._id), {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 blockStatus: !passenger.blockStatus, 
    //             }),
    //         });
    
    //         if (response.ok) {
    //             const data = await response.json();
    //             console.log('Block status updated:', data); // Debugging log
    //             setPassenger({ ...passenger, blockStatus: !passenger.blockStatus }); // Update passenger state
    //             fetchPassengerData(); // Refetch data to get the latest block status
    //         } else {
    //             alert('Failed to update block status. Please try again.');
    //         }
    //     } catch (error) {
    //         console.error('Error toggling block status:', error);
    //         alert('An error occurred while updating the block status.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    
    const handleBlockToggle = async () => {
        setLoading(true);
        try {
            const response = await fetch(ApiConfig.putBlockStatus(passenger._id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    blockStatus: !passenger.blockStatus,
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Block status updated:', data);
                setPassenger({ ...passenger, blockStatus: !passenger.blockStatus });
                fetchPassengerData();
            } else {
                alert('Failed to update block status. Please try again.');
            }
        } catch (error) {
            console.error('Error toggling block status:', error);
            alert('An error occurred while updating the block status.');
        } finally {
            setLoading(false);
        }
    };
    
    const fetchPassengerData = async () => {
        try {
            const response = await fetch(ApiConfig.getPassengerDetails(passenger._id)); 
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched passenger data:", data); // Debugging log
                setPassenger(data.user); // Update the state with the updated user data
            } else {
                console.error('Failed to fetch passenger data');
            }
        } catch (error) {
            console.error('Error fetching passenger data:', error);
        }
    };
    
    const handleDeleteClick = () => {
        setShowDeletePopup(true); // Open delete confirmation popup
    };

    const handleDeleteConfirm = () => {
        if (password === 'Steve@123') {
            alert("User deleted successfully");
            setShowDeletePopup(false); // Close the delete popup
            setPassword(''); // Clear the password input
            navigate('/Home/drivers'); // Redirect to another page
        } else {
            alert("Incorrect password. Please try again.");
        }
    };

    const handleCloseDeletePopup = () => {
        setShowDeletePopup(false); // Close the popup
        setPassword(''); // Clear the password input
    };

    const handleBackClick = () => {
        navigate('/Home/passengers');
    };

    const handleAddMoney = async()=>{
        const newAmount = parseFloat(addAmount);
        if (isNaN(newAmount) || newAmount <= 0) {
          alert('Please enter a valid amount.');
          return;
        }
        
        const postData={
            userId : passenger._id,
            amount : newAmount
        }
        console.log(postData)
        try {
            const response = await axios.post(ApiConfig.postAddMoneyEndpoint(),postData,{
                headers: { 
                  'Content-Type': 'application/json', }
              })
            console.log("response ----")
            console.log(response)
            if(response.status == 200){
                alert(response.data.message)
              setWalletBalance(response.data.data.balance)
            }
            else{
                alert("failed to add money")
            }
            
        } catch (error) {
            console.log(error)
        }
        // setWalletBalance(walletBalance + newAmount);
        setAddAmount(0)
        togglePopup()
        setActiveTab('Rides')
    }
    
   

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title='Passenger Profile' />
            <button
                onClick={handleBackClick}
                className="flex items-center bg-white text-black pl-8 pt-3 whitespace-nowrap"
            >
                <ChevronLeft size={30} style={{ color: "black", minWidth: "20px" }} />
                <h2 className="pl-2 font-bold text-m ">Back</h2>
            </button>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 bg-white'>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white shadow-lg rounded-lg p-6 text-black"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div className="flex justify-center md:justify-start">
                        <img
                            src={passenger.blockStatus ? blockedUser : (passenger.profile_img || defaultUser)}
                            alt="Profile"
                            className="w-50 h-50 md:w-40 md:h-40 rounded-full object-cover shadow-md"
                        />
                    </motion.div>

                    <motion.div className="text-center md:text-left space-y-2">
                        <h1 className="text-2xl font-semibold text-gray-800">{passenger.name}</h1>
                        <p className="text-gray-600">📞 {passenger.phone}</p>
                        <p className="text-gray-600">✉️ {passenger.email}</p>
                        <p className="text-gray-600">⭐ {passenger.rating} Reviews</p>
                        <p className="flex text-gray-600">
                            <Car style={{ color: 'black', marginRight: '10px' }} /> {passenger.total_rides} Total Rides
                        </p>
                    </motion.div>

                    <motion.div className="space-y-3">
                        <div className="flex flex-wrap items-center my-2 justify-center">
                          <button
                                onClick={handleBlockToggle}
                                className={`ml-4 px-5 py-1 rounded-full font-semibold text-white ${passenger.blockStatus ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                disabled={loading} // Disable button while API call is in progress
                            >
                                {loading ? 'Processing...' : passenger.blockStatus ? 'Unblock' : 'Block'}
                            </button>

                            <button
                                onClick={handleDeleteClick}
                                className="ml-4 px-3 py-1 my-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
                            >
                                Delete
                            </button>


                            {passenger.blockStatus ? (
                                <p className='text-sm m-2 font-semibold text-red-500' >Money can not be added because user is blocked</p>
                            ):(
                                <button
                                onClick={()=>{setShowAddMoneyPopup(true)
                                    setActiveTab("")
                                }}
                                className="ml-4 px-3 py-1 my-2 bg-blue-400 text-white font-semibold rounded hover:bg-blue-700"
                            >
                                Add Money
                            </button>
                            )}

                        </div>

                        <div className="flex items-center justify-center md:justify-start pt-3">
                            <div className="flex w-full flex-col justify-center gap-3 items-start">
                                <div className="bg-white flex w-full flex-wrap flex-row justify-around">
                                    <h1 className="text-xl font-semibold">Wallet Balance</h1>
                                    <p className="text-xl">
                                        ₹{passenger.bankDetails ? (passenger.bankDetails.balance || walletBalance) : walletBalance}
                                    </p>
                                </div>
                                <div className="bg-white flex w-full flex-wrap flex-row justify-around">
                                    <h1 className="text-xl font-semibold">Lock Balance</h1>
                                    <p className="text-xl">
                                        ₹{passenger.bankDetails ? (passenger.bankDetails.lock_amount || lockBalance) : lockBalance}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Delete Confirmation Popup */}
                {showDeletePopup && (
                    <div className="fixed inset-0 flex items-center justify-center text-black bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-80">
                            <h2 className="text-xl font-semibold mb-4">Please enter your password to confirm:</h2>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                placeholder="Enter password"
                            />
                            <button
                                onClick={handleDeleteConfirm}
                                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Confirm Delete
                            </button>
                            <button
                                onClick={handleCloseDeletePopup}
                                className="mt-2 w-full px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}


                {showAddMoneyPopup && (
                    <div className="fixed inset-0 flex items-center justify-center text-black bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-80">
                            <h2 className="text-xl font-semibold mb-4">Please enter your amount to confirm:</h2>
                            <input
                                type="text"
                                value={addAmount}
                                onChange={(e) => setAddAmount(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                placeholder="Enter amount"
                            />
                            
                            <button
                                onClick={handleAddMoney}
                                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Add amount
                            </button>
                            <button
                                onClick={()=>{
                                    togglePopup()
                                    setActiveTab("Rides")
                                }}
                                className="mt-2 w-full px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}


                {/* Tab Selection */}
                {!showDeletePopup && (
                    <div className="border-b border-gray-300 mb-6">
                        <ul className="flex justify-around">
                            <li
                                className={`cursor-pointer py-2 ${activeTab === 'Rides' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('Rides')}
                            >
                                Trip Summary
                            </li>
                            <li
                                className={`cursor-pointer py-2 ${activeTab === 'transactionHistory' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-700'}`}
                                onClick={() => setActiveTab('transactionHistory')}
                            >
                                Transaction History
                            </li>
                        </ul>
                    </div>
                )}

                {/* Active Tab Content */}
                {!showDeletePopup && activeTab === 'Rides' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <PassengerRides passengerId={passenger._id} />
                    </motion.div>
                )}

                {!showDeletePopup && activeTab === 'transactionHistory' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >

                        <DriverTransactionTable driverId={passenger._id} />

                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default PassengerProfile;