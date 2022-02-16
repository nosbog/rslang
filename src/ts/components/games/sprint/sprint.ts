import ServerAPI from '../../../serverAPI';
import GameResult from '../gameResult/gameResult';
import { getRandomInt, getRandomTrueOrFalse } from '../../../utils';
import { WordContent } from '../../../interfaces/interfaceServerAPI';

export default class Sprint {
  innerHtmlTemplate = `
    <div class="wrapper">
      <div class="sprint__timer-container">
        <div class="sprint__timer"></div>
        <svg>
          <circle r="18" cx="20" cy="20"></circle>
        </svg>
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

  innerHtmlTemplateResultItem = `
    <img class="sprint__result__audio" src="./assets/svg/volumeUp.svg" alt="volumeUp">
    <div class="sprint__result__word"></div>
    <div class="sprint__result__translate"></div>
  `;

  gameData: {
    answers: Array<{ result: boolean; wordContent: WordContent }>;
    initialPage: number;
    currentPage: number;
    currentWordIndex: number;
    currentGroup: number;
    wordsContent: Array<WordContent>;
  } = {
    answers: [],
    initialPage: 0,
    currentPage: 0,
    currentGroup: 0,
    currentWordIndex: 0,
    wordsContent: []
  };

  serverAPI: ServerAPI;

  componentElem: HTMLElement;

  contentURL: string;

  gameResult: GameResult;

  constructor(serverAPI: ServerAPI, contentURL: string, gameResult: GameResult) {
    this.componentElem = document.createElement('div');
    this.serverAPI = serverAPI;
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
      currentWordIndex: 0,
      wordsContent
    };

    this.startTimer();
    this.startRound();
  }

  async startRound() {
    const sprintRoundElem = document.querySelector('.sprint__round') as HTMLDivElement;
    sprintRoundElem.innerHTML = this.innerHtmlTemplateRound;

    // you can go to the next page if you run out of elements on the current one
    if (this.gameData.currentWordIndex >= 20) {
      await this.updateWordsContent();
    }

    const { currentWordIndex } = this.gameData;
    this.gameData.currentWordIndex += 1;
    const wordContentAnswer = this.gameData.wordsContent[currentWordIndex];

    const { word } = wordContentAnswer;
    const isOptionTruthy = getRandomTrueOrFalse();
    let option: string;
    if (isOptionTruthy === true) {
      option = wordContentAnswer.wordTranslate;
    } else {
      const itemsOnPage = 20;
      let randomInt = getRandomInt(0, itemsOnPage - 1);
      while (randomInt === currentWordIndex) {
        randomInt = getRandomInt(0, itemsOnPage - 1);
      }
      option = this.gameData.wordsContent[randomInt].wordTranslate;
    }

    const wordElem = sprintRoundElem.querySelector('.sprint__word') as HTMLDivElement;
    const optionElem = sprintRoundElem.querySelector('.sprint__option') as HTMLDivElement;
    wordElem.textContent = word;
    optionElem.textContent = option;

    this.answerBtnsListeners(isOptionTruthy, wordContentAnswer);
  }

  async updateWordsContent() {
    this.gameData.currentWordIndex = 0;

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

  answerBtnsListeners(isOptionTruthy: boolean, wordContentAnswer: WordContent) {
    const yesBtn = document.querySelector('.sprint__yes') as HTMLButtonElement;
    const noBtn = document.querySelector('.sprint__no') as HTMLButtonElement;

    yesBtn.addEventListener('click', () => {
      let result: boolean;
      if (isOptionTruthy === true) {
        result = true;
      } else {
        result = false;
      }

      this.gameData.answers.push({ result, wordContent: wordContentAnswer });
      this.startRound();
    });

    noBtn.addEventListener('click', () => {
      let result: boolean;
      if (isOptionTruthy === true) {
        result = false;
      } else {
        result = true;
      }

      this.gameData.answers.push({ result, wordContent: wordContentAnswer });
      this.startRound();
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
  }
}
