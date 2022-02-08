export default class Statistic {
  innerHtmlTemplate = `
  <h1>Statistic</h1>
  `;

  componentElem: HTMLElement;

  constructor() {
    this.componentElem = document.createElement('div');
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('statistic');
  }

  createComponent() {
    this.createThisComponent();
  }

  showComponent = () => {
    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.append(this.componentElem);
  };

  hideComponent = () => {
    document.querySelector('.statistic')?.remove();
  };
}
