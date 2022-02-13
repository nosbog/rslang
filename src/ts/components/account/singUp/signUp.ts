import ServerAPI from '../../../serverAPI';

export default class SignUp {
  innerHtmlTemplate = `
    <h2>Еще нет аккаунта</h2>
    <div class="account__error-box"></div>
    <form>
      <input class="account__input account__input_name" type="text" placeholder="имя" required>
      <input class="account__input account__input_email" type="email" placeholder="email" autocomplete="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{1,}$" required>
      <input class="account__input account__input_password" type="password" placeholder="пароль" minlength="8" autocomplete="new-password" required>
      <button type="button" class="signUp__btn_signUp">Зарегистрироваться</button>
    </form>
  `;

  serverAPI: ServerAPI;

  componentElem: HTMLElement;

  parentComponentElem: HTMLElement;

  constructor(serverAPI: ServerAPI, parentComponentElem: HTMLElement) {
    this.componentElem = document.createElement('div');

    this.serverAPI = serverAPI;
    this.parentComponentElem = parentComponentElem;
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('signUp');
  }

  createComponent() {
    this.createThisComponent();
  }

  setThisListeners(updateHeader: (isLoggedIn: boolean, name: string) => void) {
    const signUpBtn = this.componentElem.querySelector('.signUp__btn_signUp') as HTMLButtonElement;
    signUpBtn.addEventListener('click', () => {
      const inputValues = this.getInputValues();
      if (inputValues === null) {
        return;
      }

      const { name, email, password } = inputValues;
      this.serverAPI.createUser({
        name,
        email,
        password
      });

      // TODO: implement login after signup
      // updateHeader(true, name);
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
    const nameInput = this.componentElem.querySelector('.account__input_name') as HTMLInputElement;
    const emailInput = this.componentElem.querySelector(
      '.account__input_email'
    ) as HTMLInputElement;
    const passwordInput = this.componentElem.querySelector(
      '.account__input_password'
    ) as HTMLInputElement;

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const isValuesValid = this.validationInputValues({ name, email, password });
    if (!isValuesValid) {
      return null;
    }

    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';

    return { name, email, password };
  }

  validationInputValues({
    name,
    email,
    password
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    let nameValidation = true;
    let emailValidation = true;
    let passwordValidation = true;

    if (name.length === 0) {
      nameValidation = false;
    }

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

    if (!nameValidation) {
      this.showValidationError('Имя должно содежать не менее 1 символа');
    } else if (!emailValidation) {
      this.showValidationError('Email должен иметь вид: example@mail.com');
    } else if (!passwordValidation) {
      this.showValidationError('Пароль должен содежать не менее 8 символов');
    }

    return [nameValidation, emailValidation, passwordValidation].every(
      (isValid) => isValid === true
    );
  }

  showValidationError(errorText: string) {
    const errorBox = this.componentElem.querySelector('.account__error-box') as HTMLElement;
    errorBox.textContent = errorText;
  }
}
