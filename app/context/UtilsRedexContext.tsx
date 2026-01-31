"use client";
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createUtilsStore } from '@/redux/utilsStore';

interface UtilsStoreProviderProps {
    children: ReactNode;
}

const UtilsStoreProvider = ({ children }: UtilsStoreProviderProps) => {
    const store = createUtilsStore()
    return <Provider store={store}>{children}</Provider>;
};

export default UtilsStoreProvider;
