export default class KeyboardHotKeys {
  constructor() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const hotKeysGames = ['Digit1', 'Digit2', 'Enter'];
      const hotKeysGameResult = ['Enter'];
      const hotKeysSprint = ['ArrowLeft', 'ArrowRight'];
      const hotKeysAudioCall = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Enter'];

      if (
        !hotKeysGames.includes(event.code) &&
        !hotKeysGameResult.includes(event.code) &&
        !hotKeysSprint.includes(event.code) &&
        !hotKeysAudioCall.includes(event.code)
      ) {
        return;
      }

      const gamesElem = document.querySelector('.games') as HTMLElement;
      const gameResultElem = document.querySelector('.gameResult') as HTMLElement;
      const sprintElem = document.querySelector('.sprint') as HTMLElement;
      const audioCallElem = document.querySelector('.audioCall') as HTMLElement;

      if (gamesElem && hotKeysGames.includes(event.code)) {
        if (event.code.includes('Digit')) {
          const radioInputs = gamesElem.querySelectorAll(
            'input[name="gameName"]'
          ) as NodeListOf<HTMLInputElement>;

          const indexOfInput = +event.code.split('Digit')[1] - 1;

          radioInputs[indexOfInput].checked = true;
          radioInputs[indexOfInput].dispatchEvent(new Event('click', { bubbles: true }));
        } else if (event.code === 'Enter') {
          const startGame = gamesElem.querySelector('.games__start') as HTMLButtonElement;

          startGame.dispatchEvent(new Event('click'));
        }
      } else if (gameResultElem) {
        // if gamesResultElem exists => skip others
        if (hotKeysGameResult.includes(event.code)) {
          if (event.code === 'Enter') {
            const toGamesBtn = gameResultElem.querySelector(
              '.gameResult__btn_games'
            ) as HTMLButtonElement;

            toGamesBtn.dispatchEvent(new Event('click'));
          }
        }
      } else if (sprintElem && hotKeysSprint.includes(event.code)) {
        const noBtn = sprintElem.querySelector('.sprint__no') as HTMLButtonElement;
        const yesBtn = sprintElem.querySelector('.sprint__yes') as HTMLButtonElement;

        if (event.code === 'ArrowLeft') {
          noBtn.dispatchEvent(new Event('click'));
        } else if (event.code === 'ArrowRight') {
          yesBtn.dispatchEvent(new Event('click'));
        }
      } else if (audioCallElem && hotKeysAudioCall.includes(event.code)) {
        const options = audioCallElem.querySelectorAll(
          '.audioCall__option'
        ) as NodeListOf<HTMLButtonElement>;

        if (event.code === 'Enter') {
          const dontKnowBtn = audioCallElem.querySelector(
            '.audioCall__btn_skip'
          ) as HTMLButtonElement;
          const continueBtn = audioCallElem.querySelector(
            '.audioCall__btn_continue'
          ) as HTMLButtonElement;

          // this element changes every round => use it to set dataset => to prevent double click on 'continueBtn'
          const optionsContainer = audioCallElem.querySelector(
            '.audioCall__options'
          ) as HTMLDivElement;

          if (!dontKnowBtn.className.includes('audioCall__btn_hide')) {
            dontKnowBtn.dispatchEvent(new Event('click'));
            this.makeBtnsUsed(options);
          } else if (
            !continueBtn.className.includes('audioCall__btn_hide') &&
            optionsContainer.dataset.continueIsUsed !== 'true'
          ) {
            optionsContainer.dataset.continueIsUsed = 'true';
            continueBtn.dispatchEvent(new Event('click'));
          }
        } else if (event.code.includes('Digit') && !this.areBtnsUsed(options)) {
          const indexOfOption = +event.code.split('Digit')[1] - 1;

          options[indexOfOption].dispatchEvent(new Event('click'));
          this.makeBtnsUsed(options);
        }
      }
    });
  }

  makeBtnsUsed(btns: NodeListOf<HTMLButtonElement>) {
    btns.forEach((btn) => {
      btn.dataset.isUsed = 'true';
    });
  }

  areBtnsUsed(btns: NodeListOf<HTMLButtonElement>) {
    return Array.from(btns).some((btn) => btn.dataset.isUsed === 'true');
  }
}
