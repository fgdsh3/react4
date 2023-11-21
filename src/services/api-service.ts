import axios from "axios";
import { apiConfig } from "../apiConfig";
import { StorageService } from "./storage-service";

export interface IUserObj {
  username: string,
  email: string,
  password: string,
  image?: string;
  bio?: string;
}

export interface IUpdateUserObj {
  username: string,
  email: string,
  password?: string,
  image?: string;
  bio?: string;
}

export interface UserLogObject {
  user: {
    username: string,
    email: string,
    password: string
  }
}

const storageService = new StorageService()

export class ApiService {
  createUser(logUpObject: UserLogObject) {
    axios.post(`${apiConfig.baseUrl}users/`, logUpObject)
  }
  favoriteAnArticle(slug: string) {
    const token = storageService.getToken()

    axios.post(`${apiConfig.baseUrl}/articles/${slug}/favorite`, {}, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
  }
  unfavoriteAnArticle(slug: string) {
    const token = storageService.getToken()

    axios.delete(`${apiConfig.baseUrl}/articles/${slug}/favorite`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
  }
  editArticle(slug: string) {
    const token = storageService.getToken()

    axios.put(`${apiConfig.baseUrl}/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
  }
  deleteArticle(slug: string) {
    const token = storageService.getToken()

    axios.delete(`${apiConfig.baseUrl}/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
  }
}