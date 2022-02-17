import ServerAPI from '../../serverAPI';
import LocalStorageAPI from '../../localStorageAPI';
import Games from '../games/games';
import Page from './page/page';
import Background from '../background/background';

export default class Book {
  innerHtmlTemplate = `
    <h1>Учебник</h1>
    <div class="book__controls">
      <select class="book__inputSelect" name="group">
        <option value="0">Раздел 1</option>
        <option value="1">Раздел 2</option>
        <option value="2">Раздел 3</option>
        <option value="3">Раздел 4</option>
        <option value="4">Раздел 5</option>
        <option value="5">Раздел 6</option>
        <option value="hard">Сложные слова</option>
        <option value="learned">Изученные слова</option>
      </select>
      <div class="book__controls-page">
        <button class="book__controls-page__decreasePage">-</button>
        <input type="number" class="book__controls-page__inputNumber" name="page" min="1" max="30" value="1" readonly>
        <button class="book__controls-page__increasePage">+</button>
      </div>
      <button class="book__start-sprint-btn">Спринт</button>
      <button class="book__start-audioCall-btn">Аудиовызов</button>
    </div>
  `;

  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  games: Games;

  background: Background;

  contentURL: string;

  page: Page;

  componentElem: HTMLElement;

  constructor(
    serverAPI: ServerAPI,
    localStorageAPI: LocalStorageAPI,
    contentURL: string,
    games: Games,
    background: Background
  ) {
    this.componentElem = document.createElement('div');
    this.serverAPI = serverAPI;
    this.localStorageAPI = localStorageAPI;
    this.contentURL = contentURL;
    this.games = games;
    this.background = background;
    this.page = new Page(this.serverAPI, this.localStorageAPI, this.contentURL, this.componentElem);
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('book');

    this.page.showComponent();
    this.page.fillPage_GroupWords({ groupValue: '0', pageValue: '0' });
  }

  createComponent() {
    this.page.createComponent();

    this.createThisComponent();
  }

  setThisListeners() {
    this.pageChangeBtnsListeners();
    this.groupChangeListener();

    const startSprintBtn = this.componentElem.querySelector(
      '.book__start-sprint-btn'
    ) as HTMLButtonElement;
    const startAudioCallBtn = this.componentElem.querySelector(
      '.book__start-audioCall-btn'
    ) as HTMLButtonElement;

    startSprintBtn.addEventListener('click', () => {
      const { groupValue, pageValue } = this.getInputValues();

      if (groupValue === 'hard') {
        const hardWordsElements = document.querySelectorAll(
          '.pageItem_hard-word'
        ) as NodeListOf<HTMLDivElement>;

        if (hardWordsElements.length < 5) {
          alert('Для игры "Спринт" необходимо минимум 5 "сложных" слов');
          return;
        }

        this.games.sprint.startGameWithHardWords();
      } else if (typeof +groupValue === 'number') {
        this.games.sprint.startGameFromPage({ group: +groupValue, page: +pageValue });
      }

      this.background.enableBg();
      this.background.setTheme('sprint');
    });

    startAudioCallBtn.addEventListener('click', () => {
      const { groupValue, pageValue } = this.getInputValues();

      if (groupValue === 'hard') {
        const hardWordsElements = document.querySelectorAll(
          '.pageItem_hard-word'
        ) as NodeListOf<HTMLDivElement>;

        if (hardWordsElements.length < 10) {
          alert('Для игры "Аудиовызов" необходимо минимум 10 "сложных" слов');
          return;
        }

        this.games.audioCall.startGameWithHardWords();
      } else if (typeof +groupValue === 'number') {
        console.log('from page');
        this.games.audioCall.startGameFromPage({ group: +groupValue, page: +pageValue });
      }

      this.background.enableBg();
      this.background.setTheme('audioCall');
    });
  }

  setListeners() {
    this.setThisListeners();
  }

  showComponent = () => {
    this.createComponent();
    this.setListeners();

    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.append(this.componentElem);
  };

