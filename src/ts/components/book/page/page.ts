import ServerAPI from '../../../serverAPI';
import LocalStorageAPI from '../../../localStorageAPI';
import { WordContent, UserWordContent } from '../../../interfaces/interfaceServerAPI';
import PageItem from './pageItem/pageItem';

export default class Page {
  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  contentURL: string;

  parentComponentElem: HTMLElement;

  pageItem: PageItem;

  componentElem: HTMLElement;

  private status: Set<string>;

  constructor(
    serverAPI: ServerAPI,
    localStorageAPI: LocalStorageAPI,
    contentURL: string,
    parentComponentElem: HTMLElement
  ) {
    this.componentElem = document.createElement('div');

    this.serverAPI = serverAPI;
    this.localStorageAPI = localStorageAPI;
    this.contentURL = contentURL;
    this.parentComponentElem = parentComponentElem;
    this.pageItem = new PageItem(this.serverAPI, this.localStorageAPI, this.contentURL);
  
    this.status = new Set<string>();
  }

  createThisComponent() {
    this.componentElem.classList.add('page');
  }

  createComponent() {
    this.createThisComponent();
  }

  showComponent() {
    const parentWrapper = this.parentComponentElem.querySelector('.wrapper-book') as HTMLElement;
    parentWrapper.append(this.componentElem);
  }

  async fillPage_HardWords_or_LearnedWords(difficulty: 'hard' | 'learned') {
    this.componentElem.innerHTML = '';

    if (this.localStorageAPI.accountStorage.isLoggedIn === false) {
      this.componentElem.textContent = `Раздел доступен только авторизованным пользователям.`;
      return;
    }

    const userWordsContent = await this.serverAPI.getUserWords({
      token: this.localStorageAPI.accountStorage.token,
      id: this.localStorageAPI.accountStorage.id
    });
    const userFilteredWordsContent = userWordsContent.filter(
      (userWordContent) => userWordContent.difficulty === difficulty
    );

    userFilteredWordsContent.forEach(async (userFilteredWordContent) => {
      const pageItemElem = this.pageItem.getNewPageItem(difficulty);

      const wordContent = await this.serverAPI.getWordByWordId({
        wordId: userFilteredWordContent.wordId
      });

      this.pageItem.fillPageItem(pageItemElem, wordContent, difficulty);
      this.pageItem.listeners_ForPageItem_ForLoggedInUser_ForHardWords_and_ForLearnedWords(
        pageItemElem,
        wordContent
      );

      this.componentElem.append(pageItemElem);
    });
  }

  async fillPage_GroupWords({ groupValue, pageValue }: { groupValue: string; pageValue: string }) {
    this.componentElem.innerHTML = '';
    this.status.clear();

    let wordsContent: WordContent[];
    let userWordsContent: UserWordContent[];
    const wordsContentPromise = this.serverAPI.getWords({ group: +groupValue, page: +pageValue });

    if (this.localStorageAPI.accountStorage.isLoggedIn === true) {
      const userWordsContentPromise = this.serverAPI.getUserWords({
        token: this.localStorageAPI.accountStorage.token,
        id: this.localStorageAPI.accountStorage.id
      });

      [wordsContent, userWordsContent] = await Promise.all([
        wordsContentPromise,
        userWordsContentPromise
      ]);
    } else {
      [wordsContent] = await Promise.all([wordsContentPromise]);
    }

    wordsContent.forEach((wordContent) => {
      const pageItemElem = this.pageItem.getNewPageItem('basic');

      this.pageItem.fillPageItem(pageItemElem, wordContent, groupValue);

      if (this.localStorageAPI.accountStorage.isLoggedIn === true) {
        this.status.add(
          this.pageItem.styles_ForPageItem_ForLoggedInUser_ForGroupWord(
            pageItemElem,
            wordContent,
            userWordsContent
          ) as string);
        this.pageItem.listeners_ForPageItem_ForLoggedInUser_ForGroupWords(
          pageItemElem,
          wordContent
        );
      }

      this.componentElem.append(pageItemElem);
    });

    this.applyStylesToLearnedPage(this.status);
  }

  updateTheme(gruop: string) {
    document.querySelector('.book')?.setAttribute('data-page-group', gruop);
  }

  applyStylesToLearnedPage(status: Set<string>) {
    document.querySelector('.book')?.setAttribute('data-isLearnedPage', 'false');
    if (!status.has('basic') && status.has('learned')) {
      document.querySelector('.book')?.setAttribute('data-isLearnedPage', 'true');
    }
  }
}
