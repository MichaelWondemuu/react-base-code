import React from 'react';
import TreeView from './components/TreeView';
import Header from './components/Header';  // Example component for the header
import Footer from './components/footer';  // Example component for the footer
import Sidebar from './components/Sidebar';  // Import your Sidebar component

// Define the Layout component with correct typing for children
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Content Section */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-4">
          <Sidebar />  {/* Your Sidebar content goes here */}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {children}  {/* This will be replaced by dynamic content like TreeView */}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
