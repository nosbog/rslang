import ServerAPI from '../../../serverAPI';
import GameResult from '../gameResult/gameResult';
import { getRandomInt } from '../../../utils';
import { WordContent } from '../../../interfaces/interfaceServerAPI';

export default class AudioCall {
  innerHtmlTemplate = `
    <div class="wrapper wrapper_padding">
      <h2>AudioCall</h2>
      <div class="audioCall__round"></div>
    </div>
  `;

  innerHtmlTemplateRound = `
    <div class="audioCall__round-result">
      <img class="audioCall__wordImg" src="" alt="result image">
      <div class="audioCall__round-result__container">
        <img class="audioCall__audioImg audioCall__audioImg_small" src="./assets/svg/volumeUp.svg" alt="audio">
        <div class="audioCall__round-result__word"></div>
      </div>
    </div>
    <img class="audioCall__audioImg audioCall__audioImg_big" src="./assets/svg/volumeUp.svg" alt="audio">
    <div class="audioCall__options">
      <button class="audioCall__option"></button>
      <button class="audioCall__option"></button>
      <button class="audioCall__option"></button>
      <button class="audioCall__option"></button>
      <button class="audioCall__option"></button>
    </div>
    <button class="audioCall__btn audioCall__btn_skip">Не знаю</button>
    <button class="audioCall__btn audioCall__btn_continue audioCall__btn_hide">Продолжить</button>
  `;

  gameData: {
    answers: Array<{ result: boolean; wordContent: WordContent }>;
    initialPage: number;
    currentPage: number;
    currentWordContentIndex: number;
    currentGroup: number;
    wordsContent: Array<WordContent>;
    wordsContentAnswers: Array<WordContent>;
  } = {
    answers: [],
    initialPage: 0,
    currentPage: 0,
    currentGroup: 0,
    currentWordContentIndex: 0,
    wordsContent: [],
    wordsContentAnswers: []
  };

  componentElem: HTMLElement;

  serverAPI: ServerAPI;

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
    this.componentElem.classList.add('audioCall');
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

    // preparing random answers for the future rounds
    const wordsContentAnswers: WordContent[] = [];
    const usedNums: number[] = [];
    const answersAmount = 10;
    for (let i = 0; i < answersAmount; i += 1) {
      const itemsOnPage = 20;
      let randomInt = getRandomInt(0, itemsOnPage - 1);
      while (usedNums.includes(randomInt)) {
        randomInt = getRandomInt(0, itemsOnPage - 1);
      }
      usedNums.push(randomInt);
      wordsContentAnswers.push(wordsContent[randomInt]);
    }

    this.gameData = {
      answers: [],
      initialPage: page,
      currentPage: page,
      currentGroup: group,
      currentWordContentIndex: 0,
      wordsContent,
      wordsContentAnswers
    };

