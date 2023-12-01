import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiConfig } from '../../apiConfig';
import { StorageService } from '../../services/storage-service';

interface IState {
  fullArticle: IFullArticleObj | '';
  isLoading: boolean;
  notFoundPage: boolean;
  isCreateArticle: boolean;
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
  };
}

export interface IFullArticleData {
  title: string;
  decription: string;
  body: string;
  tags: string[];
}

export interface ITagAction {
  type: string;
  payload: { i: number; value: string };
}

const initialState: IState = {
  fullArticle: '',
  isLoading: false,
  notFoundPage: false,
  isCreateArticle: false,
  tags: [''],
  error: '',
};

const storageService = new StorageService();

export const getFullArticle = createAsyncThunk(
  'fullArticle/getArticle',
  async (slug: string) => {
    const token = storageService.getToken();

    const response = await axios.get(`${apiConfig.baseUrl}articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data.article;
  },
);

export const fetchCreateArticle = createAsyncThunk(
  'fullArticle/createArticle',
  async (receivedArticle: { article: IFullArticleData }) => {
    const token = storageService.getToken();

    const response = await axios.post(
      `${apiConfig.baseUrl}articles`,
      { article: receivedArticle.article },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );

    return response.data.article;
  },
);

export const fetchEditArticle = createAsyncThunk(
  'fullArticle/editArticle',
  async (receivedArticle: { article: IFullArticleData; slug: string }) => {
    const token = storageService.getToken();

    const response = await axios.put(
      `${apiConfig.baseUrl}articles/${receivedArticle.slug}/`,
      { article: receivedArticle.article },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );

    return response.data.article;
  },
);

export const fullArticle = createSlice({
  name: 'fullArticle',
  initialState,
  reducers: {
    addTag(state: IState) {
      state.tags.push('');
    },
    updateTag(state: IState, action: ITagAction) {
      state.tags[action.payload.i] = action.payload.value;
    },
    deleteTag(state: IState, action) {
      const index: number = action.payload;
      state.tags = [
        ...state.tags.slice(0, index),
        ...state.tags.slice(index + 1),
      ];
    },
    clearTags(state: IState) {
      state.tags = [''];
    },
    changeTagsArr(state: IState, action: { type: string; payload: string[] }) {
      state.tags = action.payload;
    },
    changeFavoritedFullArticle(state: IState) {
      if (state.fullArticle) {
        if (state.fullArticle.favorited) {
          state.fullArticle.favorited = false;
          state.fullArticle.favoritesCount -= 1;
        } else {
          state.fullArticle.favorited = true;
          state.fullArticle.favoritesCount += 1;
        }
      }
    },
    changeIsCreateArticle(state: IState, action) {
      state.isCreateArticle = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getFullArticle.pending, (state: IState) => {
      state.isLoading = true;
    });
    builder.addCase(
      getFullArticle.fulfilled,
      (state: IState, action: { type: string; payload: IFullArticleObj }) => {
        state.fullArticle = action.payload;
        state.isLoading = false;
      },
    );
    builder.addCase(getFullArticle.rejected, (state: IState) => {
      state.notFoundPage = true;
      state.isLoading = false;
    });
    builder.addCase(fetchCreateArticle.pending, (state: IState) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCreateArticle.fulfilled, (state: IState) => {
      state.isLoading = false;
    });
  },
});

export const {
  addTag,
  updateTag,
  deleteTag,
  clearTags,
  changeTagsArr,
  changeFavoritedFullArticle,
  changeIsCreateArticle,
} = fullArticle.actions;
