"use client";
import { Import } from 'lucide-react';
import React from 'react';
import Header from './_components/Header';
import { useUser } from '@clerk/nextjs';
import Loadermate from '../loader';


export default function DashboardLayout({ children }) {
   const { isLoaded } = useUser();

  if (!isLoaded) {
    return <Loadermate />;
  }
  return (
    <div className="bg-black min-h-screen w-full">
      <Header />
      {children}
    </div>
  );
}