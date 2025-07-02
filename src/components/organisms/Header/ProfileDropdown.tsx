import { useUser } from '@/context/UserContext';
import { DeleteForever, Logout, NotificationImportant } from '@mui/icons-material';
import {  User } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import Cookies from "js-cookie";

export default function ProfileDropdown() {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <ProfileButton onClick={toggleDropdown} />
      {isOpen && <DropdownMenu />}
    </div>
  );
}

function ProfileButton({ onClick }: { onClick: () => void }) {
  const { userData } = useUser();

  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={onClick} data-testid="profile-icon"> 
      <div className="relative">
        <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-100 border-2 border-blue-200 rounded-full">
          <img
            src={userData?.business_user_detail.logo}
            alt={userData?.business_user_detail?.business_name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <div className="hidden md:block">
        <p className="font-medium leading-tight text-gray-800">
          {userData?.business_user_detail?.business_name}
        </p>
        <p className="text-xs font-medium text-gray-500">{userData?.user_type_value}</p>
      </div>
    </div>
  );
}

function DropdownMenu() {
  const handleLogout = () => {    
    Cookies.remove("authToken");
    window.location.replace("/login");
  };

  return (
    <div className="absolute right-0 z-10 w-64 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="py-1">
        <MenuItem icon={User} label="Profile Info" />
        <MenuItem icon={NotificationImportant} label="Notifications" badge="1" />
        <MenuItem icon={Logout} label="Logout" onClick={handleLogout}/>
        <div className="mt-1 border-t border-gray-100" />
        <MenuItem icon={DeleteForever} label="Delete Profile" danger  />
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  badge,
  danger,
  onClick,
}: {
  icon: React.FC;
  label: string;
  badge?: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer ${danger ? 'text-red-600' : 'text-gray-700'}`}
      onClick={onClick}
    >
      <div className="w-5 h-5 mr-3">
        <Icon />
      </div>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}