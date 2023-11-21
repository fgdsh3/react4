import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { articleList } from './reducers/article-list-slice';
import { user } from './reducers/user-slice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { fullArticle } from './reducers/full-article-slice';

const rootReducer = combineReducers({
  articleList: articleList.reducer,
  user: user.reducer,
  fullArticle: fullArticle.reducer
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
