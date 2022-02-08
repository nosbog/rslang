import ServerAPI from './serverAPI';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Main from './components/main/main';
import Statistic from './components/statistic/statistic';
import Book from './components/book/book';
import Games from './components/games/games';

export default class Controller {
  serverAPI: ServerAPI;

  header: Header;

  footer: Footer;

  main: Main;

  statistic: Statistic;

  book: Book;

  games: Games;

  contentURL = 'https://raw.githubusercontent.com/rolling-scopes-school/react-rslang-be/main/';

  constructor() {
    this.serverAPI = new ServerAPI();

    this.header = new Header();
    this.footer = new Footer();
    this.main = new Main();
    this.statistic = new Statistic();
    this.book = new Book();
    this.games = new Games(this.serverAPI, this.contentURL);

    this.createComponents();
    this.setListeners();

    this.showInitial();
  }

  createComponents() {
    this.header.createComponent();
    this.main.createComponent();
    this.footer.createComponent();
    this.statistic.createComponent();
    this.book.createComponent();
    this.games.createComponent();
  }

  setListeners() {
    this.header.setListeners({
      showFooter: this.footer.showComponent,
      showMain: this.main.showComponent,
      showBook: this.book.showComponent,
      showGames: this.games.showComponent,
      showStatistic: this.statistic.showComponent
    });

    this.games.setListeners();
  }

  showInitial() {
    // contentElem is a wrapper for easy removal of components (such as book, games etc)
    // !? its better to create the 'main' html tag. Rename 'main' component !?
    const contentElem = document.createElement('div');
    contentElem.classList.add('content');
    document.body.append(contentElem);

    this.header.showComponent();
    this.main.showComponent();
    this.footer.showComponent();
  }
}
