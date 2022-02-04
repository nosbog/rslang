export default class Games {
  innerHtmlTemplate = `
  <h1>Games</h1>
  `;

  componentElem: HTMLElement;

  constructor() {
    this.componentElem = document.createElement('div');
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('games');
  }

  createComponent() {
    this.createThisComponent();
  }

  showComponent = () => {
    document.body.querySelector('.header')?.after(this.componentElem);
  };

  hideComponent = () => {
    document.querySelector('.games')?.remove();
  };
}
