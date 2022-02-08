export default class Main {
  innerHtmlTemplate = `
  <h1>Main Page</h1>
  `;

  componentElem: HTMLElement;

  constructor() {
    this.componentElem = document.createElement('div');
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('main');
  }

  createComponent() {
    this.createThisComponent();
  }

  showComponent = () => {
    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.append(this.componentElem);
  };

  hideComponent = () => {
    document.querySelector('.main')?.remove();
  };
}
