import { AuthorizationContent } from './interfaces/interfaceServerAPI';
import ServerAPI from './serverAPI';

export default class LocalStorageAPI {
  serverAPI: ServerAPI;

  accountStorage: {
    isLoggedIn: boolean;
    name: string;
    email: string;
    password: string;
    id: string;
    token: string;
    refreshToken: string;
  };

  constructor(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;

    const accountStorageString = localStorage.getItem('accountStorage');

    if (accountStorageString === null) {
      this.accountStorage = {
        isLoggedIn: false,
        name: '',
        email: '',
        password: '',
        id: '',
        token: '',
        refreshToken: ''
      };
    } else {
      const accountStorage = JSON.parse(accountStorageString);
      this.accountStorage = accountStorage;

      // can be 'accountStorage' with the default values
      if (accountStorage.isLoggedIn === true) {
        // each new session => update token
        // not updating token during the session (unlikely session will last over than 4 hours)
        // updating the token by calling 'signIn' method (it also returns new token)
        this.updateToken();
      }
    }

    console.log(this.accountStorage);
  }

  fillDefaultAccountStorage() {
    this.accountStorage = {
      isLoggedIn: false,
      name: '',
      email: '',
      password: '',
      id: '',
      token: '',
      refreshToken: ''
    };

    localStorage.setItem('accountStorage', JSON.stringify(this.accountStorage));
  }

  async updateToken() {
    // approach with 'getNewUserTokens' method (not stable / dont know why)
    // ====>
    // const { token, refreshToken } = await this.serverAPI.getNewUserTokens({
    //   token: this.accountStorage.refreshToken,
    //   id: this.accountStorage.id
    // });

    // this.accountStorage.token = token;
    // this.accountStorage.refreshToken = refreshToken;
    // <=====

    const { email, password } = this.accountStorage;

    const authorizationContent = await this.serverAPI.signIn({
      email,
      password
    });

    this.accountStorage.token = authorizationContent.token;
    this.accountStorage.refreshToken = authorizationContent.refreshToken;

    localStorage.setItem('accountStorage', JSON.stringify(this.accountStorage));
  }

  async fillAccountStorage(authorizationContent: AuthorizationContent, userPassword: string) {
    const userData = await this.serverAPI.getUser({
      token: authorizationContent.token,
      id: authorizationContent.userId
    });

    this.accountStorage = {
      isLoggedIn: true,
      name: userData.name,
      email: userData.email,
      password: userPassword,
      id: authorizationContent.userId,
      token: authorizationContent.token,
      refreshToken: authorizationContent.refreshToken
    };

    localStorage.setItem('accountStorage', JSON.stringify(this.accountStorage));
  }
}
