export interface User {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserContent {
  id: string;
  name: string;
  email: string;
}

export interface AuthorizationContent {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface WordContent {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface OptionalUserWord {
  timestampWhenItWasLearned: number | false;
  sprint: {
    totalCount: number;
    trueCount: number;
    bestStreak: number;
  };
  audioCall: {
    totalCount: number;
    trueCount: number;
    bestStreak: number;
  };
}

// NOT IMPLEMENTED
export interface OptionalUserStatistics {
  [timestamp: string | number]: OptionalUserWord;
}

export interface UserWordContent {
  id: string;
  difficulty: string;
  wordId: string;
  optional: OptionalUserWord;
}

export interface StatisticsContent {
  id: string;
  learnedWords: number;
}
