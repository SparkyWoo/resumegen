import { configureStore } from '@reduxjs/toolkit';
import { resumeSlice } from './resumeSlice';

export const store = configureStore({
  reducer: {
    resume: resumeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 