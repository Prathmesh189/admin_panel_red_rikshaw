// Driversdata

import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/Drivers/UsersTable";
// import UserGrowthChart from "../components/users/UserGrowthChart";
// import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
// import UserDemographicsChart from "../components/users/UserDemographicsChart";

const userStats = {
	totalUsers: 2845,
	newUsersToday: 243,
	activeUsers: 520,
	 churnRate: 50,
};

const Drivers = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Drivers' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 bg-white'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Drivers'
						icon={UsersIcon}
						value={userStats.totalUsers.toLocaleString()}
						color='#6366F1'
					/>
					<StatCard 
						name='New Drivers Today' 
						icon={UserPlus} 
						value={userStats.newUsersToday} 
						color='#10B981' 
					/>
					<StatCard
						name='Active Drivers'
						icon={UserCheck}
						value={userStats.activeUsers.toLocaleString()}
						color='#F59E0B'
					/>
					<StatCard 
						name='Inactive Users' 
						icon={UserX} 
						value={userStats.churnRate} 
						color='#EF4444' 
					/>
				</motion.div>

				<UsersTable />

				{/* USER CHARTS */}
				{/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
					<UserDemographicsChart />
				</div> */}
			</main>
		</div>
	);
};
export default Drivers;
