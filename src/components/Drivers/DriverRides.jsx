import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FadeLoader } from "react-spinners";
import ApiConfig from '../../Consants/ApiConfig';  // Make sure to update the API URL here
import usernotfound from '../../assets/usernotfound2.jpg';
import { ShimmerTable } from "react-shimmer-effects";
import { Search, ArrowDownUp } from "lucide-react";

const DriverRides = ({ driverId }) => {
  const [ridesData, setRidesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newly-added"); // Default sort
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order
  const itemsPerPage = 10;
  const [selectedRide, setSelectedRide] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  console.log(driverId);
  
  // Search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // Sort functionality
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

    // Fetch rides for a specific driver by ID
    useEffect(() => {
      const fetchRidesByDriver = async () => {
        setIsLoading(true);
        setErrorMessage(''); // Clear any previous error message
    
        try {
          // Ensure driverId is valid
          if (!driverId) {
            throw new Error('Driver ID is missing.');
          }
    
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Authorization token not found.');
          }
    
          // Construct the URL dynamically
          const url = ApiConfig.getDriverRidesEndpoint(driverId, currentPage, 15, sortBy, sortOrder);
          console.log("Requesting rides from:", url); // Log the URL for debugging
    
          // Fetch the data
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
    
          // Handle response errors
          if (!response.ok) {
            // Handle different error statuses explicitly
            if (response.status === 404) {
              setErrorMessage('Rides not found for this driver.');
            } else if (response.status === 401) {
              setErrorMessage('Unauthorized access. Please login again.');
            } else if (response.status === 500) {
              setErrorMessage('Server error. Please try again later.');
            } else {
              setErrorMessage(`Error fetching rides: ${response.status} - ${response.statusText}`);
            }
            throw new Error(`Error fetching rides: ${response.status} - ${response.statusText}`);
          }
    
          const data = await response.json();
          if (data.status === 1) {
            if (data.rides && data.rides.length > 0) {
              setRidesData(data.rides);
              console.log('Fetched Rides:', data.rides);
            } else {
              setErrorMessage('No rides found for this driver.');
            }
          } else {
            setErrorMessage(`Failed to fetch rides: ${data.message || 'Unknown error'}`);
          }
        } catch (error) {
          if (error instanceof TypeError) {
            // Specific error type handling for network errors or invalid responses
            setErrorMessage('Network error or invalid response.');
          } else {
            // Generic error message for other errors
            setErrorMessage(`Error fetching rides: ${error.message}`);
          }
          console.error("Error fetching rides data:", error);
        } finally {
          setIsLoading(false); // Reset loading state
        }
      };
    
      fetchRidesByDriver();
    }, [driverId, currentPage, sortBy, sortOrder]);
    
  // Filter and sort the rides data
  const filteredRides = ridesData.filter(
    (ride) =>
      ride.passengerId.name.toLowerCase().includes(searchTerm) ||
      ride.pickupLocation.place.toLowerCase().includes(searchTerm) ||
      ride.dropoffLocation.place.toLowerCase().includes(searchTerm) ||
      ride.status.toLowerCase().includes(searchTerm)
  );

    // Sort the rides based on selected field
    const sortedRides = [...filteredRides].sort((a, b) => {
        
        if (sortBy === "passenger") {
          return sortOrder === "asc"
            ? a.passengerId.name.localeCompare(b.passengerId.name)
            : b.passengerId.name.localeCompare(a.passengerId.name);
        }
        if (sortBy === "rideNo") {
          return sortOrder === "asc" ? a._id - b._id : b._id - a._id;
        }
        if (sortBy === "fare") {
          return sortOrder === "asc" ? a.totalCost - b.totalCost : b.totalCost - a.totalCost;
        }
        if (sortBy === "fromplace") {
          return sortOrder === "asc"
            ? a.passengerId.name.localeCompare(b.passengerId.name)
            : b.passengerId.name.localeCompare(a.passengerId.name);
        }
        if (sortBy === "toplace") {
          return sortOrder === "asc"
            ? a.passengerId.name.localeCompare(b.passengerId.name)
            : b.passengerId.name.localeCompare(a.passengerId.name);
        }
        return 0;
      });

      const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(sortedRides.length / itemsPerPage);
  const currentItems = sortedRides.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Page change handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle View action
  const handleViewInvoice = (ride) => {
    setSelectedRide(ride);
  };
  
  // Close Modal
  const closeModal = () => {
    setSelectedRide(null);
  };

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-xl rounded-xl p-6 border-r border-red-400 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black mb-4 md:mb-0">Rides List</h2>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search Rides..."
            className="bg-white text-black placeholder-black rounded-lg pl-10 pr-4 py-2 w-full border"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-black" size={18} />
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="border border-gray-300">
          <ShimmerTable row={10} col={7} />
        </div>
      ) : 
      (
        <>
            {/* Check if filteredRides is empty */}
          {filteredRides.length === 0 ? (
            <div className="text-black flex flex-col justify-center items-center ">
                <img src={usernotfound} alt="" className="w-80 h-80" />
                <h1 className="text-lg font-semibold text-gray-600">No rides found matching your search.</h1>
            </div>

          ) : (
            <div className="RidesData">
                <motion.div 
                     className="overflow-x-auto"
                >
                <table className="min-w-full bg-white border border-gray-300 shadow-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th
                      className="py-3 px-6 text-left cursor-pointer"
                      onClick={() => handleSortChange("driver")}
                    >
                      <span className="flex">
                        Driver
                        <ArrowDownUp className="pl-2" />
                      </span>
                    </th>
                    <th
                      className="py-3 px-6 text-left cursor-pointer"
                      onClick={() => handleSortChange("fare")}
                    >
                      <span className="flex">
                        Fare
                        <ArrowDownUp className="pl-2" />
                      </span>
                    </th>
                    <th
                      className="py-3 px-6 text-left cursor-pointer"
                      onClick={() => handleSortChange("fromplace")}
                    >
                      <span className="flex">
                        From Place
                        <ArrowDownUp className="pl-2" />
                      </span>
                    </th>
                    <th
                      className="py-3 px-6 text-left cursor-pointer"
                      onClick={() => handleSortChange("toplace")}
                    >
                      <span className="flex">
                        To Place
                        <ArrowDownUp className="pl-2" />
                      </span>
                    </th>
                    <th className="py-3 px-6 text-left cursor-pointer">
                      <span className="flex">Status</span>
                    </th>
                    <th className="py-3 px-6 text-left cursor-pointer">
                      View Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((ride) => (
                    <motion.tr
                      key={ride._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-800 transform transition duration-300 ease-in-out hover:scale-104 hover:bg-gray-100 hover:shadow-lg"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-black">
                        {ride.driverId?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-black">
                        {/* Display the fare from the ride */}
                        {ride.fare?.$numberDecimal ? `$${parseFloat(ride.fare.$numberDecimal).toFixed(2)}` : "$0.00"}
                      </td>
              
                      {/* "From Place" column */}
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-black">
                        <span>{ride.pickupLocation?.place || "N/A"}</span>
                      </td>
              
                      {/* "To Place" column */}
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-black">
                        <span>{ride.dropoffLocation?.place || "N/A"}</span>
                      </td>
              
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-black">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              ride.status === "completed"
                                ? "bg-green-200 text-green-900"
                                : ride.status === "pending"
                                ? "bg-yellow-200 text-yellow-900"
                                : "bg-red-200 text-red-900"
                            }`}
                        >
                          {ride.status || "Unknown"}
                        </span>
                      </td>
              
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-black">
                        <button
                          className="text-indigo-500 hover:text-indigo-300 mr-2 text-base"
                          onClick={() => handleViewInvoice(ride)}
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
                </motion.div>
            

            {/* Pagination */}
            <div className="flex justify-center mt-4">
            <ul className="flex space-x-2">
            <li>
                <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1 ? "bg-transparent text-black cursor-not-allowed" : "bg-white text-black hover:bg-gray-600"}`}
                >
                Previous
                </button>
              </li>
                {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index}>
                      <button
                        className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-white text-black hover:bg-gray-600"}`}
                       
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                <li>

                
                <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredRides.length / itemsPerPage)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages ? "bg-transparent text-black cursor-not-allowed" : "bg-white text-black hover:bg-gray-600"}`}
                >
                Next
                </button>
                </li>
                </ul>
            </div>

            {/* View Invoice Modal */}
            {selectedRide && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Invoice for Ride</h2>
                    <p>Ride ID: {selectedRide._id}</p>
                    {/* <p>Driver Name: {selectedRide.driverId.name}</p> */}
                    <p>Passenger Name: {selectedRide.passengerId.name}</p>
                    <p>Total Fare: ${selectedRide.fare.$numberDecimal}</p>
                    <button
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                    onClick={closeModal}
                    >
                    Close
                    </button>
                </div>
                </div>
            
            
                )
            }
            </div>
          )
          }

        </>
    )}
    </motion.div>

    );
};

export default DriverRides;

