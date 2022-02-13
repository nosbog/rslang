import SignUp from './singUp/signUp';
import LogIn from './logIn/logIn';
import ServerAPI from '../../serverAPI';
import LocalStorageAPI from '../../localStorageAPI';

export default class Account {
  innerHtmlTemplate = `
    <div class="wrapper wrapper_padding">
      <div class="account__NotLoggedIn-container">
        <button class="account__btn account__btn_logIn account__btn_active">Войти</button>
        <button class="account__btn account__btn_signUp">Регистрация</button>
        <div class="account__content"></div>
      </div>
      <div class="account__loggedIn-container">
        <div class="account__data">
          <h2>Мои данные</h2>
          <p class="account__data__name">Ник: <span></span></p>
          <p class="account__data__email">Почта: <span></span></p>
        </div>
        <button class="account__btn account__btn_logOut">Выйти из аккаунта</button>
      </div>
      <img src="./assets/svg/account.svg" alt="Get Started" class="account__image" width="60%">
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
      '.account__data__name span'
    ) as HTMLParagraphElement;
    const dataEmailElem = this.componentElem.querySelector(
      '.account__data__email span'
    ) as HTMLParagraphElement;

    dataNameElem.textContent = this.localStorageAPI.accountStorage.name;
    dataEmailElem.textContent = this.localStorageAPI.accountStorage.email;
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

  setThisListeners(updateHeader: (isLoggedIn: boolean, name: string) => void) {
    const singUpBtn = this.componentElem.querySelector('.account__btn_signUp') as HTMLButtonElement;
    const logInBtn = this.componentElem.querySelector('.account__btn_logIn') as HTMLButtonElement;

    singUpBtn.addEventListener('click', () => {
      const accountContent = this.componentElem.querySelector(
        '.account__content'
      ) as HTMLDivElement;
      accountContent.innerHTML = ``;

      this.toggleTabs(singUpBtn);
      this.signUp.showComponent();
    });
    logInBtn.addEventListener('click', () => {
      const accountContent = this.componentElem.querySelector(
        '.account__content'
      ) as HTMLDivElement;
      accountContent.innerHTML = ``;

      this.toggleTabs(logInBtn);
      this.logIn.showComponent();
    });

    const logOutBtn = this.componentElem.querySelector('.account__btn_logOut') as HTMLButtonElement;
    logOutBtn.addEventListener('click', () => {
      this.localStorageAPI.fillDefaultAccountStorage();
      document.body.querySelector('#account')?.dispatchEvent(new Event('click'));

      const isLoggedIn = this.localStorageAPI.accountStorage.isLoggedIn;
      const name = this.localStorageAPI.accountStorage.name;
      updateHeader(isLoggedIn, name);
    });
  }

  setListeners(updateHeader: (isLoggedIn: boolean, name: string) => void) {
    this.logIn.setListeners(updateHeader);
    this.signUp.setListeners(updateHeader);

    this.setThisListeners(updateHeader);
  }

  showComponent = (updateHeader: (isLoggedIn: boolean, name: string) => void) => {
    // 2 versions of the component depending on the user 'loggedIn' or 'loggedOut' status
    this.createComponent();
    this.setListeners(updateHeader);

    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.append(this.componentElem);
  };

  hideComponent = () => {
    document.querySelector('.book')?.remove();
  };

  toggleTabs(btn: HTMLButtonElement) {
    this.componentElem.querySelector('.account__btn_active')?.classList.remove('account__btn_active');
    btn.classList.add('account__btn_active');
  }
}
