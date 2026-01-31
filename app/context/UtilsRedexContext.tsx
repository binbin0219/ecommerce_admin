"use client";
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createUtilsStore } from '@/redux/utilsStore';
import Loader from '@/components/Loader';
import ToastContainer from '@/components/ToastContainer/ToastContainer';
import ConfirmationDialog from '@/components/ConfirmationDialog/ConfirmationDialog';
import { DialogContextProvider } from './DialogContext';

interface UtilsStoreProviderProps {
    children: ReactNode;
}

const UtilsStoreProvider = ({ children }: UtilsStoreProviderProps) => {
    const store = createUtilsStore()
    return (
        <Provider store={store}>
            <Loader/>
            <ToastContainer />
            <ConfirmationDialog />
            <DialogContextProvider>
                {children}
            </DialogContextProvider>
        </Provider>
    )
};

export default UtilsStoreProvider;
