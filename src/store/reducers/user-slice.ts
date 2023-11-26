import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  IUpdateUserObj,
  IUserObj,
  UserLogInObject,
  UserSignUpObject,
} from '../../services/api-service';
import axios from 'axios';
import { apiConfig } from '../../apiConfig';
import { StorageService } from '../../services/storage-service';

interface IServerErrors {
  username?: string;
  email?: string;
  password?: string;
  'email or password'?: string;
  title?: string;
  description?: string;
  body?: string;
  tagList?: string;
  image?: string;
}

interface IServerErrorAction {
  payload: { errors: IServerErrors };
  type: string;
}

interface IState {
  currUser: IUserObj | '';
  isLoading: boolean;
  serverErrors: IServerErrors;
}

const initialState: IState = {
  currUser: '',
  isLoading: false,
  serverErrors: {},
};

const storageService = new StorageService();

export const login = createAsyncThunk(
  'user/login',
  async (logInObject: UserLogInObject, thunkAPI) => {
    try {
      const res = await axios.post(
        `${apiConfig.baseUrl}users/login`,
        logInObject,
      );

      return res.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (userObj: IUpdateUserObj, thunkAPI) => {
    try {
      const token = storageService.getToken();

      const res = await axios.put(
        `${apiConfig.baseUrl}user`,
        { user: userObj },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      return res.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (logUpObject: UserSignUpObject, thunkAPI) => {
    try {
      const res = await axios.post(`${apiConfig.baseUrl}users/`, logUpObject);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logOut(state: IState) {
      state.currUser = '';
    },
    clearServerErrors(state: IState) {
      state.serverErrors = {};
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state: IState, action) => {
      state.currUser = action.payload;
    });
    builder.addCase(updateUser.fulfilled, (state: IState, action) => {
      state.currUser = action.payload;
    });
    /*  builder.addCase(
      login.rejected,
      (state: IState, action: { payload: { errors: IServerErrors }; type: string }) => {
        state.serverErrors = action.payload.errors;
      }
    ); */
    builder.addMatcher(
      (action) => action.type === login.rejected.type,
      (state: IState, action: IServerErrorAction) => {
        state.serverErrors = action.payload.errors;
      },
    );
    builder.addMatcher(
      (action) => action.type === updateUser.rejected.type,
      (state: IState, action: IServerErrorAction) => {
        state.serverErrors = action.payload.errors;
      },
    );
    builder.addMatcher(
      (action) => action.type === createUser.rejected.type,
      (state: IState, action: IServerErrorAction) => {
        state.serverErrors = action.payload.errors;
      },
    );
  },
});

export const { logOut, clearServerErrors } = user.actions;
