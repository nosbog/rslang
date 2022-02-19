import ServerAPI from '../../serverAPI';
import LocalStorageAPI from '../../localStorageAPI';
import Page from './page/page';

export default class Book {
  innerHtmlTemplate = `
    <div class="book__controls">
      <div class="wrapper">
        <div class="book__controls-column">
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
            <button class="book__controls-page__decreasePage">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span>Страница 
              <input type="number" class="book__controls-page__inputNumber" name="page" min="1" max="20" value="1" readonly>
            </span>
            <button class="book__controls-page__increasePage">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="book__controls-column">
          <button class="book__start-sprint-btn">Спринт</button>
          <button class="book__start-audioCall-btn">Аудиовызов</button>
        </div>
      </div>
    </div>
    <div class="svg-container">
      <svg viewBox="0 0 1440 800" class="svg-separator separator_light">
        <path stroke="null" stroke-width="0" id="svg_1" d="m122.91166,19.21086l67.4627,-4.45087c164.12568,2.93808 112.77348,114.02441 226.55386,153.10492c113.78038,39.0805 182.24999,19.99395 311.13396,46.55868c128.88397,26.56473 181.24309,164.6763 302.07181,131.76294c120.82872,-34.17119 329.25827,147.1198 415.85219,155.1956l2.01381,3.90805l-3.02072,295.37228l-60.41436,0c-60.41436,0 -181.24309,0 -302.07181,0c-120.82872,0 -241.65745,0 -362.48617,0c-120.82872,0 -241.65745,0 -362.48617,0c-120.82872,0 -241.65745,0 -302.07181,0l-60.41436,0l-5.03453,-767.98558c13.42541,0.58899 11.74724,1.17799 45.31077,-12.23301c33.56353,-13.411 55.04419,-1.82201 87.60082,-1.23301z"/>
      </svg>
    </div>
    <div class="wrapper wrapper_padding wrapper-book">
    </div>
  `;

  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  contentURL: string;

  page: Page;

  componentElem: HTMLElement;

  constructor(serverAPI: ServerAPI, localStorageAPI: LocalStorageAPI, contentURL: string) {
    this.componentElem = document.createElement('div');
    this.serverAPI = serverAPI;
    this.localStorageAPI = localStorageAPI;
    this.contentURL = contentURL;
    this.page = new Page(this.serverAPI, this.localStorageAPI, this.contentURL, this.componentElem);
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('book');
    this.componentElem.setAttribute('data-learned-page', '');
    this.componentElem.setAttribute('data-page-group', '0');

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

      this.page.updateTheme(groupInput.value);
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
