import { WordContent } from '../../../interfaces/interfaceServerAPI';

export default class GameResult {
  innerHtmlTemplate = `
  <div class="gameResult__container">
    <div class="gameResult__truthy">
      <p>Правильные ответы:</p>
      
    </div>
    <div class="gameResult__falsy">
      <p>Неправильные ответы:</p>

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
    <div class="gameResult__translate"></div>
  `;

  contentURL: string;

  componentElem: HTMLElement;

  constructor(contentURL: string) {
    this.componentElem = document.createElement('div');
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

  showComponent(answers: Array<{ result: boolean; wordContent: WordContent }>) {
    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.append(this.componentElem);

    const truthyAnswerObjs = answers.filter((answerObj) => answerObj.result === true);
    const falsyAnswerObjs = answers.filter((answerObj) => answerObj.result === false);

    const truthyContainer = this.componentElem.querySelector('.gameResult__truthy') as HTMLElement;
    const falsyContainer = this.componentElem.querySelector('.gameResult__falsy') as HTMLElement;

    this.createGameResultItems(truthyAnswerObjs, truthyContainer);
    this.createGameResultItems(falsyAnswerObjs, falsyContainer);
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
