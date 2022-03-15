import {
  WordContent,
  OptionalUserWord,
  OptionalUserStatistics
} from '../../../interfaces/interfaceServerAPI';
import ServerAPI from '../../../serverAPI';
import LocalStorageAPI from '../../../localStorageAPI';

export default class GameResult {
  innerHtmlTemplate = `
    <div class="gameResult__container">
      <div class="gameResult__truthy">
        <p class="gameResult__title">Правильные ответы:</p>
        
      </div>
      <div class="gameResult__falsy">
        <p class="gameResult__title">Неправильные ответы:</p>

      </div>
      <div class="gameResult__btns">
        <button class="gameResult__btn gameResult__btn_main">Главаная страница</button>
        <button class="gameResult__btn gameResult__btn_games">Сыграть еще раз</button>
      </div>
    </div>
  `;

  innerHtmlTemplateGameResultItem = `
    <img class="gameResult__audio" src="./assets/svg/volumeUp.svg" alt="volumeUp">
    <div class="gameResult__word"></div>
    <p>-</p>
    <div class="gameResult__translate"></div>
  `;

  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  contentURL: string;

  componentElem: HTMLElement;

  constructor(serverAPI: ServerAPI, localStorageAPI: LocalStorageAPI, contentURL: string) {
    this.componentElem = document.createElement('div');

    this.serverAPI = serverAPI;
    this.localStorageAPI = localStorageAPI;
    this.contentURL = contentURL;
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('gameResult');
  }

  createComponent() {
    this.createThisComponent();
  }

  setThisListeners() {
    const mainBtn = this.componentElem.querySelector('.gameResult__btn_main') as HTMLButtonElement;
    const gamesBtn = this.componentElem.querySelector(
      '.gameResult__btn_games'
    ) as HTMLButtonElement;

    mainBtn.addEventListener('click', () => {
      const mainNavBtn = document.querySelector('#mainBtn') as HTMLButtonElement;
      mainNavBtn.dispatchEvent(new Event('click'));
    });
    gamesBtn.addEventListener('click', () => {
      const gamesNavBtn = document.querySelector('#gamesBtn') as HTMLButtonElement;
      gamesNavBtn.dispatchEvent(new Event('click'));
    });
  }

  setListeners() {
    this.setThisListeners();
  }

  async showComponent(
    gameName: 'sprint' | 'audioCall',
    answers: Array<{ result: boolean; wordContent: WordContent }>
  ) {
    this.createComponent();
    this.setListeners();

    if (this.localStorageAPI.accountStorage.isLoggedIn === true) {
      await this.updateUserWords_OptionalProperty(gameName, answers);
      await this.updateUserStatistics(gameName, answers);
    }

    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.append(this.componentElem);

    const truthyAnswerObjs = answers.filter((answerObj) => answerObj.result === true);
    const falsyAnswerObjs = answers.filter((answerObj) => answerObj.result === false);

    const truthyContainer = this.componentElem.querySelector('.gameResult__truthy') as HTMLElement;
    const falsyContainer = this.componentElem.querySelector('.gameResult__falsy') as HTMLElement;

    this.createGameResultItems(truthyAnswerObjs, truthyContainer);
    this.createGameResultItems(falsyAnswerObjs, falsyContainer);
  }

  getBestTrueStreak(answers: { result: boolean; wordContent: WordContent }[]) {
    if (answers.length === 0) {
      return 0;
    }

    const streaks: Array<number> = [];
    let streak = 0;
    answers.forEach((answer, index) => {
      if (answer.result === true) {
        streak += 1;
      }

      if (index === answers.length - 1) {
        streaks.push(streak);
        return;
      }

      if (answer.result === false) {
        streaks.push(streak);
        streak = 0;
      }
    });

    streaks.sort((a, b) => b - a);
    return streaks[0];
  }

