import { main as layout } from './layout';

export default class Main {
  innerHtmlTemplate = `
    ${layout}
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
