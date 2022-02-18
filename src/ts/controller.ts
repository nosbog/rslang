import ServerAPI from './serverAPI';
import LocalStorageAPI from './localStorageAPI';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Main from './components/main/main';
import Statistic from './components/statistic/statistic';
import Book from './components/book/book';
import Games from './components/games/games';
import Account from './components/account/account';
import Background from './components/background/background';

export default class Controller {
  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  header: Header;

  footer: Footer;

  main: Main;

  statistic: Statistic;

  book: Book;

  games: Games;

  account: Account;

  animatedBg: Background;

  contentURL = 'https://raw.githubusercontent.com/rolling-scopes-school/react-rslang-be/main/';

  constructor() {
    this.serverAPI = new ServerAPI();

    this.localStorageAPI = new LocalStorageAPI(this.serverAPI);

    this.header = new Header(this.localStorageAPI);
    this.account = new Account(this.serverAPI, this.localStorageAPI);
    this.footer = new Footer();
    this.main = new Main();
    this.statistic = new Statistic();
    this.games = new Games(this.serverAPI, this.localStorageAPI, this.contentURL);
    this.animatedBg = new Background();
    this.book = new Book(
      this.serverAPI,
      this.localStorageAPI,
      this.contentURL,
      this.games,
      this.animatedBg
    );

    this.asyncConstructor();
  }

  async asyncConstructor() {
    await this.localStorageAPI.checkForCurrentUser();
    this.localStorageAPI.setIntervalForUpdatingToken();

    this.createComponents();
    this.setListeners();

    this.showInitial();
  }

  createComponents() {
    this.header.createComponent();
    this.account.createComponent();
    this.main.createComponent();
    this.footer.createComponent();
    this.statistic.createComponent();
    this.book.createComponent();
    this.games.createComponent();
    this.animatedBg.createComponent();
  }

  setListeners() {
    this.header.setListeners({
      showAccount: () => this.account.showComponent(this.header.updateHdrAccountItem),
      showFooter: this.footer.showComponent,
      showMain: this.main.showComponent,
      showBook: this.book.showComponent,
      showGames: this.games.showComponent,
      showStatistic: this.statistic.showComponent,
      disableAnimBg: this.animatedBg.disableBg,
      enableAnimBg: this.animatedBg.enableBg
    });

    this.account.setListeners(this.header.updateHdrAccountItem);
    this.games.setListeners(this.animatedBg.setTheme);
    this.book.setListeners();
  }

  showInitial() {
    const contentElem = document.createElement('main');
    contentElem.classList.add('content');
    document.body.append(contentElem);

    this.header.showComponent();
    this.main.showComponent();
    this.footer.showComponent();
    this.animatedBg.showComponent();
  }
}
