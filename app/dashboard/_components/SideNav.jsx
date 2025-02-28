"use client"
import { CircleUser, FileVideo, PanelsTopLeft, ShieldPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

function SideNav() {
  const MenuOption = [
    {
      id: 1,
      name: 'Dashboard',
      path: '/dashboard',
      icon: PanelsTopLeft
    },
    {
      id: 2,
      name: 'Create New',
      path: '/dashboard/create-new',
      icon: FileVideo
    },
    {
      id: 3,
      name: 'Upgrade',
      path: '/upgrade',
      icon: ShieldPlus
    },
    {
      id: 4,
      name: 'Account',
      path: '/account',
      icon: CircleUser
    },
    
  ];

  const pathname = usePathname();

  return (
    <div className='w-64 h-screen shadow-md p-5'>
      <nav className='space-y-4'>
        {MenuOption.map((option) => (
          <Link
            key={option.id}
            href={option.path}
            className='flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors'
          >
            <option.icon className='w-5 h-5' />
            <span
              className={
                pathname === option.path
                  ? 'font-semibold text-purple-600' // Active path color
                  : 'text-gray-700' // Default color
              }
            >
              {option.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default SideNav
