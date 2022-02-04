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

  constructor() {
    this.serverAPI = new ServerAPI();
    this.header = new Header();
    this.footer = new Footer();
    this.main = new Main();
    this.statistic = new Statistic();
    this.book = new Book();
    this.games = new Games();

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
      showMain: this.main.showComponent,
      showBook: this.book.showComponent,
      showGames: this.games.showComponent,
      showStatistic: this.statistic.showComponent
    });
  }

  showInitial() {
    this.header.showComponent();
    this.main.showComponent();
    this.footer.showComponent();
  }
}