  async updateUserStatistics(
    gameName: 'sprint' | 'audioCall',
    answers: { result: boolean; wordContent: WordContent }[]
  ) {
    const currentDate = new Date().toLocaleDateString('en-US');
    const currentBestStreak = this.getBestTrueStreak(answers);

    const currentAmountOfRounds = answers.length;
    let currentAmountOfTruthyAnswers = 0;
    answers.forEach((answer) => {
      if (answer.result === true) {
        currentAmountOfTruthyAnswers += 1;
      }
    });

    // check if statistics exists
    try {
      const userStatistics = await this.serverAPI.getStatistics({
        token: this.localStorageAPI.accountStorage.token,
        id: this.localStorageAPI.accountStorage.id
      });

      // if no error: it does:

      // check if CURRENT statistics exists
      // if true => check which is better
      // if false => create 'current day' statistics
      if (currentDate in userStatistics.optional) {
        const currentDateOptionalStatistics = userStatistics.optional[currentDate];
        const updatedOptionalStatistics = userStatistics.optional;

        // increase totalCount and trueCount
        updatedOptionalStatistics[currentDate][gameName].totalCount += currentAmountOfRounds;
        updatedOptionalStatistics[currentDate][gameName].trueCount += currentAmountOfTruthyAnswers;

        // check if 'currentBestStreak' is better than one which is already in statistics
        // if true => update
        // if false => skip
        if (currentDateOptionalStatistics[gameName].bestStreak < currentBestStreak) {
          updatedOptionalStatistics[currentDate][gameName].bestStreak = currentBestStreak;
        }

        this.serverAPI.createStatistics({
          token: this.localStorageAPI.accountStorage.token,
          id: this.localStorageAPI.accountStorage.id,
          optional: updatedOptionalStatistics
        });
      } else {
        const updatedOptionalStatistics = userStatistics.optional;
        updatedOptionalStatistics[currentDate] = {
          sprint: {
            bestStreak: gameName === 'sprint' ? currentBestStreak : 0,
            totalCount: gameName === 'sprint' ? currentAmountOfRounds : 0,
            trueCount: gameName === 'sprint' ? currentAmountOfTruthyAnswers : 0
          },
          audioCall: {
            bestStreak: gameName === 'audioCall' ? currentBestStreak : 0,
            totalCount: gameName === 'audioCall' ? currentAmountOfRounds : 0,
            trueCount: gameName === 'audioCall' ? currentAmountOfTruthyAnswers : 0
          }
        };

        this.serverAPI.createStatistics({
          token: this.localStorageAPI.accountStorage.token,
          id: this.localStorageAPI.accountStorage.id,
          optional: updatedOptionalStatistics
        });
      }
    } catch {
      // statistics doesn't exist => create new one

      const optionalStatistics: OptionalUserStatistics = {
        [currentDate]: {
          sprint: {
            bestStreak: gameName === 'sprint' ? currentBestStreak : 0,
            totalCount: gameName === 'sprint' ? currentAmountOfRounds : 0,
            trueCount: gameName === 'sprint' ? currentAmountOfTruthyAnswers : 0
          },
          audioCall: {
            bestStreak: gameName === 'audioCall' ? currentBestStreak : 0,
            totalCount: gameName === 'audioCall' ? currentAmountOfRounds : 0,
            trueCount: gameName === 'audioCall' ? currentAmountOfTruthyAnswers : 0
          }
        }
      };

      this.serverAPI.createStatistics({
        token: this.localStorageAPI.accountStorage.token,
        id: this.localStorageAPI.accountStorage.id,
        optional: optionalStatistics
      });
    }
  }

