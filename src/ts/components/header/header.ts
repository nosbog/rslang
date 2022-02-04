export default class Header {
  innerHtmlTemplate = `
  <nav class="nav">
    <ul>
      <li id="mainBtn">RSlang</li>
      <li id="bookBtn">Учебник</li>
      <li id="gamesBtn">Мини-игры</li>
      <li id="statisticBtn">Статистика</li>
    </ul>
  </nav>
  `;

  componentElem: HTMLElement;

  constructor() {
    this.componentElem = document.createElement('header');
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('header');
  }

  setThisListeners({
    showMain,
    showBook,
    showGames,
    showStatistic
  }: {
    showMain: () => void;
    showBook: () => void;
    showGames: () => void;
    showStatistic: () => void;
  }) {
    this.componentElem.querySelector('#mainBtn')?.addEventListener('click', () => {
      this.resetContentComponents();
      showMain();
    });

    this.componentElem.querySelector('#bookBtn')?.addEventListener('click', () => {
      this.resetContentComponents();
      showBook();
    });

    this.componentElem.querySelector('#gamesBtn')?.addEventListener('click', () => {
      this.resetContentComponents();
      showGames();
    });

    this.componentElem.querySelector('#statisticBtn')?.addEventListener('click', () => {
      this.resetContentComponents();
      showStatistic();
    });
  }

  createComponent() {
    this.createThisComponent();
  }

  setListeners({
    showMain,
    showBook,
    showGames,
    showStatistic
  }: {
    showMain: () => void;
    showBook: () => void;
    showGames: () => void;
    showStatistic: () => void;
  }) {
    this.setThisListeners({
      showMain,
      showBook,
      showGames,
      showStatistic
    });
  }

  showComponent() {
    document.body.prepend(this.componentElem);
  }

  hideComponent() {
    document.body.querySelector('.header')?.remove();
  }

  resetContentComponents() {
    document.body.querySelector('.main')?.remove();
    document.body.querySelector('.book')?.remove();
    document.body.querySelector('.games')?.remove();
    document.body.querySelector('.statistic')?.remove();
  }
}
