import ServerAPI from '../../../serverAPI';

export default class SignUp {
  innerHtmlTemplate = `
    <h2>Еще нет аккаунта</h2>
    <input class="account__input account__input_name" type="text" placeholder="name">
    <input class="account__input account__input_email" type="text" placeholder="email">
    <input class="account__input account__input_password" type="text" placeholder="password">
    <button class="signUp__btn_signUp">Зарегистрироваться</button>
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

  setThisListeners() {
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
    });
  }

  setListeners() {
    this.setThisListeners();
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

    if (!nameValidation) alert('"Name" must contain at least one character');
    if (!emailValidation) alert('"Email" must match: example@example.example');
    if (!passwordValidation) alert('"Password" must contain at least 8 character');

    return [nameValidation, emailValidation, passwordValidation].every(
      (isValid) => isValid === true
    );
  }
}
