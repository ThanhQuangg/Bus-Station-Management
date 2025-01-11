import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/header'; 
import Footer from '../components/Footer/Footer'; 

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header /> 
      <main>
        {children}
        </main> 
      <Footer /> 
    </div>
  );
};

export default MainLayout;