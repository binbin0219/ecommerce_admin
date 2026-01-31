import { configureStore } from '@reduxjs/toolkit';
import postReducer from './slices/postSlice';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import currentUserReducer from './slices/currentUserSlice';
import notificationReducer, { NotificationState } from './slices/notificationSlice';
import { User } from '@/lib/models/user';
import { ChatState } from './slices/chatSlice';

export interface RootState {
    user: User[];
    currentUser: User;
    notifications: NotificationState;
    chat: ChatState;
}

export function createStore() {
    return configureStore({
        reducer: {
            post: postReducer,
            user: userReducer,
            currentUser: currentUserReducer,
            notifications: notificationReducer,
            chat: chatReducer,
        },
    });
}
