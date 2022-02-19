import { WordContent, UserWordContent } from '../../../../interfaces/interfaceServerAPI';
import LocalStorageAPI from '../../../../localStorageAPI';
import ServerAPI from '../../../../serverAPI';

export default class PageItem {
  innerHtmlTemplatePageItem = `
    <div class="pageItem__image"></div>
    <div class="pageItem__header">
      <span class="pageItem__status">
        <i class="far fa-check-circle learned"></i>
        <i class="fas fa-asterisk hard"></i>
      </span>
      <span class="pageItem__word"></span>
      -
      <span class="pageItem__word-transcription"></span>
      -
      <span class="pageItem__word-translate"></span>
      <img class="pageItem__sound-image" src="./assets/svg/volumeUp.svg" alt="volumeUp">
    </div>
    <div class="pageItem__explanation"></div>
    <div class="pageItem__explanation-translate"></div>
    <div class="pageItem__example"></div>
    <div class="pageItem__example-translate"></div>
    <div class="pageItem__controls"></div>
    <div class="pageItem__statistic-overlay">
      <div class="pageItem__statistic">
        <img class="pageItem__statistic__close-btn" src="./assets/svg/close.svg" alt="close">
        <p>Статистика по слову <span class="pageItem__statistic__word"></span></p>
        <table class="pageItem__statistic__table">
          <thead>
            <tr>
              <th>Мини-игра</th>
              <th>Правильно</th>
              <th>Неправильно</th>
            </tr>
          </thead>
          <tbody>
            <tr class="pageItem__statistic__table__tr-sprint">
              <td>Спринт</td>
              <td class="pageItem__statistic__table__trueCount"></td>
              <td class="pageItem__statistic__table__falseCount"></td>
            </tr>
            <tr class="pageItem__statistic__table__tr-audioCall">
              <td>Аудиовызов</td>
              <td class="pageItem__statistic__table__trueCount"></td>
              <td class="pageItem__statistic__table__falseCount"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  innerHtmlTemplateControls_GroupWords_LoggedInUser = `
    <img class="pageItem__icon pageItem__icon_learned-word" src="./assets/svg/verified.svg" alt="learned word" title="+ в изученные слова">
    <img class="pageItem__icon pageItem__icon_hard-word" src="./assets/svg/help.svg" alt="hard word" title="+ в сложные слова">
    <img class="pageItem__icon pageItem__icon_statistic" src="./assets/svg/fact_check.svg" alt="word statistic" title="статистика по слову">
  `;

  innerHtmlTemplateControls_HardWords_or_LearnedWords = `
    <img class="pageItem__icon pageItem__icon_remove" src="./assets/svg/off.svg" alt="remove word">
  `;

  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  contentURL: string;

  constructor(serverAPI: ServerAPI, localStorageAPI: LocalStorageAPI, contentURL: string) {
    this.serverAPI = serverAPI;
    this.localStorageAPI = localStorageAPI;
    this.contentURL = contentURL;
  }

  getNewPageItem(difficulty: 'basic' | 'hard' | 'learned') {
    const pageItemElem = document.createElement('div');
    pageItemElem.innerHTML = this.innerHtmlTemplatePageItem;
    pageItemElem.classList.add('pageItem');

    if (difficulty === 'hard') {
      pageItemElem.classList.add('pageItem_hard-word');
    } else if (difficulty === 'learned') {
      pageItemElem.classList.add('pageItem_learned-word');
    }

    return pageItemElem;
  }

  fillPageItem(pageItemElem: HTMLElement, wordContent: WordContent, groupValue: string) {
    const imageElem = pageItemElem.querySelector('.pageItem__image') as HTMLElement;

    const soundElem = pageItemElem.querySelector('.pageItem__sound-image') as HTMLElement;

    const wordElem = pageItemElem.querySelector('.pageItem__word') as HTMLElement;
    const wordTranscriptionElem = pageItemElem.querySelector(
      '.pageItem__word-transcription'
    ) as HTMLElement;
    const wordTranslateElem = pageItemElem.querySelector(
      '.pageItem__word-translate'
    ) as HTMLElement;

    const explanationElem = pageItemElem.querySelector('.pageItem__explanation') as HTMLElement;
    const explanationTranslateElem = pageItemElem.querySelector(
      '.pageItem__explanation-translate'
    ) as HTMLElement;

    const exampleElem = pageItemElem.querySelector('.pageItem__example') as HTMLElement;
    const exampleTranslateElem = pageItemElem.querySelector(
      '.pageItem__example-translate'
    ) as HTMLElement;

    const controlsElem = pageItemElem.querySelector('.pageItem__controls') as HTMLElement;

    imageElem.style.backgroundImage = `url("${this.contentURL}${wordContent.image}")`;

    soundElem.addEventListener('click', () => {
      const audio1 = new Audio(`${this.contentURL}${wordContent.audio}`);
      const audio2 = new Audio(`${this.contentURL}${wordContent.audioMeaning}`);
      const audio3 = new Audio(`${this.contentURL}${wordContent.audioExample}`);

      soundElem.style.cursor = 'not-allowed';
      audio1.play();
      audio1.addEventListener('ended', () => audio2.play());
      audio2.addEventListener('ended', () => audio3.play());
      audio3.addEventListener('ended', function basicCursor() {
        soundElem.style.cursor = '';
      });
    });

    wordElem.textContent = wordContent.word;
    wordTranscriptionElem.textContent = wordContent.transcription;
    wordTranslateElem.textContent = wordContent.wordTranslate;

    explanationElem.innerHTML = wordContent.textMeaning;
    explanationTranslateElem.textContent = wordContent.textMeaningTranslate;

    exampleElem.innerHTML = wordContent.textExample;
    exampleTranslateElem.textContent = wordContent.textExampleTranslate;

    if (this.localStorageAPI.accountStorage.isLoggedIn === true) {
      if (groupValue === 'hard' || groupValue === 'learned') {
        controlsElem.innerHTML = this.innerHtmlTemplateControls_HardWords_or_LearnedWords;
      } else if (typeof +groupValue === 'number') {
        controlsElem.innerHTML = this.innerHtmlTemplateControls_GroupWords_LoggedInUser;
      }
    }
  }

  styles_ForPageItem_ForLoggedInUser_ForGroupWord(
    pageItemElem: HTMLElement,
    wordContent: WordContent,
    userWordsContent: UserWordContent[]
  ) {
    const relatedUserWordContent = userWordsContent.find(
      (userWordContent) => userWordContent.wordId === wordContent.id
    );

    if (!relatedUserWordContent) return;

    const learnedWordIcon = pageItemElem.querySelector(
      '.pageItem__icon_learned-word'
    ) as HTMLElement;
    const hardWordIcon = pageItemElem.querySelector('.pageItem__icon_hard-word') as HTMLElement;

    if (relatedUserWordContent.difficulty === 'hard') {
      pageItemElem.classList.add('pageItem_hard-word');
      hardWordIcon.classList.add('pageItem__icon_used');
    } else if (relatedUserWordContent.difficulty === 'learned') {
      pageItemElem.classList.add('pageItem_learned-word');
      learnedWordIcon.classList.add('pageItem__icon_used');
    }
  }

  listeners_ForPageItem_ForLoggedInUser_ForGroupWords(
    pageItemElem: HTMLDivElement,
    wordContent: WordContent,
    applyStylesToLearnedPage: () => void
  ) {
    this.listenerForUserWordStatistic(pageItemElem, wordContent);

    const learnedWordIcon = pageItemElem.querySelector(
      '.pageItem__icon_learned-word'
    ) as HTMLElement;
    const hardWordIcon = pageItemElem.querySelector('.pageItem__icon_hard-word') as HTMLElement;

    this.listenerForChangeUserWordDifficulty(
      pageItemElem,
      wordContent,
      hardWordIcon,
      'hard',
      'pageItem_hard-word',
      applyStylesToLearnedPage
    );
    this.listenerForChangeUserWordDifficulty(
      pageItemElem,
      wordContent,
      learnedWordIcon,
      'learned',
      'pageItem_learned-word',
      applyStylesToLearnedPage
    );
  }

  listenerForUserWordStatistic(pageItemElem: HTMLElement, wordContent: WordContent) {
    const closeBtn = pageItemElem.querySelector('.pageItem__statistic__close-btn') as HTMLElement;
    const statisticElem = pageItemElem.querySelector(
      '.pageItem__statistic-overlay'
    ) as HTMLDivElement;
    const statisticIcon = pageItemElem.querySelector('.pageItem__icon_statistic') as HTMLElement;

    closeBtn.addEventListener('click', () => {
      statisticElem.style.display = 'none';
    });

    statisticIcon.addEventListener('click', async () => {
      statisticElem.style.display = 'block';

      const sprintTrElem = statisticElem.querySelector(
        '.pageItem__statistic__table__tr-sprint'
      ) as HTMLElement;
      const audioCallTrElem = statisticElem.querySelector(
        '.pageItem__statistic__table__tr-audioCall'
      ) as HTMLElement;

      const trueCountSprintElem = sprintTrElem.querySelector(
        '.pageItem__statistic__table__trueCount'
      ) as HTMLElement;
      const falseCountSprintElem = sprintTrElem.querySelector(
        '.pageItem__statistic__table__falseCount'
      ) as HTMLElement;

      const trueCountAudioCallElem = audioCallTrElem.querySelector(
        '.pageItem__statistic__table__trueCount'
      ) as HTMLElement;
      const falseCountAudioCallElem = audioCallTrElem.querySelector(
        '.pageItem__statistic__table__falseCount'
      ) as HTMLElement;

      const wordElem = statisticElem.querySelector('.pageItem__statistic__word') as HTMLElement;
      wordElem.textContent = wordContent.word;

      try {
        const userWord = await this.serverAPI.getUserWordByWordId({
          token: this.localStorageAPI.accountStorage.token,
          id: this.localStorageAPI.accountStorage.id,
          wordId: wordContent.id
        });

        // if no error => this userWord exists => show its data
        trueCountSprintElem.textContent = `${userWord.optional.sprint.trueCount}`;
        falseCountSprintElem.textContent = `${
          userWord.optional.sprint.totalCount - userWord.optional.sprint.trueCount
        }`;

        trueCountAudioCallElem.textContent = `${userWord.optional.audioCall.trueCount}`;
        falseCountAudioCallElem.textContent = `${
          userWord.optional.audioCall.totalCount - userWord.optional.audioCall.trueCount
        }`;
      } catch {
        // if error => this userWord doesn't exist => show default data
        trueCountSprintElem.textContent = '0';
        falseCountSprintElem.textContent = '0';

        trueCountAudioCallElem.textContent = '0';
        falseCountAudioCallElem.textContent = '0';
      }
    });
  }

  listenerForChangeUserWordDifficulty(
    pageItemElem: HTMLElement,
    wordContent: WordContent,
    iconElem: HTMLElement,
    status: string,
    styleClass: string,
    applyStylesToLearnedPage: () => void
  ) {
    const learnedWordIcon = pageItemElem.querySelector(
      '.pageItem__icon_learned-word'
    ) as HTMLElement;
    const hardWordIcon = pageItemElem.querySelector('.pageItem__icon_hard-word') as HTMLElement;

    iconElem.addEventListener('click', async () => {
      const isUsed = iconElem.className.includes('pageItem__icon_used');
      if (isUsed === true) {
        // isUsed === true => this userWord already exists (because btn is used => was clicked before => was created before)
        iconElem.classList.remove('pageItem__icon_used');

        pageItemElem.className = '';
        pageItemElem.classList.add('pageItem');

        if (status === 'learned') {
          const userWordContent = await this.serverAPI.getUserWordByWordId({
            token: this.localStorageAPI.accountStorage.token,
            id: this.localStorageAPI.accountStorage.id,
            wordId: wordContent.id
          });

          const updatedOptional = userWordContent.optional;
          updatedOptional.dateWhenItBecameLearned = false;

          this.serverAPI.updateUserWord({
            token: this.localStorageAPI.accountStorage.token,
            id: this.localStorageAPI.accountStorage.id,
            wordId: wordContent.id,
            difficulty: 'basic',
            optional: updatedOptional
          });
        } else {
          // click on used btn => update only userWord 'difficulty' = 'basic'
          this.serverAPI.updateUserWord({
            token: this.localStorageAPI.accountStorage.token,
            id: this.localStorageAPI.accountStorage.id,
            wordId: wordContent.id,
            difficulty: 'basic'
          });
        }
      } else if (isUsed === false) {
        // isUsed === false => this userWord doesn't exist !!!OR!!! it exists with 'difficulty' = 'basic'
        // (!!!OR!!! it exists with 'difficulty' opposite to the argument 'status' (example: if status: 'learned' => 'hard')
        // PS It can be 'basic', because of the double click on controls icons
        // Example: (click hardWordIcon => make it hardWord => click hardWordIcon again => make it 'basic')
        // Explanation: The need to change it to the 'basic' (and not to delete it), because of the saving the 'optional' field of the userWord
        learnedWordIcon.classList.remove('pageItem__icon_used');
        hardWordIcon.classList.remove('pageItem__icon_used');
        iconElem.classList.add('pageItem__icon_used');

        pageItemElem.className = '';
        pageItemElem.classList.add('pageItem');
        pageItemElem.classList.add(styleClass);

        // check if it exists =>
        try {
          const userWordContent = await this.serverAPI.getUserWordByWordId({
            token: this.localStorageAPI.accountStorage.token,
            id: this.localStorageAPI.accountStorage.id,
            wordId: wordContent.id
          });
          const updatedOptional = userWordContent.optional;

          // if no error => continue
          if (status === 'learned') {
            updatedOptional.dateWhenItBecameLearned = new Date().toLocaleDateString();

            this.serverAPI.updateUserWord({
              token: this.localStorageAPI.accountStorage.token,
              id: this.localStorageAPI.accountStorage.id,
              wordId: wordContent.id,
              difficulty: `${status}`,
              optional: updatedOptional
            });
          } else {
            updatedOptional.dateWhenItBecameLearned = false;

            this.serverAPI.updateUserWord({
              token: this.localStorageAPI.accountStorage.token,
              id: this.localStorageAPI.accountStorage.id,
              wordId: wordContent.id,
              difficulty: `${status}`,
              optional: updatedOptional
            });
          }
        } catch {
          // if error => this userWord doesn't exist => create new one width corresponding 'difficulty' and default 'optional'
          // 'dateWhenItBecameNew' = false , because this word did not occur in mini-games
          this.serverAPI.createUserWord({
            token: this.localStorageAPI.accountStorage.token,
            id: this.localStorageAPI.accountStorage.id,
            wordId: wordContent.id,
            difficulty: `${status}`,
            optional: {
              dateWhenItBecameLearned:
                status === 'learned' ? new Date().toLocaleDateString() : false,
              dateWhenItBecameNew: false,
              gameInWhichItBecameNew: false,
              sprint: {
                totalCount: 0,
                trueCount: 0
              },
              audioCall: {
                totalCount: 0,
                trueCount: 0
              }
            }
          });
        }
      }

      applyStylesToLearnedPage();
    });
  }

  listeners_ForPageItem_ForLoggedInUser_ForHardWords_and_ForLearnedWords(
    pageItemElem: HTMLElement,
    wordContent: WordContent
  ) {
    const removeIcon = pageItemElem.querySelector('.pageItem__icon_remove') as HTMLElement;

    removeIcon.addEventListener('click', () => {
      // change userWord 'difficulty' to the 'basic' (= default value)
      this.serverAPI.updateUserWord({
        token: this.localStorageAPI.accountStorage.token,
        id: this.localStorageAPI.accountStorage.id,
        wordId: wordContent.id,
        difficulty: 'basic'
      });

      pageItemElem.remove();
    });
  }
}
