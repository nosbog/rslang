const svgWidth = 2000,
      svgHeigth = 2000;
const xArr = [-400, -100, -325],
      yArr = [10, 140, -405];
const lineBreaks = [210, -90, 500],
      lineLenght = [275, 240, 310];
const xGap = 435,
      yGap = 360;
const containers: Array<string> = [];

for (let i = 0; i < xArr.length; i+=1) {
  let y = yArr[i];
  containers[i] = '';

  for(let count = 0; y < svgHeigth; y += yGap, count += 1) {
    let x = xArr[i];
    
    if (count % 2 === 0) {
      x -= lineLenght[i];
    }

    for(x -= count * 20; x < svgWidth + lineLenght[i]; x += xGap) {
      const line1 = `<line x1="${x}" y1="${y}" x2="${x + lineLenght[i]}" y2="${y}" transform="rotate(-45)" />`;
      const line2 = `<line x1="${x + lineLenght[i]}" y1="${y + lineBreaks[i]}" x2="${x}" y2="${y + lineBreaks[i]}"  transform="rotate(-45)" />`;
      containers[i] += line1 + line2;
    }
  }
}

const svgBg: string = `
  <svg version="1.1" id="home-anim" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 1600 1600" xml:space="preserve">
    <g>
      <g class="lines-container">
        ${containers[0]}
      </g>
      <g class="lines-container">
        ${containers[1]}
      </g>
      <g class="lines-container">
        ${containers[2]}
      </g>
    </g>
  </svg>
`;

const svgSeparator1: string = `
  <svg class="svg-separator separator_aback" viewBox="0 0 1440 500">
    <path fill="#f7faf6" opacity="undefined" d="m0.99932,189.37639l107.65893,63.92337c85.71939,56.0971 335.22767,120.21559 454.811,86.00477c119.58333,-34.21082 240.87201,-130.67035 303.61379,-194.13824c62.74177,-63.46789 186.5308,-100.32411 314.11414,-89.90077c78.33705,13.15107 128.67409,45.30215 184.01114,90.45322l79.79167,79.23507l-3,277.04619l-65.79167,-2c-59.79167,0 -179.375,0 -298.95833,0c-119.58333,0 -239.16666,0 -358.74999,0c-119.58333,0 -239.16666,0 -358.74999,0c-119.58333,0 -239.16666,0 -298.95833,0l-59.79167,0l-0.00069,-310.62361z" id="svg_1" stroke="null"/>
  </svg>
`;

const svgSeparator2: string = `
  <svg class="svg-separator separator_light" viewBox="0 0 1440 500">
    <path fill="#f7faf6" opacity="undefined" d="m-0.00068,275.37639l179.65893,78.92337c91.71939,44.0971 212.22767,51.21559 333.811,43.00477c121.58333,-8.21082 218.87202,-50.67035 294.61379,-78.13824c75.74177,-27.46789 181.5308,-128.32411 309.11414,-117.90077c80.33705,1.15107 197.67409,52.30215 253.01114,97.45322l70.79167,53.23507l1,151.04619l-65.79167,-2c-59.79167,0 -179.375,0 -298.95833,0c-119.58333,0 -239.16666,0 -358.74999,0c-119.58333,0 -239.16666,0 -358.74999,0c-119.58333,0 -239.16666,0 -298.95833,0l-59.79167,0l-1.00069,-225.62361z" id="svg_1" stroke="null"/>
  </svg>
`;

const svgSeparator3: string = `
  <svg class="svg-separator" viewBox="0 0 1440 500">
    <path fill="#f7faf6" opacity="undefined" d="m-5.00068,433.37639l81.65893,-19.07663c74.71939,-22.9029 174.22767,-66.78441 295.811,-74.99523c121.58333,-8.21082 281.87202,33.32965 420.61379,73.86176c138.74177,40.53211 128.5308,43.67589 256.11414,54.09923c80.33705,1.15107 208.67409,-45.69785 262.01114,-60.54678l166.79167,-65.76493l-34,163.04619l-65.79167,-2c-59.79167,0 -179.375,0 -298.95833,0c-119.58333,0 -239.16666,0 -358.74999,0c-119.58333,0 -239.16666,0 -358.74999,0c-119.58333,0 -239.16666,0 -298.95833,0l-64.79167,0l-3.00069,-68.62361z" id="svg_1" stroke="null"/>
  </svg>
`;

