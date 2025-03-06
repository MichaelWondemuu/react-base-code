import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { setTreeData } from './store/hierarchySlice';
import TreeView from './components/MantineTreeView';
import Layout from './layout';
import Header from './components/Header';  // Example component for home page
import Footer from './components/footer';  // Example component for About page
import Sidebar from './components/footer';  // Example component for About page
import axios from 'axios';
const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:7000/tree');
        const data = await response.json();
        if (Array.isArray(data)) {
          const parsedData = data.map((node: any) => ({
            ...node,
            id: Number(node.id),
            parentId: node.parentId !== null ? Number(node.parentId) : null,
          }));
          dispatch(setTreeData(parsedData));
        } else {
          console.error('Tree data is missing or not in expected format');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TreeView/>} /> {/* Home page */}
          <Route path="/Header" element={<Header />} /> {/* About page */}
          <Route path="/Footer" element={<Footer />} /> {/* About page */}
          <Route path="/Sidebar" element={<Sidebar />} /> {/* About page */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
