import ServerAPI from '../../serverAPI';
import LocalStorageAPI from '../../localStorageAPI';
import { UserWordContent, StatisticsContent } from '../../interfaces/interfaceServerAPI';

export default class Statistic {
  innerHtmlTemplate = `
    <div class="statistic__short-term-container">
      <div class="statistic__short-term-container__by-all">
        <p>Статистика по всем словам:</p>
        <div class="statistic__newWords-amount"></div>
        <div class="statistic__learnedWords-amount"></div>
        <div class="statistic__percentage-of-correct-answers"></div>
      </div>


      <div class="statistic__short-term-container__by-games">
        <div class="statistic__sprint">
          <p>Статистика по игре Спринт:</p>
          <div class="statistic__newWords-amount"></div>
          <div class="statistic__percentage-of-correct-answers"></div>
          <div class="statistic__bestStreak"></div>
        </div>
        <div class="statistic__audioCall">
          <p>Статистика по игре Аудиовызов:</p>
          <div class="statistic__newWords-amount"></div>
          <div class="statistic__percentage-of-correct-answers"></div>
          <div class="statistic__bestStreak"></div>
        </div>
      </div>
    </div>
    <div class="statistic__long-term-container">
      
    </div>
  `;

  componentElem: HTMLElement;

  serverAPI: ServerAPI;

  localStorageAPI: LocalStorageAPI;

  constructor(serverAPI: ServerAPI, localStorageAPI: LocalStorageAPI) {
    this.componentElem = document.createElement('div');

    this.serverAPI = serverAPI;
    this.localStorageAPI = localStorageAPI;
  }

  async createThisComponent() {
    if (this.localStorageAPI.accountStorage.isLoggedIn === false) {
      this.componentElem.textContent =
        'Функционал "Статистика" доступен только для авторизированных пользователей';

      this.componentElem.classList.add('statistic');
      return;
    }

    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('statistic');

    this.createTodaysStatistics();
  }

  createComponent() {
    this.createThisComponent();
  }

  showComponent = () => {
    this.createComponent();

    const contentElem = document.querySelector('.content') as HTMLElement;
    contentElem.append(this.componentElem);
  };

  hideComponent = () => {
    document.querySelector('.statistic')?.remove();
  };

