import React from 'react';

export interface Events {
  id: number;
  title: string;
  description: string;
  date: string;
  created_at: Date;
  updated_at: Date;
}

interface UserStatsProps {
  users: Events[];
}

const UserStats: React.FC<UserStatsProps> = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.title).length;
  const inactiveUsers = users.filter(user => !user.description).length;

  if (totalUsers === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">User Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatItem 
          label="Total Users" 
          value={totalUsers} 
          textColor="text-gray-800"
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
        />
        <StatItem 
          label="Active Users" 
          value={activeUsers} 
          textColor="text-green-600"
          bgColor="bg-green-50"
          borderColor="border-green-200"
        />
        <StatItem 
          label="Inactive Users" 
          value={inactiveUsers} 
          textColor="text-red-600"
          bgColor="bg-red-50"
          borderColor="border-red-200"
        />
      </div>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: number;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, textColor, bgColor, borderColor }) => (
  <div className={`p-4 rounded-lg border ${bgColor} ${borderColor}`}>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
  </div>
);

export default UserStats;