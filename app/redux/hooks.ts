// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from './store';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import type { UtilsStoreRootStateType, UtilsStoreDispatch } from './utilsStore';
export const useUtilsDispatch = () => useDispatch<UtilsStoreDispatch>();
export const useUtilsSelector: TypedUseSelectorHook<UtilsStoreRootStateType> = useSelector;