export const main: string = `
  <section class="main__section greeting-section">
  <div class="bg-container greeting-bg">
    ${svgBg}
  </div>
  <div class="wrapper">
    <div class="greeting__text">
      <h1>Funny<span class="bold">English</span></h1>
      <p>
        Учите английский бесплатно, весело и эффективно!
      </p>
    </div>
    <img src="./assets/svg/main.svg" alt="FunnyEnglish" class="greeting__image" width="60%">
  </div>
  ${svgSeparator1}
  </section>

  <section class="main__section advantages-section">
  <div class="wrapper wrapper_padding">
    <h2 class="section-heading">Наши преимущества?</h2>
    <div class="advantages-container">
      <div class="advantages__item card">
        <img src="./assets/svg/advantages_1.svg" alt="Учебник" class="advantages__image">
        <div class="advantages__text">
          <h3 class="advantages__name">Учебник</h3>
          <p class="advantages__desc">
            Более 3500 тысяч слов для изучения, разбитых на разделы по уровню твоей подготовки с удобной навигацией.
          </p>
        </div>
      </div>
      <div class="advantages__item card">
        <img src="./assets/svg/advantages_2.svg" alt="Игры" class="advantages__image">
        <div class="advantages__text">
          <h3 class="advantages__name">Игры</h3>
          <p class="advantages__desc">
            2 интересных игры на развитие запоминания английских слов, восприятия на слух речи и письма.
          </p> 
        </div>
      </div>
      <div class="advantages__item card">
        <img src="./assets/svg/advantages_3.svg" alt="Статистика" class="advantages__image">
        <div class="advantages__text">
          <h3 class="advantages__name">Статистика</h3>
          <p class="advantages__desc">
            Отслеживай свой прогресс в индивидуальной статистике, ставь цели и вдохновляйся на и достижение новых результатов каждый день!
          </p> 
        </div>
      </div>
    </div>
  </div>
  ${svgSeparator2}
  </section>
  <section class="main__section video-section">
  <div class="wrapper wrapper_padding">
    <h2 class="section-heading">Как устроено приложение?</h2>
    <div class="video-container">
      <iframe width="420" height="315" src="https://www.youtube.com/embed/tgbNymZ7vqY"></iframe>
    </div>
  </div>
  ${svgSeparator3}
  </section>

  <section class="main__section team-section">
  <div class="wrapper wrapper_padding">
    <h2 class="section-heading">Кто разработал?</h2>
    <div class="developer-container">
      <div class="developer card">
        <div class="developer__column">
          <img src="https://avatars.githubusercontent.com/u/83293276?v=4" alt="Богдан" class="developer__image" width="200">
        </div>
        <div class="developer__column">
          <h3 class="developer___name">Богдан <a href="https://github.com/nosbog"><i class="fab fa-github"></i></a></h3>
          <p class="developer___desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae aspernatur voluptatum molestias, harum fuga culpa saepe ipsum ullam? At est delectus totam praesentium, maiores tenetur quas. Doloribus fugit dolor nobis?</p>
        </div>
      </div>
      <div class="developer card">
        <div class="developer__column">
          <img src="https://avatars.githubusercontent.com/u/34840495?v=4" alt="Настя" class="developer__image" width="200">
        </div>
        <div class="developer__column">
          <h3 class="developer___name">Настя <a href="https://github.com/aytsaN"><i class="fab fa-github"></i></a></h3>
          <p class="developer___desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae aspernatur voluptatum molestias, harum fuga culpa saepe ipsum ullam? At est delectus totam praesentium, maiores tenetur quas. Doloribus fugit dolor nobis?</p>
        </div>
      </div> 
    </div>
  </div>
  </section>
`;