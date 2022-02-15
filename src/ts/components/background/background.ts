export default class Background {

  innerHtmlTemplate = `
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  `;

  componentElem: HTMLElement;

  constructor() {
    this.componentElem = document.createElement('div');
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('bg-anim');
  }

  createComponent() {
    this.createThisComponent();
  }

  showComponent = () => {
    document.body.prepend(this.componentElem);
    this.disableBg();
  }

  enableBg() {
    document.querySelector('.bg-anim')?.classList.remove('bg_hide');
  }

  disableBg() {
    document.querySelector('.bg-anim')?.classList.add('bg_hide');
  }

  setTheme(theme: string) {
    const bgElement = document.querySelector('.bg-anim') as HTMLElement;
    bgElement.setAttribute('class', 'bg-anim');
    bgElement?.classList.add(`bg_${theme}`);
  }
}