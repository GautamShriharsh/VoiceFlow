"use client";
import React from 'react';
import Header from './_components/Header';
import SideNav from './_components/SideNav';
import { VideoDataProvider } from '../_context/VideoDataContext'; 

function DashboardLayout({ children }) {
  return (
    <VideoDataProvider>
      <div>
        <div className='hidden md:block h-screen bg-white fixed mt-[65px]'>
          <SideNav />
        </div>
        <div>
          <Header />
          <div className='md:ml-64'>{children}</div>
        </div>
      </div>
    </VideoDataProvider>
  );
}

export default DashboardLayout;