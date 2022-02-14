import ServerAPI from '../../serverAPI';
import LocalStorageAPI from '../../localStorageAPI';
import Sprint from './sprint/sprint';
import AudioCall from './audioCall/audioCall';
import GameResult from './gameResult/gameResult';

export default class Games {
  innerHtmlTemplate = `
  <h1>Games</h1>
  <label>
    <input type="radio" name="gameName" value="sprint" checked>
    Спринт
  </label>
  <label>
    <input type="radio" name="gameName" value="audioCall">
    Аудиовызов
  </label>
  <select class="games__select" name="gameLevel">
    <option value="0">Level 1</option>
    <option value="1">Level 2</option>
    <option value="2">Level 3</option>
    <option value="3">Level 4</option>
    <option value="4">Level 5</option>
    <option value="5">Level 6</option>
  </select>
  <button class="games__start">Начать</button>
  `;

  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  componentElem: HTMLElement;

  gameResult: GameResult;

  sprint: Sprint;

  audioCall: AudioCall;

  contentURL: string;

  constructor(serverAPI: ServerAPI, localStorageAPI: LocalStorageAPI, contentURL: string) {
    this.componentElem = document.createElement('div');
    this.serverAPI = serverAPI;
    this.localStorageAPI = localStorageAPI;
    this.contentURL = contentURL;

    this.gameResult = new GameResult(this.serverAPI, this.localStorageAPI, this.contentURL);
    this.sprint = new Sprint(this.serverAPI, this.contentURL, this.gameResult);
    this.audioCall = new AudioCall(this.serverAPI, this.contentURL, this.gameResult);
  }

  createThisComponent() {
    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('games');
  }

  createComponent() {
    this.createThisComponent();
    this.gameResult.createComponent();
    this.sprint.createComponent();
    this.audioCall.createComponent();
  }

  setThisListeners() {
    this.listenerForStartBtn();
  }

  setListeners() {
    this.setThisListeners();
    this.gameResult.setListeners();
  }

  showComponent = () => {
    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.append(this.componentElem);
  };

  hideComponent = () => {
    document.querySelector('.games')?.remove();
  };

  getGameInfo() {
    const gameNameInput = this.componentElem.querySelector(
      'input[name="gameName"]:checked'
    ) as HTMLInputElement;
    const gameLevelSelect = this.componentElem.querySelector(
      'select[name="gameLevel"]'
    ) as HTMLSelectElement;

    const gameName = gameNameInput.value;
    const gameLevel = +gameLevelSelect.value;
    return [gameName, gameLevel];
  }

  listenerForStartBtn() {
    const startBtn = this.componentElem.querySelector('.games__start') as HTMLButtonElement;
    startBtn.addEventListener('click', () => {
      const [gameName, gameLevel] = this.getGameInfo();

      if (gameName === 'sprint') {
        this.sprint.startGame(+gameLevel);
      } else if (gameName === 'audioCall') {
        this.audioCall.startGame(+gameLevel);
      }
    });
  }
}
