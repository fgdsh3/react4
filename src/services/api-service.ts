import axios from 'axios';
import { apiConfig } from '../apiConfig';
import { StorageService } from './storage-service';

export interface IUserObj {
  username: string;
  email: string;
  password: string;
  image?: string;
}

export interface IUpdateUserObj {
  username: string;
  email: string;
  password?: string;
  image?: string;
}

export interface UserLogInObject {
  user: {
    email: string;
    password: string;
  };
}

export interface UserSignUpObject {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

const storageService = new StorageService();

export class ApiService {
  favoriteAnArticle(slug: string) {
    const token = storageService.getToken();

    axios.post(
      `${apiConfig.baseUrl}/articles/${slug}/favorite`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
  }

  unfavoriteAnArticle(slug: string) {
    const token = storageService.getToken();

    axios.delete(`${apiConfig.baseUrl}/articles/${slug}/favorite`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  }

  editArticle(slug: string) {
    const token = storageService.getToken();

    axios.put(`${apiConfig.baseUrl}/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  }

  deleteArticle(slug: string) {
    const token = storageService.getToken();

    axios.delete(`${apiConfig.baseUrl}/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  }
}
