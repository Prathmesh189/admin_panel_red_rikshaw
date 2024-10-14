import { motion } from "framer-motion";
import { Search, ArrowDownUp, ArrowDownUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ShimmerTable } from "react-shimmer-effects";
import usernotfound from '../../assets/usernotfound2.jpg';
import ApiConfig from '../../Consants/ApiConfig';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newly-added"); // Default sort
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order
  const [sortField, setSortField] = useState('createdAt');
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Number of transactions per page

  // Fetch data from the API
  useEffect(() => {
    fetchTransactions();
  }, [sortField, sortOrder, currentPage]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    const response = await fetch(ApiConfig.getTransactionsEndPoint());
    const data = await response.json();
    setTransactions(data.transfers || []);
    setTotalPages(Math.ceil(data.transfers.length / itemsPerPage)); // Calculate total pages
    setIsLoading(false);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Handle pagination logic
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Get current transactions for the current page
  const currentItems = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-xl rounded-xl p-6 border-r border-red-400 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black mb-4 md:mb-0">
          Transactions
        </h2>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="border border-gray-300">
          <ShimmerTable row={10} col={7} />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-black flex flex-col justify-center items-center ">
          <img src={usernotfound} alt="" className="w-80 h-80" />
          <h1 className="text-lg font-semibold text-gray-600">No transactions found..!</h1>
        </div>
      ) : (
        <div className="TransactionRequestData">
          <motion.div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th onClick={() => handleSort('from.name')} className="py-3 px-6 text-left cursor-pointer">
                    <span className="flex">From Name<ArrowDownUpIcon className="pl-2"/></span>
                  </th>
                  <th onClick={() => handleSort('from.userType')} className="py-3 px-6 text-left cursor-pointer">
                    <span className="flex">From Role<ArrowDownUpIcon className="pl-2"/></span>
                  </th>
                  <th onClick={() => handleSort('to.name')} className="py-3 px-6 text-left cursor-pointer">
                    <span className="flex">To Name<ArrowDownUpIcon className="pl-2"/></span>
                  </th>
                  <th onClick={() => handleSort('to.userType')} className="py-3 px-6 text-left cursor-pointer">
                    <span className="flex">To Role<ArrowDownUpIcon className="pl-2"/></span>
                  </th>
                  <th onClick={() => handleSort('amount')} className="py-3 px-6 text-left cursor-pointer">
                    <span className="flex">Amount<ArrowDownUpIcon className="pl-2"/></span>
                  </th>
                  <th onClick={() => handleSort('createdAt')} className="py-3 px-6 text-left cursor-pointer">
                    <span className="flex">Date/Time<ArrowDownUpIcon className="pl-2"/></span>
                  </th>
                  <th onClick={() => handleSort('status')} className="py-3 px-6 text-left cursor-pointer">
                    <span className="flex">Status <ArrowDownUpIcon className="pl-2"/></span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((transaction) => (
                  <motion.tr
                    key={transaction._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">
                      {transaction.from.userId.name}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {transaction.from.userType}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {transaction.to.userId.name}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {transaction.to.userType}
                    </td>
                    <td className="py-3 px-6 text-left">{transaction.amount}</td>
                    <td className="py-3 px-6 text-left">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-left">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              transaction.status === "completed"
                                ? "bg-green-200 text-green-900"
                                : transaction.status === "pending"
                                ? "bg-yellow-200 text-yellow-900"
                                : "bg-red-200 text-red-900"
                            }`}>
                                {transaction.status}
                            </span>
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
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages ? "bg-transparent text-black cursor-not-allowed" : "bg-white text-black hover:bg-gray-600"}`}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionTable;
