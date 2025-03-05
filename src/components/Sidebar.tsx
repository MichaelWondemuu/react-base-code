// Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-8">University Hierarchy</h2>
      <ul className="space-y-6">
        <li>
          <Link to="/" className="block p-2 rounded hover:bg-gray-600 transition">Home</Link>
        </li>
        <li>
          <Link to="/positions" className="block p-2 rounded hover:bg-gray-600 transition">Positions</Link>
        </li>
        <li>
          <Link to="/departments" className="block p-2 rounded hover:bg-gray-600 transition">Departments</Link>
        </li>
        <li>
          <Link to="/users" className="block p-2 rounded hover:bg-gray-600 transition">Users</Link>
        </li>
        <li>
          <Link to="/settings" className="block p-2 rounded hover:bg-gray-600 transition">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
