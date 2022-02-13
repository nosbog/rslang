import ServerAPI from '../../../serverAPI';
import LocalStorageAPI from '../../../localStorageAPI';

export default class LogIn {
  innerHtmlTemplate = `
    <h2>Уже есть аккаунт</h2>
    <div class="account__error-box"></div>
    <form>
      <input class="account__input account__input_email" type="email" placeholder="email" autocomplete="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,}$" required>
      <input class="account__input account__input_password" type="password" placeholder="password" minlength="8" autocomplete="current-password" required>
      <button type="button" class="logIn__btn_logIn">Войти</button>
    </form>
  `;

  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  componentElem: HTMLElement;

  parentComponentElem: HTMLElement;

  constructor(
    serverAPI: ServerAPI,
    localStorageAPI: LocalStorageAPI,
    parentComponentElem: HTMLElement
  ) {
    this.componentElem = document.createElement('div');

    this.serverAPI = serverAPI;
    this.localStorageAPI = localStorageAPI;
    this.parentComponentElem = parentComponentElem;
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('logIn');
  }

  createComponent() {
    this.createThisComponent();
  }

  setThisListeners(updateHeader: (isLoggedIn: boolean, name: string) => void) {
    const logInBtn = this.componentElem.querySelector('.logIn__btn_logIn') as HTMLButtonElement;
    logInBtn.addEventListener('click', async () => {
      const inputValues = this.getInputValues();
      if (inputValues === null) {
        return;
      }

      const { email, password } = inputValues;
      const authorizationContent = await this.serverAPI.signIn({ email, password }).catch(() => {
        return null;
      });

      if (authorizationContent === null) {
        // обработка неверных данных
        this.showValidationError('Your email or password is invalid. Please try again');
      } else {
        await this.localStorageAPI.fillAccountStorage(authorizationContent, password);
        document.querySelector('#account')?.dispatchEvent(new Event('click'));

        const isLoggedIn = this.localStorageAPI.accountStorage.isLoggedIn;
        const name = this.localStorageAPI.accountStorage.name;
        updateHeader(isLoggedIn, name);
      }
    });

    const formInputs = this.componentElem.querySelectorAll<HTMLInputElement>('.account__input');
    formInputs.forEach((input) => {
      input.addEventListener('input', () => {
        if (!input.validity.valid) {
          input.classList.add('invalid');
        } else {
          input.classList.remove('invalid');
        }
      });
    });
  }

  setListeners(updateHeader: (isLoggedIn: boolean, name: string) => void) {
    this.setThisListeners(updateHeader);
  }

  showComponent = () => {
    const accountContent = this.parentComponentElem.querySelector(
      '.account__content'
    ) as HTMLDivElement;
    accountContent.append(this.componentElem);
  };

  getInputValues() {
    const emailInput = this.componentElem.querySelector(
      '.account__input_email'
    ) as HTMLInputElement;
    const passwordInput = this.componentElem.querySelector(
      '.account__input_password'
    ) as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    const isValuesValid = this.validateInputValues({ email, password });
    if (!isValuesValid) {
      return null;
    }

    emailInput.value = '';
    passwordInput.value = '';

    return { email, password };
  }

  validateInputValues({ email, password }: { email: string; password: string }) {
    let emailValidation = true;
    let passwordValidation = true;

    if (password.length <= 7) {
      passwordValidation = false;
    }

    const hasAtSymbol = email.includes('@');
    if (!hasAtSymbol) {
      emailValidation = false;
    } else {
      const emailParts = email.split('@');
      const hasDot = emailParts[1].includes('.');

      if (emailParts[0].length === 0) {
        emailValidation = false;
      } else if (!hasDot) {
        emailValidation = false;
      } else if (emailParts[1].split('.')[0].length === 0) {
        emailValidation = false;
      } else if (emailParts[1].split('.')[1].length === 0) {
        emailValidation = false;
      }
    }

    if (!emailValidation) {
      this.showValidationError('Please enter a valid email');
    } else if (!passwordValidation) {
      this.showValidationError('Please enter a valid password');
    }

    return [emailValidation, passwordValidation].every((isValid) => isValid === true);
  }

  showValidationError(errorText: string) {
    const errorBox = this.componentElem.querySelector('.account__error-box') as HTMLElement;
    errorBox.textContent = errorText;
  }
}
