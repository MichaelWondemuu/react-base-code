import { configureStore } from '@reduxjs/toolkit';
import treeReducer from './hierarchySlice'; // Import treeSlice reducer

export const store = configureStore({
  reducer: {
    tree: treeReducer, // ✅ Ensure the tree reducer is added here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
