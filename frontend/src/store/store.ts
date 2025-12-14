import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import usersReducer from './users/usersSlice';
import clothingItemsReducer from './clothingItems/clothingItemsSlice';
import outfitsReducer from './outfits/outfitsSlice';
import outfitItemsReducer from './outfitItems/outfitItemsSlice';
import tagsReducer from './tags/tagsSlice';
import likesReducer from './likes/likesSlice';
import commentsReducer from './comments/commentsSlice';
import scheduledOutfitsReducer from './scheduledOutfits/scheduledOutfitsSlice';
import stylistReducer from './stylist/stylistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    clothingItems: clothingItemsReducer,
    outfits: outfitsReducer,
    outfitItems: outfitItemsReducer,
    tags: tagsReducer,
    likes: likesReducer,
    comments: commentsReducer,
    scheduledOutfits: scheduledOutfitsReducer,
    stylist: stylistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
