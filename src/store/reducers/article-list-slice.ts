import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { apiConfig } from "../../apiConfig";
import { IFullArticleObj } from "./full-article-slice";
import { StorageService } from "../../services/storage-service";

interface IState {
  articleList: IFullArticleObj[],
  currPage: number,
  totalPages: number,
  isLoading: boolean,
}

const initialState: IState = {
  articleList: [],
  currPage: 1,
  totalPages: 1,
  isLoading: false,
}

const storageService = new StorageService()

export const fetchArticleList = createAsyncThunk('articleList/fetchData', async (currPage: number) => {
  const token = storageService.getToken()

  const response = await axios.get(
    `${apiConfig.baseUrl}articles?limit=5&offset=${currPage * 5 - 5}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });
  return response.data;
});

export const articleList = createSlice({
  name: 'articleList',
  initialState,
  reducers: {
    changeCurrPage(state: IState, action) {
      state.currPage = action.payload
    },
    changeFavoritedArticleList(state: IState, action) {
      const index = action.payload
      if (state.articleList[index].favorited) {
        state.articleList[index].favorited = false
        state.articleList[index].favoritesCount -= 1
      }
      else {
        state.articleList[index].favorited = true
        state.articleList[index].favoritesCount += 1
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchArticleList.pending, (state: IState) => {
      state.isLoading = true
    })
    builder.addCase(fetchArticleList.fulfilled, (state: IState, action) => {
      state.articleList = action.payload.articles
      state.totalPages = Math.floor(action.payload.articlesCount / 5)
      state.isLoading = false
    })
   /*  builder.addCase(fetchArticleList.rejected, (state: IState) => {
     
    }) */
  },
})

export const {
  changeCurrPage,
  changeFavoritedArticleList
} = articleList.actions