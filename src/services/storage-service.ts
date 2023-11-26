export class StorageService {
  getToken() {
    const persistRoot = localStorage.getItem('persist:root');
    const persistRootObj = JSON.parse(persistRoot);
    const { token } = JSON.parse(persistRootObj.user).currUser;
    return token;
  }
}
