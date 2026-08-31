"use client"
import React, { useState } from 'react';
import { IconLogout, IconShoppingBag } from '@tabler/icons-react';
import { logout } from '@/lib/auth';
import { addToast } from '@/redux/slices/toastSlice';
import { useDialogContext } from '@/context/DialogContext';
import { useAppSelector, useUtilsDispatch } from '@/redux/hooks';
import { selectSeller } from '@/redux/slices/sellerSlice';
import Dropdown from '../Dropdown/Dropdown';
import { DropdownItem } from '../Dropdown/DropdownItem/DropdownItem';
import ThemeToggle from '../ThemeToggle';

const Navbar: React.FC = () => {
  const seller = useAppSelector(selectSeller);
  const dispatch = useUtilsDispatch();
  const dialog = useDialogContext();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const initials = (seller?.name ?? 'S')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  function logoutConf() {
    dialog.open(
      'Logout',
      'Are you sure you want to logout?',
      'Logout',
      async () => {
        try {
          await logout();
        } catch (error) {
          console.error(error);
          dispatch(addToast({ message: 'Failed to logout', type: 'error' }));
        } finally {
          dialog.close();
        }
      }
    );
  }

  return (
    <nav className="sticky top-5 z-50 bg-bgSec rounded-lg shadow-md border border-borderPri">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-appPrimary p-2 rounded-lg text-white">
              <IconShoppingBag size={20} />
            </div>
            <p className="font-bold text-textSec">{seller?.name ?? 'Store Admin'}</p>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <Dropdown
              toggleButton={(
                <div className="rounded-full w-10 h-10 bg-gradient-to-br from-appPrimary font-bold flex justify-center items-center text-white">
                  {initials}
                </div>
              )}
              isOpen={isMenuOpen}
              setIsOpen={(open: boolean) => setMenuOpen(open)}
            >
              <DropdownItem
                onClick={logoutConf}
                className="flex items-center gap-2 text-red-500"
              >
                <IconLogout size={18} />
                Logout
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