  hideComponent = () => {
    document.querySelector('.book')?.remove();
  };

  pageChangeBtnsListeners() {
    const pageInput = this.componentElem.querySelector(
      '.book__controls-page__inputNumber'
    ) as HTMLInputElement;
    const increasePageBtn = this.componentElem.querySelector(
      '.book__controls-page__increasePage'
    ) as HTMLButtonElement;
    const decreasePageBtn = this.componentElem.querySelector(
      '.book__controls-page__decreasePage'
    ) as HTMLButtonElement;

    increasePageBtn.addEventListener('click', () => {
      const newValue = +pageInput.value + 1;
      if (newValue > +pageInput.max) {
        return;
      }
      pageInput.value = `${newValue}`;
      this.page.fillPage_GroupWords(this.getInputValues());
    });

    decreasePageBtn.addEventListener('click', () => {
      const newValue = +pageInput.value - 1;
      if (newValue < +pageInput.min) {
        return;
      }
      pageInput.value = `${newValue}`;
      this.page.fillPage_GroupWords(this.getInputValues());
    });
  }

  groupChangeListener() {
    const groupInput = this.componentElem.querySelector(
      '.book__inputSelect[name="group"]'
    ) as HTMLSelectElement;
    const pageInput = this.componentElem.querySelector(
      '.book__controls-page__inputNumber'
    ) as HTMLInputElement;

    const increasePageBtn = this.componentElem.querySelector(
      '.book__controls-page__increasePage'
    ) as HTMLButtonElement;
    const decreasePageBtn = this.componentElem.querySelector(
      '.book__controls-page__decreasePage'
    ) as HTMLButtonElement;

    const startSprintBtn = this.componentElem.querySelector(
      '.book__start-sprint-btn'
    ) as HTMLButtonElement;
    const startAudioCallBtn = this.componentElem.querySelector(
      '.book__start-audioCall-btn'
    ) as HTMLButtonElement;

    function disableStartGameBtns() {
      startSprintBtn.style.cursor = `not-allowed`;
      startAudioCallBtn.style.cursor = `not-allowed`;
      startSprintBtn.disabled = true;
      startAudioCallBtn.disabled = true;
    }

    function enableStartGameBtns() {
      startSprintBtn.style.cursor = ``;
      startAudioCallBtn.style.cursor = ``;
      startSprintBtn.disabled = false;
      startAudioCallBtn.disabled = false;
    }

    function disablePageBtns() {
      increasePageBtn.style.cursor = `not-allowed`;
      decreasePageBtn.style.cursor = `not-allowed`;
      increasePageBtn.disabled = true;
      decreasePageBtn.disabled = true;
    }

    function enablePageBtns() {
      increasePageBtn.style.cursor = ``;
      decreasePageBtn.style.cursor = ``;
      increasePageBtn.disabled = false;
      decreasePageBtn.disabled = false;
    }

    groupInput.addEventListener('input', () => {
      pageInput.value = pageInput.min;

      if (groupInput.value === 'hard') {
        disablePageBtns();
        enableStartGameBtns();

        this.page.fillPage_HardWords_or_LearnedWords('hard');
      } else if (groupInput.value === 'learned') {
        disablePageBtns();
        disableStartGameBtns();

        this.page.fillPage_HardWords_or_LearnedWords('learned');
      } else {
        enablePageBtns();
        enableStartGameBtns();

        this.page.fillPage_GroupWords(this.getInputValues());
      }
    });
  }

  getInputValues() {
    const groupInput = this.componentElem.querySelector(
      '.book__inputSelect[name="group"]'
    ) as HTMLSelectElement;
    const pageInput = this.componentElem.querySelector(
      '.book__controls-page__inputNumber'
    ) as HTMLInputElement;

    const groupValue = groupInput.value;
    const pageValue = `${+pageInput.value - 1}`;

    return { groupValue, pageValue };
  }
}
