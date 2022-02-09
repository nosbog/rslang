import SignUp from './singUp/signUp';
import LogIn from './logIn/logIn';
import ServerAPI from '../../serverAPI';
import LocalStorageAPI from '../../localStorageAPI';

export default class Account {
  innerHtmlTemplate = `
    <div class="account__NotLoggedIn-container">
      <button class="account__btn account__btn_logIn">Вкладка "Войти"</button>
      <button class="account__btn account__btn_signUp">Вкладка "Регистрация"</button>
      <div class="account__content"></div>
    </div>
    <div class="account__loggedIn-container">
      <div class="account__data">
        <p>Ваш аккаунт:</p>
        <p class="account__data__name"></p>
        <p class="account__data__email"></p>
      </div>
      <button class="account__btn account__btn_logOut">Выйти из аккаунта</button>
    </div>
  `;

  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  componentElem: HTMLElement;

  logIn: LogIn;

  signUp: SignUp;

  constructor(serverAPI: ServerAPI, localStorageAPI: LocalStorageAPI) {
    this.componentElem = document.createElement('div');

    this.serverAPI = serverAPI;
    this.localStorageAPI = localStorageAPI;

    this.logIn = new LogIn(this.serverAPI, this.localStorageAPI, this.componentElem);
    this.signUp = new SignUp(this.serverAPI, this.componentElem);
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('account');

    const { accountStorage } = this.localStorageAPI;
    if (accountStorage.isLoggedIn === false) {
      this.createThisComponentNotLoggedIn();
    } else if (accountStorage.isLoggedIn === true) {
      this.createThisComponentLoggedIn();
    }
  }

  createThisComponentLoggedIn() {
    const notLoggedInContainer = this.componentElem.querySelector(
      '.account__NotLoggedIn-container'
    ) as HTMLDivElement;
    notLoggedInContainer.style.display = 'none';

    const dataNameElem = this.componentElem.querySelector(
      '.account__data__name'
    ) as HTMLParagraphElement;
    const dataEmailElem = this.componentElem.querySelector(
      '.account__data__email'
    ) as HTMLParagraphElement;

    dataNameElem.textContent = this.localStorageAPI.accountStorage.name;
    dataEmailElem.textContent = this.localStorageAPI.accountStorage.email;

    const logOutBtn = this.componentElem.querySelector('.account__btn_logOut') as HTMLButtonElement;
    logOutBtn.addEventListener('click', () => {
      this.localStorageAPI.fillDefaultAccountStorage();
      document.body.querySelector('#account')?.dispatchEvent(new Event('click'));
    });
  }

  createThisComponentNotLoggedIn() {
    const loggedInContainer = this.componentElem.querySelector(
      '.account__loggedIn-container'
    ) as HTMLDivElement;
    loggedInContainer.style.display = 'none';

    this.logIn.showComponent();
  }

  createComponent() {
    this.logIn.createComponent();
    this.signUp.createComponent();

    this.createThisComponent();
  }

  setThisListeners() {
    const singUpBtn = this.componentElem.querySelector('.account__btn_signUp') as HTMLButtonElement;
    const logInBtn = this.componentElem.querySelector('.account__btn_logIn') as HTMLButtonElement;

    singUpBtn.addEventListener('click', () => {
      const accountContent = this.componentElem.querySelector(
        '.account__content'
      ) as HTMLDivElement;
      accountContent.innerHTML = ``;

      this.signUp.showComponent();
    });
    logInBtn.addEventListener('click', () => {
      const accountContent = this.componentElem.querySelector(
        '.account__content'
      ) as HTMLDivElement;
      accountContent.innerHTML = ``;

      this.logIn.showComponent();
    });
  }

  setListeners() {
    this.logIn.setListeners();
    this.signUp.setListeners();

    this.setThisListeners();
  }

  showComponent = () => {
    // 2 versions of the component depending on the user 'loggedIn' or 'loggedOut' status
    this.createComponent();
    this.setListeners();

    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.append(this.componentElem);
  };

  hideComponent = () => {
    document.querySelector('.book')?.remove();
  };
}
