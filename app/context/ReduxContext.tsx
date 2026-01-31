"use client";
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '@/redux/store';

interface StoreProviderProps {
    children: ReactNode;
}

const StoreProvider = ({ children }: StoreProviderProps) => {
    const store = createStore()
    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
