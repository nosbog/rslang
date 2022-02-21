import ServerAPI from '../../../serverAPI';
import LocalStorageAPI from '../../../localStorageAPI';
import GameResult from '../gameResult/gameResult';
import { getRandomInt, getRandomTrueOrFalse } from '../../../utils';
import { UserWordContent, WordContent } from '../../../interfaces/interfaceServerAPI';

export default class Sprint {
  innerHtmlTemplate = `
    <div class="wrapper">
      <div class="sprint__content">
        <div class="sprint__timer-container">
          <div class="sprint__timer"></div>
          <svg>
            <circle r="18" cx="20" cy="20"></circle>
          </svg>
        </div>
        <div class="sprint__stat">
          <div class="sprint__stat-multiply">
            Умножение: x 
            <span class="sprint__multiplier"></span>
            <span class="sprint__stat-current-score"></span>
          </div>
          <div class="sprint__score">
            Очки: <span>0</span>
          </div>
        </div>
        <div class="sprint__series-count">
          <div class="dots-container">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <div class="sprint__round"></div>
    </div>
  `;

  innerHtmlTemplateRound = `
    <div class="sprint__word"></div>
    <p>это</p>
    <div class="sprint__option"></div>
    <div class="sprint__btns">
      <button class="sprint__no">Неверно</button>
      <button class="sprint__yes">Верно</button>
    </div>
  `;

  gameData: {
    answers: Array<{ result: boolean; wordContent: WordContent }>;
    initialPage: number;
    currentPage: number;
    currentWordContentIndex: number;
    currentGroup: number;
    intervalId: number;
    wordsContent: Array<WordContent>;
    userLearnedWordsContent?: Array<UserWordContent>;
    totalScore: number;
    multiplier: number;
    currentScore: number;
    seriesCount: number;
  } = {
    answers: [],
    initialPage: 0,
    currentPage: 0,
    currentGroup: 0,
    currentWordContentIndex: 0,
    intervalId: 0,
    wordsContent: [],
    totalScore: 0,
    multiplier: 1,
    currentScore: 20,
    seriesCount: 0
  };

  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  componentElem: HTMLElement;

  contentURL: string;

  gameResult: GameResult;

  constructor(
    serverAPI: ServerAPI,
    localStorageAPI: LocalStorageAPI,
    contentURL: string,
    gameResult: GameResult
  ) {
    this.componentElem = document.createElement('div');
    this.serverAPI = serverAPI;
    this.localStorageAPI = localStorageAPI;
    this.contentURL = contentURL;
    this.gameResult = gameResult;
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('sprint');
  }

  createComponent() {
    this.createThisComponent();
  }

  async startGameWithHardWords() {
    const footerElem = document.querySelector('.footer') as HTMLElement;
    footerElem.remove();

    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.innerHTML = ``;
    contentElem.append(this.componentElem);

    const userWordsContent = await this.serverAPI.getUserWords({
      token: this.localStorageAPI.accountStorage.token,
      id: this.localStorageAPI.accountStorage.id
    });

    const userHardWordsContent = userWordsContent.filter(
      (userWord) => userWord.difficulty === 'hard'
    );

    const hardWordsContentPromises = userHardWordsContent.map(async (userHardWord) =>
      this.serverAPI.getWordByWordId({ wordId: userHardWord.wordId })
    );

    const hardWordsContent = await Promise.all(hardWordsContentPromises);

    this.gameData = {
      answers: [],
      initialPage: 0,
      currentPage: 0,
      currentGroup: 0,
      currentWordContentIndex: 0,
      intervalId: 0,
      wordsContent: hardWordsContent,
      totalScore: 0,
      multiplier: 1,
      currentScore: 20,
      seriesCount: 0
    };

    this.startTimer();
    this.startRoundWithHardWords();
  }

  async startRoundWithHardWords() {
    const sprintRoundElem = document.querySelector('.sprint__round') as HTMLDivElement;
    sprintRoundElem.innerHTML = this.innerHtmlTemplateRound;

    // TODO: i was here
    this.setSprintStat();

    // if the 'hard' words are over => end the game
    if (this.gameData.currentWordContentIndex === this.gameData.wordsContent.length) {
      clearTimeout(this.gameData.intervalId);
      this.gameResult.showComponent('sprint', this.gameData.answers);
      return;
    }

    const { currentWordContentIndex } = this.gameData;
    this.gameData.currentWordContentIndex += 1;
    const wordContentAnswer = this.gameData.wordsContent[currentWordContentIndex];

    const { word } = wordContentAnswer;
    const isOptionTruthy = getRandomTrueOrFalse();
    let option: string;
    if (isOptionTruthy === true) {
      option = wordContentAnswer.wordTranslate;
    } else {
      const itemsOnPage = this.gameData.wordsContent.length - 1;
      let randomInt = getRandomInt(0, itemsOnPage - 1);
      while (randomInt === currentWordContentIndex) {
        randomInt = getRandomInt(0, itemsOnPage - 1);
      }
      option = this.gameData.wordsContent[randomInt].wordTranslate;
    }

    const wordElem = sprintRoundElem.querySelector('.sprint__word') as HTMLDivElement;
    const optionElem = sprintRoundElem.querySelector('.sprint__option') as HTMLDivElement;
    wordElem.textContent = word;
    optionElem.textContent = option;

    this.answerBtnsListeners({
      isOptionTruthy,
      wordContentAnswer,
      isGameWithHardsWords: true,
      skipLearnedWords: false
    });
  }

