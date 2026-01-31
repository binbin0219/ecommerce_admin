"use client";
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { utilsStore } from '@/redux/utilsStore';
import Loader from '@/components/Loader';
import ToastContainer from '@/components/ToastContainer/ToastContainer';
import ConfirmationDialog from '@/components/ConfirmationDialog/ConfirmationDialog';
import { DialogContextProvider } from './DialogContext';

interface UtilsStoreProviderProps {
  children: ReactNode;
}

const UtilsStoreProvider = ({ children }: UtilsStoreProviderProps) => {
  return (
    <Provider store={utilsStore}>
      {/* Global UI components */}
      <Loader />
      <ToastContainer />
      <ConfirmationDialog />
      
      <DialogContextProvider>
        {children}
      </DialogContextProvider>
    </Provider>
  );
};

export default UtilsStoreProvider;