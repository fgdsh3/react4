import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IUpdateUserObj, IUserObj, UserLogObject } from "../../services/api-service";
import axios from "axios";
import { apiConfig } from "../../apiConfig";
import { StorageService } from "../../services/storage-service";

interface IState {
  currUser: IUserObj | '';
  isLoading: boolean;
}

const initialState: IState = {
  currUser: '',
  isLoading: false,
}

const configureUserObject = (userObject: IUserObj) => {
  const configuredUserObj = userObject
  if (!configuredUserObj.bio) {
    configuredUserObj.bio = ''
  }
  return configuredUserObj
}

const storageService = new StorageService()

export const login = createAsyncThunk('user/login', async (logInObject: UserLogObject) => {
  const res = await axios.post(`${apiConfig.baseUrl}users/login`, logInObject)
  console.log(configureUserObject(res.data.user))

  return configureUserObject(res.data.user)
});

export const updateUser = createAsyncThunk('user/update', async (userObj: IUpdateUserObj) => {
  const token = storageService.getToken()

  const res = await axios.put(`${apiConfig.baseUrl}user`, { user: userObj }, {
    headers: {
      Authorization: `Token ${token}`
    }
  })

  return configureUserObject(res.data.user)
});

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logOut(state: IState,) {
      state.currUser = ''
    }
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state: IState, action) => {
      state.currUser = action.payload
    })
    builder.addCase(updateUser.fulfilled, (state: IState, action) => {
      state.currUser = action.payload
    })
  }
})

export const {
  logOut
} = user.actions