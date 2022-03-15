import ServerAPI from '../../serverAPI';
import LocalStorageAPI from '../../localStorageAPI';
import Sprint from './sprint/sprint';
import AudioCall from './audioCall/audioCall';
import GameResult from './gameResult/gameResult';

export default class Games {
  innerHtmlTemplate = `
    <div class="wrapper wrapper_padding">
      <div class="games__input-container">
        <input type="radio" name="gameName" value="sprint" id="sprintRadio">
        <input type="radio" name="gameName" value="audioCall" id="audioCallRadio">
        <label for="sprintRadio">
          <img class="games__image games__image_simple" src="./assets/svg/sprint-game.svg" alt="Спринт">
          <img class="games__image games__image_color" src="./assets/svg/sprint-game-color.svg" alt="Спринт">
          <h3 class="games__name">Спринт</h3>
        </label>
        <div class="games__controls-container">
        <button class="games__start" disabled>Начать</button>
        <select class="games__select" name="gameLevel">
          <option value="0">Уровень 1</option>
          <option value="1">Уровень 2</option>
          <option value="2">Уровень 3</option>
          <option value="3">Уровень 4</option>
          <option value="4">Уровень 5</option>
          <option value="5">Уровень 6</option>
        </select>
      </div>
        <label for="audioCallRadio">
          <img class="games__image games__image_simple" src="./assets/svg/audioCall-game.svg" alt="Аудиовызов">
          <img class="games__image games__image_color" src="./assets/svg/audioCall-game-color.svg" alt="Аудиовызов">
          <h3 class="games__name">Аудиовызов</h3>
        </label>
      </div>
    </div>
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
    this.sprint = new Sprint(
      this.serverAPI,
      this.localStorageAPI,
      this.contentURL,
      this.gameResult
    );
    this.audioCall = new AudioCall(
      this.serverAPI,
      this.localStorageAPI,
      this.contentURL,
      this.gameResult
    );
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

  setThisListeners(setAnimatedBgTheme: (theme: string) => void) {
    this.listenerForGameRadioBtns(setAnimatedBgTheme);
    this.listenerForStartBtn();
  }

  setListeners(setAnimatedBgTheme: (theme: string) => void) {
    this.setThisListeners(setAnimatedBgTheme);
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

  listenerForGameRadioBtns(setAnimatedBgTheme: (theme: string) => void) {
    const gameRadioInputContainer = this.componentElem.querySelector(
      '.games__input-container'
    ) as HTMLButtonElement;
    gameRadioInputContainer.addEventListener('click', () => {
      const radioBtns = gameRadioInputContainer.querySelectorAll<HTMLInputElement>('input');
      const radioBtnsArr = Array.from(radioBtns);

      if (radioBtnsArr.some((el) => el.checked)) {
        const startBtn = this.componentElem.querySelector('.games__start') as HTMLButtonElement;
        startBtn.removeAttribute('disabled');

        const gameName = this.getGameInfo()[0];
        setAnimatedBgTheme(gameName as string);
      }
    });
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