    this.startRound();
  }

  async startRound() {
    const audioCallRoundElem = document.querySelector('.audioCall__round') as HTMLDivElement;
    audioCallRoundElem.innerHTML = this.innerHtmlTemplateRound;

    const wordContentAnswer =
      this.gameData.wordsContentAnswers[this.gameData.currentWordContentIndex];
    this.gameData.currentWordContentIndex += 1;

    // 5 optionElements = 1 answer wordTranslate + 4 options wordTranslate
    const randomAnswerPosition = getRandomInt(0, 4);

    this.fillAnswerInfo(wordContentAnswer);
    this.fillOptionsInfo(wordContentAnswer, randomAnswerPosition);
    this.skipBtnListener(wordContentAnswer, randomAnswerPosition);
  }

  skipBtnListener(wordContentAnswer: WordContent, randomAnswerPosition: number) {
    const skipBtn = document.querySelector('.audioCall__btn_skip') as HTMLButtonElement;

    skipBtn.addEventListener('click', () => {
      this.gameData.answers.push({
        result: false,
        wordContent: wordContentAnswer
      });

      this.showRoundResult(null, randomAnswerPosition);
    });
  }

  fillOptionsInfo(wordContentAnswer: WordContent, randomAnswerPosition: number) {
    const falsyOptionValues: string[] = [];
    const falsyOptionsAmount = 4;
    for (let i = 0; i < falsyOptionsAmount; i += 1) {
      const itemsOnPage = 20;
      let randomInt = getRandomInt(0, itemsOnPage - 1);
      let potentialWordTranslate = this.gameData.wordsContent[randomInt].wordTranslate;
      while (
        falsyOptionValues.includes(potentialWordTranslate) ||
        wordContentAnswer.wordTranslate === potentialWordTranslate
      ) {
        randomInt = getRandomInt(0, itemsOnPage - 1);
        potentialWordTranslate = this.gameData.wordsContent[randomInt].wordTranslate;
      }
      falsyOptionValues.push(potentialWordTranslate);
    }

    const optionElements = document.querySelectorAll(
      '.audioCall__option'
    ) as NodeListOf<HTMLDivElement>;

    optionElements.forEach((optionElem, index) => {
      if (index === randomAnswerPosition) {
        optionElem.textContent = `${wordContentAnswer.wordTranslate}`;
      } else {
        optionElem.textContent = `${falsyOptionValues[0]}`;
        falsyOptionValues.splice(0, 1);
      }
    });

    optionElements.forEach((optionsElem, index) => {
      optionsElem.addEventListener('click', () => {
        const isTruthyOption = index === randomAnswerPosition;
        this.gameData.answers.push({
          result: isTruthyOption,
          wordContent: wordContentAnswer
        });

        this.showRoundResult(index, randomAnswerPosition);
      });
    });
  }

  fillAnswerInfo(wordContentAnswer: WordContent) {
    const wordElem = document.querySelector('.audioCall__round-result__word') as HTMLDivElement;
    const audioImgs = document.querySelectorAll(
      '.audioCall__audioImg'
    ) as NodeListOf<HTMLImageElement>;
    const wordImg = document.querySelector('.audioCall__wordImg') as HTMLImageElement;

    wordElem.textContent = wordContentAnswer.word;
    audioImgs.forEach((audioImg) => {
      audioImg.addEventListener('click', () => {
        const audio = new Audio(`${this.contentURL}${wordContentAnswer.audio}`);
        audio.play();
      });
    });
    wordImg.src = `${this.contentURL}${wordContentAnswer.image}`;

    // make single sound
    audioImgs[0].dispatchEvent(new Event('click'));
  }

  showRoundResult(guessedPosition: number | null, answerPosition: number) {
    const roundResultElem = document.querySelector('.audioCall__round-result') as HTMLDivElement;
    roundResultElem.classList.add('audioCall__round-result_show');

    const bigAudioImg = document.querySelector('.audioCall__audioImg_big') as HTMLImageElement;
    bigAudioImg.style.display = 'none';

    const skipBtn = document.querySelector('.audioCall__btn_skip') as HTMLButtonElement;
    const continueBtn = document.querySelector('.audioCall__btn_continue') as HTMLButtonElement;
    skipBtn.classList.add('audioCall__btn_hide');
    continueBtn.classList.remove('audioCall__btn_hide');

    const options = document.querySelectorAll(
      '.audioCall__option'
    ) as NodeListOf<HTMLButtonElement>;
    options.forEach((option) => {
      option.classList.add('audioCall__option_disabled');
    });

    options[answerPosition].classList.add('audioCall__option_truthy-answer');
    if (guessedPosition !== answerPosition && typeof guessedPosition === 'number') {
      options[guessedPosition].classList.add('audioCall__option_falsy-answer');
    }

    continueBtn.addEventListener('click', () => {
      if (this.gameData.answers.length >= 10) {
        this.showGameResult();
      } else {
        this.startRound();
      }
    });
  }

  showGameResult() {
    this.gameResult.showComponent(this.gameData.answers);
  }
}
