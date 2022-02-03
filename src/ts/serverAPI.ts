import * as interfaceServer from './interfaces/interfaceServerAPI';

export default class ServerAPI {
  baseUrl = new URL('https://react-learnwords-example.herokuapp.com/');

  // /users/settings and /users/{id}/aggregatedWords are NOT IMPLEMENTED

  // /signin
  // .
  // signin

  // /words
  // .
  // getWords
  // getWordByWordId

  // /users
  // .
  // createUser
  // getUser
  // updateUser
  // deleteUser
  // getNewUserTokens (doesn't work?!)

  // /users/{id}/words
  // .
  // getUserWords
  // createUserWord ("optional" property in the body request is NOT DEFINED)
  // getUserWordByWordId
  // updateUserWord ("optional" property in the body request is NOT DEFINED)
  // deleteUserWord

  // /users/{id}/statistics
  // .
  // getStatistics
  // createStatistics ("optional" property in the body request is NOT DEFINED)

  signIn = async ({ email, password }: { email: string; password: string }) => {
    const url = new URL('signin', this.baseUrl);
    const body = { email, password };

    const response = await fetch(url.href, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const content: interfaceServer.AuthorizationContent = await response.json();
    return content;
  };

  getWords = async ({ group, page }: { group: number; page: number }) => {
    const url = new URL('words', this.baseUrl);
    url.searchParams.set('group', String(group));
    url.searchParams.set('page', String(page));

    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const content: Array<interfaceServer.WordContent> = await response.json();
    return content;
  };

  getWordByWordId = async ({ wordId }: { wordId: number }) => {
    const url = new URL(`words/${wordId}`, this.baseUrl);

    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const content: interfaceServer.WordContent = await response.json();
    return content;
  };

  createUser = async (user: interfaceServer.User) => {
    const url = new URL('users', this.baseUrl);

    const response = await fetch(url.href, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    const content: interfaceServer.CreateUserContent = await response.json();
    return content;
  };

  getUser = async ({ token, id }: { token: string; id: string }) => {
    const url = new URL(`users/${id}`, this.baseUrl);

    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    const content: interfaceServer.User = await response.json();
    return content;
  };

  updateUser = async ({
    token,
    id,
    email,
    password
  }: {
    token: string;
    id: string;
    email: string;
    password: string;
  }) => {
    const url = new URL(`users/${id}`, this.baseUrl);
    const body = { email, password };

    const response = await fetch(url.href, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const content: interfaceServer.User = await response.json();
    return content;
  };

  deleteUser = async ({ token, id }: { token: string; id: string }) => {
    const url = new URL(`users/${id}`, this.baseUrl);

    const response = await fetch(url.href, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*'
      }
    });

    const content: object = await response.json();
    return content;
  };

  getNewUserTokens = async ({ token, id }: { token: string; id: string }) => {
    const url = new URL(`users/${id}/tokens`, this.baseUrl);

    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    const content: interfaceServer.AuthorizationContent = await response.json();
    return content;
  };

  getUserWords = async ({ token, id }: { token: string; id: number }) => {
    const url = new URL(`users/${id}/words`, this.baseUrl);

    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    const content: Array<interfaceServer.UserWordContent> = await response.json();
    return content;
  };

  createUserWord = async ({
    token,
    id,
    wordId,
    difficulty
  }: {
    token: string;
    id: number;
    wordId: string;
    difficulty: string;
  }) => {
    const url = new URL(`users/${id}/words/${wordId}`, this.baseUrl);
    const body = { difficulty, optional: {} };

    const response = await fetch(url.href, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        body: JSON.stringify(body)
      }
    });

    const content: interfaceServer.UserWordContent = await response.json();
    return content;
  };

  getUserWordByWordId = async ({
    token,
    id,
    wordId
  }: {
    token: string;
    id: number;
    wordId: string;
  }) => {
    const url = new URL(`users/${id}/words/${wordId}`, this.baseUrl);

    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    const content: interfaceServer.UserWordContent = await response.json();
    return content;
  };

  updateUserWord = async ({
    token,
    id,
    wordId,
    difficulty
  }: {
    token: string;
    id: number;
    wordId: string;
    difficulty: string;
  }) => {
    const url = new URL(`users/${id}/words/${wordId}`, this.baseUrl);
    const body = { difficulty, optional: {} };

    const response = await fetch(url.href, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        body: JSON.stringify(body)
      }
    });

    const content: interfaceServer.UserWordContent = await response.json();
    return content;
  };

  deleteUserWord = async ({ token, id, wordId }: { token: string; id: number; wordId: string }) => {
    const url = new URL(`users/${id}/words/${wordId}`, this.baseUrl);

    const response = await fetch(url.href, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    const content: object = await response.json();
    return content;
  };

  getStatistics = async ({ token, id }: { token: string; id: number }) => {
    const url = new URL(`users/${id}/statistics`, this.baseUrl);

    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    const content: Array<interfaceServer.StatisticsContent> = await response.json();
    return content;
  };

  createStatistics = async ({
    token,
    id,
    learnedWords
  }: {
    token: string;
    id: number;
    learnedWords: number;
  }) => {
    const url = new URL(`users/${id}/statistics`, this.baseUrl);
    const body = { learnedWords, optional: {} };

    const response = await fetch(url.href, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        body: JSON.stringify(body)
      }
    });

    const content: interfaceServer.StatisticsContent = await response.json();
    return content;
  };
}