  async updateUserWords_OptionalProperty(
    gameName: 'sprint' | 'audioCall',
    answers: { result: boolean; wordContent: WordContent }[]
  ) {
    const userWordsContent = await this.serverAPI.getUserWords({
      token: this.localStorageAPI.accountStorage.token,
      id: this.localStorageAPI.accountStorage.id
    });

    answers.forEach(async (answer) => {
      const relatedUserWordContent = userWordsContent.find(
        (userWordContent) => userWordContent.wordId === answer.wordContent.id
      );

      // checking if a word met for the first time in mini-games
      let isWordNew: boolean;
      if (relatedUserWordContent) {
        if (relatedUserWordContent.optional.dateWhenItBecameNew === false) {
          isWordNew = true;
        } else {
          isWordNew = false;
        }
      } else {
        isWordNew = true;
      }

      if (relatedUserWordContent) {
        const updatedOptional: OptionalUserWord = relatedUserWordContent.optional;

        if (gameName === 'sprint') {
          updatedOptional.sprint.totalCount += 1;
          if (answer.result === true) updatedOptional.sprint.trueCount += 1;
        } else if (gameName === 'audioCall') {
          updatedOptional.audioCall.totalCount += 1;
          if (answer.result === true) updatedOptional.audioCall.trueCount += 1;
        }

        // the userWord exists but has not been learned => set new 'dateWhenItBecameNew' and 'gameInWhichItBecameNew'
        if (isWordNew === true) {
          updatedOptional.dateWhenItBecameNew = new Date().toLocaleDateString('en-US');
          updatedOptional.gameInWhichItBecameNew = `${gameName}`;
        }

        const currentDifficulty = relatedUserWordContent.difficulty;

        if (currentDifficulty === 'basic') {
          updatedOptional.dateWhenItBecameLearned =
            answer.result === true ? new Date().toLocaleDateString('en-US') : false;

          this.serverAPI.updateUserWord({
            token: this.localStorageAPI.accountStorage.token,
            id: this.localStorageAPI.accountStorage.id,
            wordId: answer.wordContent.id,
            difficulty: answer.result === true ? 'learned' : 'hard',
            optional: updatedOptional
          });
        } else if (currentDifficulty === 'hard') {
          this.serverAPI.updateUserWord({
            token: this.localStorageAPI.accountStorage.token,
            id: this.localStorageAPI.accountStorage.id,
            wordId: answer.wordContent.id,
            difficulty: answer.result === true ? 'basic' : 'hard',
            optional: updatedOptional
          });
        } else if (currentDifficulty === 'learned') {
          this.serverAPI.updateUserWord({
            token: this.localStorageAPI.accountStorage.token,
            id: this.localStorageAPI.accountStorage.id,
            wordId: answer.wordContent.id,
            difficulty: answer.result === true ? 'learned' : 'basic',
            optional: updatedOptional
          });
        }
      } else {
        // this userWord doesn't exist => create new one
        const optional: OptionalUserWord = {
          dateWhenItBecameLearned:
            answer.result === true ? new Date().toLocaleDateString('en-US') : false,
          dateWhenItBecameNew: new Date().toLocaleDateString('en-US'),
          gameInWhichItBecameNew: gameName,
          sprint: {
            totalCount: 0,
            trueCount: 0
          },
          audioCall: {
            totalCount: 0,
            trueCount: 0
          }
        };

        if (gameName === 'sprint') {
          optional.sprint.totalCount = 1;
          optional.sprint.trueCount = answer.result === true ? 1 : 0;
        } else if (gameName === 'audioCall') {
          optional.audioCall.totalCount = 1;
          optional.audioCall.trueCount = answer.result === true ? 1 : 0;
        }

        this.serverAPI.createUserWord({
          token: this.localStorageAPI.accountStorage.token,
          id: this.localStorageAPI.accountStorage.id,
          wordId: answer.wordContent.id,
          difficulty: answer.result === true ? 'learned' : 'hard',
          optional
        });
      }
    });
  }

  createGameResultItems(
    answersObjs: {
      result: boolean;
      wordContent: WordContent;
    }[],
    hostElem: HTMLElement
  ) {
    answersObjs.forEach((answerObj) => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('gameResult__item');
      resultItem.innerHTML = this.innerHtmlTemplateGameResultItem;

      const audioElem = resultItem.querySelector('.gameResult__audio') as HTMLElement;
      const wordElem = resultItem.querySelector('.gameResult__word') as HTMLElement;
      const translateElem = resultItem.querySelector('.gameResult__translate') as HTMLElement;

      audioElem.addEventListener('click', () => {
        const audio = new Audio(`${this.contentURL}${answerObj.wordContent.audio}`);
        audio.play();
      });
      wordElem.textContent = answerObj.wordContent.word;
      translateElem.textContent = answerObj.wordContent.wordTranslate;

      hostElem.append(resultItem);
    });
  }
}
