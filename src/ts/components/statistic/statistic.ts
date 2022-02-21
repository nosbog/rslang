const { Chart, ChartConfiguration, ChartItem, registerables } = require('chart.js');
import ServerAPI from '../../serverAPI';
import LocalStorageAPI from '../../localStorageAPI';
import { UserWordContent, StatisticsContent } from '../../interfaces/interfaceServerAPI';

export default class Statistic {
  innerHtmlTemplate = `
    
      <div class="statistic__short-term-container">
        <div class="wrapper wrapper_padding">
          <div class="statistic__short-term-container__by-all">
            <p>Статистика за сегодня</p>
            <div>
              <div class="statistic__newWords-amount"></div>
              <div class="statistic__learnedWords-amount"></div>
              <div class="statistic__percentage-of-correct-answers"></div>
            </div>
          </div>

          <div class="statistic__short-term-container__by-games">
          
            <div class="statistic__sprint">
              <p>Спринт</p>
              <div class="statistic__newWords-amount"></div>
              <div class="statistic__percentage-of-correct-answers"></div>
              <div class="statistic__bestStreak"></div>
            </div>
            <div class="statistic__audioCall">
              <p>Аудиовызов</p>
              <div class="statistic__newWords-amount"></div>
              <div class="statistic__percentage-of-correct-answers"></div>
              <div class="statistic__bestStreak"></div>
            </div>
          </div>
        </div>
        <svg class="svg-separator separator_light" viewBox="0 0 1440 500">
          <path fill="#f7faf6" opacity="undefined" d="m-0.00068,275.37639l179.65893,78.92337c91.71939,44.0971 212.22767,51.21559 333.811,43.00477c121.58333,-8.21082 218.87202,-50.67035 294.61379,-78.13824c75.74177,-27.46789 181.5308,-128.32411 309.11414,-117.90077c80.33705,1.15107 197.67409,52.30215 253.01114,97.45322l70.79167,53.23507l1,151.04619l-65.79167,-2c-59.79167,0 -179.375,0 -298.95833,0c-119.58333,0 -239.16666,0 -358.74999,0c-119.58333,0 -239.16666,0 -358.74999,0c-119.58333,0 -239.16666,0 -298.95833,0l-59.79167,0l-1.00069,-225.62361z" id="svg_1" stroke="null"/>
        </svg>
      </div>

      <div class="statistic__long-term-container">
        <div class="wrapper wrapper_padding">
          <p>Статистика за всё время</p>
          <div class="statistic__long-term-container__chart-container"></div>
        </div>
        <svg class="svg-separator" viewBox="0 0 1440 500">
          <path fill="#f7faf6" opacity="undefined" d="m-5.00068,433.37639l81.65893,-19.07663c74.71939,-22.9029 174.22767,-66.78441 295.811,-74.99523c121.58333,-8.21082 281.87202,33.32965 420.61379,73.86176c138.74177,40.53211 128.5308,43.67589 256.11414,54.09923c80.33705,1.15107 208.67409,-45.69785 262.01114,-60.54678l166.79167,-65.76493l-34,163.04619l-65.79167,-2c-59.79167,0 -179.375,0 -298.95833,0c-119.58333,0 -239.16666,0 -358.74999,0c-119.58333,0 -239.16666,0 -358.74999,0c-119.58333,0 -239.16666,0 -298.95833,0l-64.79167,0l-3.00069,-68.62361z" id="svg_1" stroke="null"/>
        </svg>
      </div>
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
      this.componentElem.innerHTML =
        '<div class="statistic__message">Статистика доступна только авторизированным пользователям</div>';

      this.componentElem.classList.add('statistic');
      return;
    }

    this.componentElem.innerHTML = this.innerHtmlTemplate;
    this.componentElem.classList.add('statistic');

    this.createTodaysStatistics();
    this.createLongTermStatistics();
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

    newWordsAmountElem.innerHTML = `Новых слов: <span>${newWordsAmount}</span>`;
    learnedWordsAmountElem.innerHTML = `Выученных слов: <span>${learnedWordsAmount}</span>`;
    percentageOfCorrectElem.innerHTML = `Правильных ответов: <span>${percentageOfCorrect}%</span>`;

    sprintNewWordsAmountElem.innerHTML = `Новых слов: <span> ${sprintNewWordsAmount}</span>`;
    sprintPercentageOfCorrectElem.innerHTML = `Правильных ответов: <span> ${sprintPercentageOfCorrect}%</span>`;
    sprintBestStreakElem.innerHTML = `Самая длинная серия правильных ответов: <span> ${sprintBestStreak}</span>`;

    audioCallNewWordsAmountElem.innerHTML = `Новых слов: <span> ${audioCallNewWordsAmount}</span>`;
    audioCallPercentageOfCorrectElem.innerHTML = `Правильных ответов: <span> ${audioCallPercentageOfCorrect}%</span>`;
    audioCallBestStreakElem.innerHTML = `Самая длинная серия правильных ответов: <span> ${audioCallBestStreak}</span>`;
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

  async createLongTermStatistics() {
    if (this.localStorageAPI.accountStorage.isLoggedIn === true) {
      Chart.register(...registerables);
      Chart.defaults.font.size = 14;
      Chart.defaults.font.family = '"Montserrat", "Helvetica", "Arial", sans-serif';

      const [userWordsContent] = await Promise.all([
        this.serverAPI.getUserWords({
          token: this.localStorageAPI.accountStorage.token,
          id: this.localStorageAPI.accountStorage.id
        })
      ]);

      this.showNewWordsStatisctics(userWordsContent, 'dateWhenItBecameNew');
      this.showLearningWordsStatisctics(userWordsContent, 'dateWhenItBecameLearned');
    }
  }

  getStatistics(userWordsContent: UserWordContent[], dateType: 'dateWhenItBecameLearned' | 'dateWhenItBecameNew') {
    const getUserDates = (userWordsContent: UserWordContent[], dateType: 'dateWhenItBecameLearned' | 'dateWhenItBecameNew') => {
      const dates: Array<string> = [];

      userWordsContent.forEach((userWord) => {
        const optional = userWord.optional;
        if (!!optional[dateType]) {
          dates.push(optional[dateType].toString()); 
        }
      });
      return dates;
    }

    const sortDates = (dateA: Date, dateB: Date) => dateA.getTime() - dateB.getTime();
    
    const datesOfWords = getUserDates(userWordsContent, dateType);

    // object = {date: number of words}
    const numberOfWordsPerDate = datesOfWords.reduce((
      result: { [key: string]: number }, 
      date) => {
        result[date] = (result[date] || 0) + 1;
        return result;
      }, {});

    const uniqueDatesArr = [];
    for (let key in numberOfWordsPerDate) {
      if (numberOfWordsPerDate.hasOwnProperty(key)) {
        uniqueDatesArr.push(key);
      }
    }

    uniqueDatesArr.sort((a, b) => sortDates(new Date(a), new Date(b)));

    const convertedDatesArr = uniqueDatesArr.map((date) => new Date(date).toLocaleDateString('en-GB').toString());

    const numberOfWordsArr = uniqueDatesArr.map((date) => numberOfWordsPerDate[date]);

    return { convertedDatesArr, numberOfWordsArr };
  }

  getChartCongig(labels: string[], data: number[], text: string) {
    const chartConfigData = {
      labels: labels,
      datasets: [{
        label: 'Кол-во слов',
        data: data,
        borderColor: '#e63946',
        backgroundColor: '#fff',
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 6
      }]
    };

    const config: typeof ChartConfiguration = {
      type: 'line',
      data: chartConfigData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: () => text,
          },
          legend: {
            labels: {
              font: {
                family: '"Montserrat", "Helvetica", "Arial", sans-serif',
                size: 18
              },
              title: {
                padding: 10
              }
            },
            display: false,
          },
        },
      }
    };

    return config;
  }

  renderChart(chartContainerId: string, config: typeof ChartConfiguration) {
    const longTermStatosticsChartContainer = this.componentElem.querySelector('.statistic__long-term-container__chart-container') as HTMLElement;
    const thisChartContainer = document.createElement('div');
    thisChartContainer.id = chartContainerId;

    const chartElem = document.createElement('canvas');
    new Chart(chartElem, config);

    thisChartContainer.append(chartElem);
    longTermStatosticsChartContainer.append(thisChartContainer);
  }

  showNewWordsStatisctics(userWordsContent: UserWordContent[], dateType: 'dateWhenItBecameLearned' | 'dateWhenItBecameNew') {
    const { convertedDatesArr, numberOfWordsArr } = this.getStatistics(userWordsContent, dateType);
    const text = 'Колличество новых слов по дням';

    const chartConfig = this.getChartCongig(convertedDatesArr, numberOfWordsArr, text);

    this.renderChart('newWordsChart', chartConfig);
  }

  showLearningWordsStatisctics(userWordsContent: UserWordContent[], dateType: 'dateWhenItBecameLearned' | 'dateWhenItBecameNew') {
    const { convertedDatesArr, numberOfWordsArr } = this.getStatistics(userWordsContent, dateType);
    const text = 'Количества изученных слов за весь период по дням';
    const totalNumberOfLearnedWordsToDate = numberOfWordsArr.map((num, i, arr) => arr.slice(0, i + 1).reduce((sum, current) => sum + current, 0));

    const chartConfig = this.getChartCongig(convertedDatesArr, totalNumberOfLearnedWordsToDate, text);

    this.renderChart('learnedWordsChart', chartConfig);
  }
}
