import LocalStorageAPI from '../../localStorageAPI';

export default class Header {
  innerHtmlTemplate = `
    <div class="hamburger">
      <svg class="hamburger_open" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
      <svg class="hamburger_close" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
      </svg>
    </div>
    <nav class="nav">
      <ul>
        <li class="nav__item" id="mainBtn">Главная</li>
        <li class="nav__item" id="bookBtn">Учебник</li>
        <li class="nav__item" id="gamesBtn">Мини-игры</li>
        <li class="nav__item" id="statisticBtn">Статистика</li>
      </ul>
    </nav>
    <div class="nav__item nav__item-account nav__item_loggedIn" id="account">
      <span class="notLoggedIn-account">Аккаунт</span>
      <span class="loggedIn-account show">
        <i class="fas fa-user-circle"></i>
        &nbsp;
        <span></span>
      </span>
    </div>
  `;

  localStorageAPI: LocalStorageAPI;

  componentElem: HTMLElement;

  constructor(localStorageAPI: LocalStorageAPI) {
    this.componentElem = document.createElement('header');

    this.localStorageAPI = localStorageAPI;
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

    this.componentElem.querySelector('.hamburger')?.addEventListener('click', () => {
      this.toggleNavigation();
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
    
    const { accountStorage } = this.localStorageAPI;
    this.updateHdrAccountItem(accountStorage.isLoggedIn, accountStorage.name);
  }

  hideComponent() {
    document.body.querySelector('.header')?.remove();
  }

  resetContentComponents() {
    if (this.checkHamburgerOpen()) {
      this.toggleNavigation();
    }
    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.innerHTML = '';
  }

  checkHamburgerOpen() {
    return this.componentElem.classList.contains('nav_active');
  }

  toggleNavigation() {
    document.body.classList.toggle('body_fixed');
    this.componentElem.classList.toggle('nav_active');
  }

  updateHdrAccountItem(isLoggedIn: boolean, name: string) {
    const accountItem = document.querySelector('#account'); 
    accountItem?.querySelector('.show')?.classList.remove('show');

    if (isLoggedIn === true) {
      const loggedInItem = accountItem?.querySelector('.loggedIn-account') as HTMLElement;
      (loggedInItem.querySelector('span') as HTMLElement).textContent = name;
      loggedInItem?.classList.add('show');
    } else {
      accountItem?.querySelector('.notLoggedIn-account')?.classList.add('show')
    }
  }
}