  async startGameFromPage({ group, page }: { group: number; page: number }) {
    const footerElem = document.querySelector('.footer') as HTMLElement;
    footerElem.remove();

    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.innerHTML = ``;
    contentElem.append(this.componentElem);

    if (this.localStorageAPI.accountStorage.isLoggedIn === true) {
      const [wordsContent, userWordsContent] = await Promise.all([
        this.serverAPI.getWords({ group, page }),
        this.serverAPI.getUserWords({
          token: this.localStorageAPI.accountStorage.token,
          id: this.localStorageAPI.accountStorage.id
        })
      ]);

      const userLearnedWordsContent = userWordsContent.filter(
        (userWord) => userWord.difficulty === 'learned'
      );

      this.gameData = {
        answers: [],
        initialPage: page,
        currentPage: page,
        currentGroup: group,
        currentWordContentIndex: 0,
        intervalId: 0,
        userLearnedWordsContent,
        wordsContent,
        totalScore: 0,
        multiplier: 1,
        currentScore: 20,
        seriesCount: 0
      };

      this.startTimer();
      this.startRound({ skipLearnedWords: true });
    } else {
      const wordsContent = await this.serverAPI.getWords({ group, page });

      this.gameData = {
        answers: [],
        initialPage: page,
        currentPage: page,
        currentGroup: group,
        currentWordContentIndex: 0,
        intervalId: 0,
        wordsContent,
        totalScore: 0,
        multiplier: 1,
        currentScore: 20,
        seriesCount: 0
      };

      this.startTimer();
      this.startRound({ skipLearnedWords: false });
    }
  }

  async startGame(group: number) {
    const footerElem = document.querySelector('.footer') as HTMLElement;
    footerElem.remove();

    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.innerHTML = ``;
    contentElem.append(this.componentElem);

    const pagesInGroup = 30;
    const page = getRandomInt(0, pagesInGroup - 1);
    const wordsContent = await this.serverAPI.getWords({ group, page });

    this.gameData = {
      answers: [],
      initialPage: page,
      currentPage: page,
      currentGroup: group,
      currentWordContentIndex: 0,
      intervalId: 0,
      wordsContent,
      totalScore: 0,
      multiplier: 1,
      currentScore: 20,
      seriesCount: 0
    };

    this.startTimer();
    this.startRound({ skipLearnedWords: false });
  }

  async startRound({ skipLearnedWords }: { skipLearnedWords: boolean }) {
    const sprintRoundElem = document.querySelector('.sprint__round') as HTMLDivElement;
    sprintRoundElem.innerHTML = this.innerHtmlTemplateRound;

    // TODO
    this.setSprintStat();

    // you can go to the next page if you run out of elements on the current one
    if (this.gameData.currentWordContentIndex >= 20) {
      await this.updateWordsContent();
    }

    let wordContentAnswer: WordContent;
    let currentWordContentIndex: number;

    // skip learned words if needed
    if (skipLearnedWords === true && this.gameData.userLearnedWordsContent) {
      do {
        if (this.gameData.currentWordContentIndex >= 20) {
          // eslint-disable-next-line
          await this.updateWordsContent();

          // if there was a full cycle of pages in the group => end game
          // if not => look for not learned words on this page
          if (this.gameData.initialPage === this.gameData.currentPage) {
            clearInterval(this.gameData.intervalId);
            this.gameResult.showComponent('sprint', this.gameData.answers);
            return;
          }
        }

        currentWordContentIndex = this.gameData.currentWordContentIndex;
        this.gameData.currentWordContentIndex += 1;
        wordContentAnswer = this.gameData.wordsContent[currentWordContentIndex];
      } while (
        this.gameData.userLearnedWordsContent.some(
          // eslint-disable-next-line
          (userLearnedWord) => userLearnedWord.wordId === wordContentAnswer.id
        )
      );
    } else {
      currentWordContentIndex = this.gameData.currentWordContentIndex;
      this.gameData.currentWordContentIndex += 1;
      wordContentAnswer = this.gameData.wordsContent[currentWordContentIndex];
    }

    const { word } = wordContentAnswer;
    const isOptionTruthy = getRandomTrueOrFalse();
    let option: string;
    if (isOptionTruthy === true) {
      option = wordContentAnswer.wordTranslate;
    } else {
      const itemsOnPage = 20;
      let randomInt = getRandomInt(0, itemsOnPage - 1);
      while (randomInt === currentWordContentIndex) {
        randomInt = getRandomInt(0, itemsOnPage - 1);
      }
      option = this.gameData.wordsContent[randomInt].wordTranslate;
    }

    const wordElem = sprintRoundElem.querySelector('.sprint__word') as HTMLDivElement;
    const optionElem = sprintRoundElem.querySelector('.sprint__option') as HTMLDivElement;
    wordElem.textContent = word;
    optionElem.textContent = option;

    this.answerBtnsListeners({
      isOptionTruthy,
      wordContentAnswer,
      isGameWithHardsWords: false,
      skipLearnedWords
    });
  }

