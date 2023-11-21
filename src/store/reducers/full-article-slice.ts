import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiConfig } from "../../apiConfig";
import { StorageService } from "../../services/storage-service";

interface IState {
  fullArticle: IFullArticleObj | '';
  isLoading: boolean;
  notFoundPage: boolean;
  tags: string[];
  error: string;
}

export interface IFullArticleObj {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  }
}

export interface IData {
  title: string;
  decription: string;
  body: string;
  tags: string[];

}

const initialState: IState = {
  fullArticle: '',
  isLoading: false,
  notFoundPage: false,
  tags: [''],
  error: ''
}

const storageService = new StorageService()

export const getFullArticle = createAsyncThunk('fullArticle/getArticle', async (slug: string) => {
  const token = storageService.getToken()

  const response = await axios.get(`${apiConfig.baseUrl}articles/${slug}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  })

  return response.data.article
});

export const fetchCreateArticle = createAsyncThunk('fullArticle/createArticle', async (receivedArticle: { article: IData }) => {
  const token = storageService.getToken()

  const response = await axios.post(`${apiConfig.baseUrl}articles`,
    { article: receivedArticle.article },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

  return response.data.article
});

export const fetchEditArticle = createAsyncThunk('fullArticle/editArticle', async (
  receivedArticle: { article: IData; slug: string }) => {
  const token = storageService.getToken()

  const response = await axios.put(`${apiConfig.baseUrl}articles/${receivedArticle.slug}/`,
    { article: receivedArticle.article },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

  return response.data.article
});

export const fullArticle = createSlice({
  name: 'fullArticle',
  initialState,
  reducers: {
    addTag(state: IState) {
      state.tags.push('')
    },
    updateTag(state: IState, action: { type: string, payload: { i: number, value: any } }) {
      state.tags[action.payload.i] = action.payload.value
    },
    deleteTag(state: IState, action) {
      const index: number = action.payload
      state.tags = [...state.tags.slice(0, index), ...state.tags.slice(index + 1)]
    },
    changeFavoritedFullArticle(state: IState) {
      if (state.fullArticle) {
        if (state.fullArticle.favorited) {
          state.fullArticle.favorited = false
          state.fullArticle.favoritesCount -= 1
        }
        else {
          state.fullArticle.favorited = true
          state.fullArticle.favoritesCount += 1
        }
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(getFullArticle.pending, (state: IState) => {
      state.isLoading = true
    })
    builder.addCase(getFullArticle.fulfilled, (state: IState, action: { type: string; payload: IFullArticleObj }) => {
      state.fullArticle = action.payload
      state.isLoading = false
      state.tags = action.payload.tagList
    })
    builder.addCase(getFullArticle.rejected, (state: IState) => {
      state.notFoundPage = true
      state.isLoading = false
    })
    builder.addCase(fetchCreateArticle.pending, (state: IState) => {
      state.isLoading = true
    })
    builder.addCase(fetchCreateArticle.fulfilled, (state: IState, action) => {
      state.isLoading = false
    })
  },
})

export const {
  addTag,
  updateTag,
  changeFavoritedFullArticle,
  deleteTag
} = fullArticle.actions