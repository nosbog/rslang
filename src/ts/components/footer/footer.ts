export default class Footer {
  innerHtmlTemplate = `
  <div>©2022</div>
  <ul>
    <li><a href="https://github.com/nosbog" target="_blank">nosbog</a></li>
    <li><a href="https://github.com/aytsaN" target="_blank">aytsaN</a></li>
  </ul>
  <a href="https://rs.school/js/" target="_blank">
    <img src="./assets/svg/rsSchool.svg" alt="rsSchool">
  </a>
  `;

  componentElem: HTMLElement;

  constructor() {
    this.componentElem = document.createElement('footer');
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('footer');
  }

  createComponent() {
    this.createThisComponent();
  }

  showComponent = () => {
    document.body.append(this.componentElem);
  };

  hideComponent = () => {
    document.body.querySelector('.footer')?.remove();
  };
}
