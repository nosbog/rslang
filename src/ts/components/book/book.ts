export default class Book {
  innerHtmlTemplate = `
  <h1>Book</h1>
  `;

  componentElem: HTMLElement;

  constructor() {
    this.componentElem = document.createElement('div');
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('book');
  }

  createComponent() {
    this.createThisComponent();
  }

  showComponent = () => {
    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.append(this.componentElem);
  };

  hideComponent = () => {
    document.querySelector('.book')?.remove();
  };
}
