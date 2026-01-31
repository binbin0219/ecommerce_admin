"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import FriendListDropdown from './FriendListDropdown';
import NotificationDropdown from './NotificationDropdown';
import UserIcon from '../UserIcon/UserIcon';
import UserProfileLink from '../Link/UserProfileLink';
import { IconLogout, IconMenu, IconSettings, IconUserScan, IconX } from '@tabler/icons-react';
import { logout } from '@/lib/auth';
import { addToast } from '@/redux/slices/toastSlice';
import { usePathname, useRouter } from 'next/navigation';
import { useDialogContext } from '@/context/DialogContext';
import Dropdown from '../Dropdown/Dropdown';
import SearchBar from './SearchBar';
import ThemeToggle from '../ThemeToggle';
import SmartImage from '../SmartImage';

const Navbar: React.FC = () => {
  const user = useSelector((state: RootState) => state.currentUser)!;
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const dialog = useDialogContext();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const isSettingRoute = usePathname().startsWith('/settings');
  const isUserProfileRoute = usePathname().startsWith(`/user/profile/${currentUser?.id}`);

  function logoutConf() {
      dialog.open(
          'Logout', 
          'Are you sure you want to logout?', 
          'Logout', 
          async () => {
              try {
                  await logout();
              } catch (error) {
                  console.log(error);
                  dispatch(addToast({
                      message: "Failed to logout",
                      type: "error"
                  }))
              } finally {
                  dialog.close();
              }
          }
      )
  }

  return (
    <nav className="sticky top-0 z-50 bg-bgSec rounded-lg shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link 
            href={"/"} 
            className="text-4xl me-12 text-primary cursor-pointer hover:text-primary transition-colors duration-300 flex items-center" 
            style={{ fontFamily: "fugaz one" }}
            >
              <SmartImage
              src='/assets/logo/logo.png'
              width={65}
              height={65}
              />
              {/* LuckyWin */}
            </Link>
          </div>

          {/* <SearchBar/> */}

          {/* Right Side: Icons and Profile (visible on md screens and up) */}
          <div className="flex items-center space-x-4">
            
            {/* <FriendListDropdown/> */}

            <NotificationDropdown/>

            {/* <ChatWindow/> */}
            <ThemeToggle/>

            <Dropdown
            toggleButton={(
              <div className='relative'>
                <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-green-400 rounded-full me-[3px] z-10"></div>
                <UserIcon
                className={`${isProfileMenuOpen && 'outline-none ring-2 ring-offset-2 ring-primary'}`}
                userId={user?.id} 
                updatedAt={user?.updatedAt} 
                navigateToUserProfile={false} 
                width={40} 
                height={40} 
                />
              </div>
            )}
            isOpen={isProfileMenuOpen}
            setIsOpen={(isOpen: boolean) => setProfileMenuOpen(isOpen)}
            >
              <UserProfileLink userId={user?.id}>
                  <li className={`dropdown-item flex items-center gap-2 ${isUserProfileRoute ? 'active' : ''}`}>
                      <IconUserScan/>
                      Profile
                  </li>
              </UserProfileLink>
              <li
              onClick={() => router.push('/settings')}
              className={`dropdown-item flex items-center gap-2 ${isSettingRoute ? 'active' : ''}`}
              >
                  <IconSettings/>
                  Settings
              </li>
              <li onClick={() => logoutConf()} className="dropdown-item flex items-center gap-2 text-red-500">
                  <IconLogout/>
                  Logout
              </li>
            </Dropdown>

          </div>
          
          {/* Mobile Menu Button */}
          <div className="hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <IconX className="h-6 w-6 text-gray-700" /> : <IconMenu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;