export default class Header {
  innerHtmlTemplate = `
  <nav class="nav">
    <ul>
      <li id="mainBtn">RSlang</li>
      <li id="bookBtn">Учебник</li>
      <li id="gamesBtn">Мини-игры</li>
      <li id="statisticBtn">Статистика</li>
      <li id="account">Аккаунт</li>
    </ul>
    
  </nav>
  `;

  componentElem: HTMLElement;

  constructor() {
    this.componentElem = document.createElement('header');
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('header');
  }

  setThisListeners({
    showAccount,
    showFooter,
    showMain,
    showBook,
    showGames,
    showStatistic
  }: {
    showAccount: () => void;
    showFooter: () => void;
    showMain: () => void;
    showBook: () => void;
    showGames: () => void;
    showStatistic: () => void;
  }) {
    this.componentElem.querySelector('#mainBtn')?.addEventListener('click', () => {
      this.resetContentComponents();
      showFooter();
      showMain();
    });

    this.componentElem.querySelector('#bookBtn')?.addEventListener('click', () => {
      this.resetContentComponents();
      showFooter();
      showBook();
    });

    this.componentElem.querySelector('#gamesBtn')?.addEventListener('click', () => {
      this.resetContentComponents();
      showFooter();
      showGames();
    });

    this.componentElem.querySelector('#statisticBtn')?.addEventListener('click', () => {
      this.resetContentComponents();
      showFooter();
      showStatistic();
    });

    this.componentElem.querySelector('#account')?.addEventListener('click', () => {
      this.resetContentComponents();
      showFooter();
      showAccount();
    });
  }

  createComponent() {
    this.createThisComponent();
  }

  setListeners({
    showAccount,
    showFooter,
    showMain,
    showBook,
    showGames,
    showStatistic
  }: {
    showAccount: () => void;
    showFooter: () => void;
    showMain: () => void;
    showBook: () => void;
    showGames: () => void;
    showStatistic: () => void;
  }) {
    this.setThisListeners({
      showAccount,
      showFooter,
      showMain,
      showBook,
      showGames,
      showStatistic
    });
  }

  showComponent() {
    document.body.prepend(this.componentElem);
  }

  hideComponent() {
    document.body.querySelector('.header')?.remove();
  }

  resetContentComponents() {
    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.innerHTML = '';
  }
}