  async updateWordsContent() {
    // because its new group => set index to '0'
    this.gameData.currentWordContentIndex = 0;

    let prevPage = this.gameData.currentPage - 1;
    if (prevPage <= -1) {
      const lastPageIndex = 29;
      prevPage = lastPageIndex;
    }
    this.gameData.currentPage = prevPage;

    this.gameData.wordsContent = await this.serverAPI.getWords({
      group: this.gameData.currentGroup,
      page: this.gameData.currentPage
    });
  }

  answerBtnsListeners({
    isOptionTruthy,
    wordContentAnswer,
    isGameWithHardsWords,
    skipLearnedWords
  }: {
    isOptionTruthy: boolean;
    wordContentAnswer: WordContent;
    isGameWithHardsWords: boolean;
    skipLearnedWords: boolean;
  }) {
    const yesBtn = document.querySelector('.sprint__yes') as HTMLButtonElement;
    const noBtn = document.querySelector('.sprint__no') as HTMLButtonElement;

    const truthyAnswerSound = new Audio('./assets/sounds/truthy-answer.mp3');
    const falsyAnswerSound = new Audio('./assets/sounds/falsy-answer.mp3');

    yesBtn.addEventListener('click', () => {
      let result: boolean;
      if (isOptionTruthy === true) {
        result = true;
        truthyAnswerSound.play();
        this.updateStat(result);
      } else {
        result = false;
        falsyAnswerSound.play();
        this.updateStat(result);
      }

      this.gameData.answers.push({ result, wordContent: wordContentAnswer });

      if (isGameWithHardsWords) {
        this.startRoundWithHardWords();
      } else {
        this.startRound({ skipLearnedWords });
      }
    });

    noBtn.addEventListener('click', () => {
      let result: boolean;
      if (isOptionTruthy === true) {
        result = false;
        falsyAnswerSound.play();
        this.updateStat(result);
      } else {
        result = true;
        truthyAnswerSound.play();
        this.updateStat(result);
      }

      this.gameData.answers.push({ result, wordContent: wordContentAnswer });

      if (isGameWithHardsWords) {
        this.startRoundWithHardWords();
      } else {
        this.startRound({ skipLearnedWords });
      }
    });
  }

  startTimer() {
    const timerElem = this.componentElem.querySelector('.sprint__timer') as HTMLDivElement;

    let secondsGameDuration = 10;
    timerElem.textContent = `${secondsGameDuration}`;

    const intervalId = setInterval(() => {
      timerElem.textContent = `${secondsGameDuration}`;
      if (secondsGameDuration <= 0) {
        const sprintElem = document.querySelector('.sprint') as HTMLDivElement;
        // check if the user has left the sprint game: if elem with 'sprint' class exists
        if (sprintElem) {
          this.gameResult.showComponent('sprint', this.gameData.answers);
        }
        clearInterval(intervalId);
      }
      secondsGameDuration -= 1;
    }, 1000);

    this.gameData.intervalId = +`${intervalId}`;
  }

  setSprintStat() {
    const statContainer = this.componentElem.querySelector('.sprint__stat');
    const scoreContainer = statContainer?.querySelector('.sprint__score span') as HTMLElement;
    const multiplierContainer = statContainer?.querySelector('.sprint__multiplier') as HTMLElement;
    const currentScoreContainer = statContainer?.querySelector(
      '.sprint__stat-current-score'
    ) as HTMLElement;
    const seriesCountDotsContainer = this.componentElem.querySelector(
      '.dots-container'
    ) as HTMLElement;

    scoreContainer.textContent = ` ${this.gameData.totalScore} `;
    multiplierContainer.textContent = ` ${this.gameData.multiplier} `;
    currentScoreContainer.textContent = ` +${this.gameData.currentScore} `;

    if (this.gameData.seriesCount !== 0) {
      seriesCountDotsContainer
        .querySelector(`.dot:nth-child(${this.gameData.seriesCount})`)
        ?.classList.add('active');
    } else {
      const dots = seriesCountDotsContainer.querySelectorAll('.dot');
      dots.forEach((dot) => dot.classList.remove('active'));
    }
  }

  updateStat(isCorrectAnswer: boolean) {
    if (isCorrectAnswer) {
      this.gameData.totalScore += this.gameData.currentScore;

      if (this.gameData.seriesCount === 3) {
        this.gameData.seriesCount = 0;
        this.gameData.multiplier += 1;
        this.gameData.currentScore += 20;
      } else {
        this.gameData.seriesCount += 1;
      }

    } else {
      this.gameData.seriesCount = 0;
    }

    this.setSprintStat();
  }
}