  async createTodaysStatistics() {
    function getElem(hostElem: HTMLElement, specific: string) {
      const statisticElem = hostElem.querySelector(`.statistic__${specific}`) as HTMLElement;
      return statisticElem;
    }
    const shortTermByAll = getElem(this.componentElem, 'short-term-container__by-all');

    const newWordsAmountElem = getElem(shortTermByAll, 'newWords-amount');
    const learnedWordsAmountElem = getElem(shortTermByAll, 'learnedWords-amount');
    const percentageOfCorrectElem = getElem(shortTermByAll, 'percentage-of-correct-answers');

    const shortTermByGames = getElem(this.componentElem, 'short-term-container__by-games');
    const shortTermSprintElem = getElem(shortTermByGames, 'sprint');
    const shortTermAudioCallElem = getElem(shortTermByGames, 'audioCall');

    const sprintNewWordsAmountElem = getElem(shortTermSprintElem, 'newWords-amount');
    const sprintPercentageOfCorrectElem = getElem(
      shortTermSprintElem,
      'percentage-of-correct-answers'
    );
    const sprintBestStreakElem = getElem(shortTermSprintElem, 'bestStreak');

    const audioCallNewWordsAmountElem = getElem(shortTermAudioCallElem, 'newWords-amount');
    const audioCallPercentageOfCorrectElem = getElem(
      shortTermAudioCallElem,
      'percentage-of-correct-answers'
    );
    const audioCallBestStreakElem = getElem(shortTermAudioCallElem, 'bestStreak');

    const userWords = await this.serverAPI.getUserWords({
      token: this.localStorageAPI.accountStorage.token,
      id: this.localStorageAPI.accountStorage.id
    });
    const userStatistics = await this.serverAPI
      .getStatistics({
        token: this.localStorageAPI.accountStorage.token,
        id: this.localStorageAPI.accountStorage.id
      })
      .catch(() => {
        // if error => no statistics on the sever => no games were finished => return default userStatistics

        const defaultUserStatistics: StatisticsContent = {
          optional: {}
        };
        return defaultUserStatistics;
      });

    const sprintNewWordsAmount = this.getTodays_NewWordsAmount_ByGame(userWords, 'sprint');
    const sprintPercentageOfCorrect = this.getTodays_PercentageOfCorrectAnswers_ByGame(
      userWords,
      'sprint'
    );
    const sprintBestStreak = this.getTodays_BestStreak_ByGame(userStatistics, 'sprint');

    const audioCallNewWordsAmount = this.getTodays_NewWordsAmount_ByGame(userWords, 'audioCall');
    const audioCallPercentageOfCorrect = this.getTodays_PercentageOfCorrectAnswers_ByGame(
      userWords,
      'audioCall'
    );
    const audioCallBestStreak = this.getTodays_BestStreak_ByGame(userStatistics, 'audioCall');

    const newWordsAmount = sprintNewWordsAmount + audioCallNewWordsAmount;
    const learnedWordsAmount = this.getTodays_LearnedWordsAmount(userWords);
    const percentageOfCorrect = +(
      (sprintPercentageOfCorrect + audioCallPercentageOfCorrect) /
      2
    ).toFixed(0);

    newWordsAmountElem.textContent = `Новых слов: ${newWordsAmount}`;
    learnedWordsAmountElem.textContent = `Выученных слов: ${learnedWordsAmount}`;
    percentageOfCorrectElem.textContent = `Процент правильных ответов: ${percentageOfCorrect}%`;

    sprintNewWordsAmountElem.textContent = `Новых слов: ${sprintNewWordsAmount}`;
    sprintPercentageOfCorrectElem.textContent = `Процент правильных ответов: ${sprintPercentageOfCorrect}%`;
    sprintBestStreakElem.textContent = `Самая длинная серия правильных ответов: ${sprintBestStreak}`;

    audioCallNewWordsAmountElem.textContent = `Новых слов: ${audioCallNewWordsAmount}`;
    audioCallPercentageOfCorrectElem.textContent = `Процент правильных ответов: ${audioCallPercentageOfCorrect}%`;
    audioCallBestStreakElem.textContent = `Самая длинная серия правильных ответов: ${audioCallBestStreak}`;
  }

  getTodays_NewWordsAmount_ByGame(userWords: UserWordContent[], gameName: 'sprint' | 'audioCall') {
    const todaysNewWords = userWords.filter(
      (userWord) =>
        userWord.optional.dateWhenItBecameNew === new Date().toLocaleDateString('en-US') &&
        userWord.optional.gameInWhichItBecameNew === gameName
    );

    return todaysNewWords.length;
  }

  getTodays_PercentageOfCorrectAnswers_ByGame(
    userWords: UserWordContent[],
    gameName: 'sprint' | 'audioCall'
  ) {
    if (userWords.length === 0) return 0;

    let totalCount = 0;
    userWords.forEach((userWord) => {
      totalCount += userWord.optional[gameName].totalCount;
    });
    let trueCount = 0;
    userWords.forEach((userWord) => {
      trueCount += userWord.optional[gameName].trueCount;
    });

    if (totalCount === 0) return 0;
    return +((trueCount / totalCount) * 100).toFixed(0);
  }

  getTodays_BestStreak_ByGame(userStatistics: StatisticsContent, gameName: 'sprint' | 'audioCall') {
    const todaysDate = new Date().toLocaleDateString('en-US');

    if (todaysDate in userStatistics.optional) {
      return userStatistics.optional[todaysDate][gameName].bestStreak;
    }
    return 0;
  }

  getTodays_LearnedWordsAmount(userWords: UserWordContent[]) {
    const todaysLearnedWords = userWords.filter(
      (userWord) =>
        userWord.optional.dateWhenItBecameLearned === new Date().toLocaleDateString('en-US')
    );

    return todaysLearnedWords.length;
  }
}
