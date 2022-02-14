import ServerAPI from '../../serverAPI';
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
          <h3>Спринт</h3>
          <img class="games__image games__image_simple" src="./assets/svg/sprint-game.svg" alt="Спринт">
          <img class="games__image games__image_color" src="./assets/svg/sprint-game-color.svg" alt="Спринт">
        </label>
        <label for="audioCallRadio">
          <h3>Аудиовызов</h3>
          <img class="games__image games__image_simple" src="./assets/svg/audioCall-game.svg" alt="Аудиовызов">
          <img class="games__image games__image_color" src="./assets/svg/audioCall-game-color.svg" alt="Аудиовызов">
        </label>
      </div>
      <select class="games__select" name="gameLevel">
        <option value="0">Level 1</option>
        <option value="1">Level 2</option>
        <option value="2">Level 3</option>
        <option value="3">Level 4</option>
        <option value="4">Level 5</option>
        <option value="5">Level 6</option>
      </select>
      <button class="games__start" disabled>Начать</button>
    </div>
  `;

  serverAPI: ServerAPI;

  componentElem: HTMLElement;

  gameResult: GameResult;

  sprint: Sprint;

  audioCall: AudioCall;

  contentURL: string;

  constructor(serverAPI: ServerAPI, contentURL: string) {
    this.componentElem = document.createElement('div');
    this.serverAPI = serverAPI;
    this.contentURL = contentURL;

    this.gameResult = new GameResult(this.contentURL);
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
    this.listenerForGameRadioBtns();
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

  listenerForGameRadioBtns() {
    const gameRadioInputContainer = this.componentElem.querySelector('.games__input-container') as HTMLButtonElement;
    gameRadioInputContainer.addEventListener('click', () => {
      const radioBtns = gameRadioInputContainer.querySelectorAll<HTMLInputElement>('input');
      const radioBtnsArr = Array.from(radioBtns);
      if (radioBtnsArr.some((el) => el.checked)) {
        const startBtn = this.componentElem.querySelector('.games__start') as HTMLButtonElement;
        startBtn.removeAttribute('disabled');
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
