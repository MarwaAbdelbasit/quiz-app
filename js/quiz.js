let questionsNum = document.querySelector('.count span'),
    spans = document.querySelector('.spans'),
    quizArea = document.querySelector('.quiz-area'),
    answerArea = document.querySelector('.answer-area'),
    submit = document.querySelector('.submit'),
    countdownDiv = document.querySelector('.countdown'),
    minutesSpan = document.querySelector('.countdown .minutes'),
    secondsSpan = document.querySelector('.countdown .seconds'),
    result = document.querySelector('.result'),
    bullets = document.querySelector('.bullets'),
    countIndex = 0,
    numOfRightAnswers = 0,
    numOfWrongAnswers = 0,
    seconds = 3,
    countdownInterval;

/* fetching qustions from json file using AJAX request */
function getQuestion() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function() {
    if(this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText),
          qCount = questions.length;
      createBullets(qCount);
      grabData(questions[countIndex], qCount);

      timer(60, qCount);

      //onclick function for the submittion button
      submit.onclick = () => {

        //grab right answer of the current question
        let rightAnswer = questions[countIndex].right_answer;

        countIndex++; //to move to the next question

        //function to check if the chosen answr is the right one
        checkAnswer(rightAnswer, qCount);

        quizArea.innerHTML = '';
        answerArea.innerHTML = '';

        grabData(questions[countIndex], qCount);

        //function to hundel bullets
        handleBullts();

        clearInterval(countdownInterval);
        timer(60, qCount);

        //function to show result
        showResult(qCount);
      };
    }
  };

  myRequest.open("GET", "js/questions.json", true);
  myRequest.send();
}

getQuestion();


/* create bullets */
function createBullets(num) {
  questionsNum.innerHTML = num;

  for (var i = 0; i < num; i++) {

    //create spans inside spans
    let bulletsSpan = document.createElement('span');

    //check if it is first span
    if(i === 0) {
      bulletsSpan.classList.add('on');
    }
    spans.appendChild(bulletsSpan);
  }
}

//function to grab data from json file
function grabData(obj, count) {
  if(countIndex < count) {
    //create h2 element
    let questionH2 = document.createElement('h2');
    //create text inside questionH2
    let questionH2Txt = document.createTextNode(obj.title);
    //put text inside questionH2
    questionH2.appendChild(questionH2Txt);
    //put h2 inside quiz-area
    quizArea.appendChild(questionH2);

    for (var i = 1; i <= 4; i++) {
      //create answers div
      let answerDiv = document.createElement('div');
      //give answerDiv class answer
      answerDiv.className = 'answer';
      //create input element
      let input = document.createElement('input');
      //give id
      input.setAttribute('id', `answer_${i}`);
      //set type='radio'
      input.setAttribute('type', 'radio');
      //set name='questions'
      input.setAttribute('name', 'questions');
      input.dataset.answer = obj[`answer_${i}`];
      //put input inside answerDiv
      answerDiv.appendChild(input);
      //create label for input
      let label = document.createElement('label');
      //set for='answer_1'
      label.setAttribute('for', `answer_${i}`);
      //create txt for label
      let labelTxt = document.createTextNode(obj[`answer_${i}`]);
      //put labelTxt inside label
      label.appendChild(labelTxt);
      //put label inside answerDiv
      answerDiv.appendChild(label);
      //put answerDiv inside answerArea
      answerArea.appendChild(answerDiv);

      //make first answer selected by default
      if(i === 1) {
        input.checked = true;
      }
    }
  }
}

function checkAnswer(rAnswer, count) {
  //grab th inputs
  let answers = document.getElementsByName('questions'),
      chosenAnswer;

  for (var i = 0; i < answers.length; i++) {
    if(answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  if(chosenAnswer === rAnswer) {
    numOfRightAnswers++;
  }
}

//function to hundel bullets
function handleBullts() {
  let bulletsSpans = document.querySelectorAll('.bullets .spans span');
  let bulletsArray = Array.from(bulletsSpans);
  bulletsArray.forEach((span, index) => {
    if(countIndex === index) {
      span.classList.add('on');
    }
  });
}

//timer function
function timer(duration, count) {
  if(countIndex < count) {
    countdownInterval = setInterval(function() {
      let minutes = parseInt(duration / 60),
          remSeconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      remSeconds = remSeconds < 10 ? `0${remSeconds}` : remSeconds;

      minutesSpan.innerHTML = minutes;
      secondsSpan.innerHTML = remSeconds;

      if(--duration < 0) {
        clearInterval(countdownInterval);
        submit.click();
      }
    }, 1000);
  }
}


//function to show the result
function showResult(count) {

  let resultTxt;

  if(countIndex === count) {
    quizArea.remove();
    answerArea.remove();
    bullets.remove();
    submit.remove();

    if(numOfRightAnswers === count) {
      resultTxt = `<span class="perfect">Perfect!</span> all answers are correct`;
    } else if ((numOfRightAnswers > (count / 2)) && (numOfRightAnswers < count)) {
      resultTxt = `<span class="good">Good!</span> ${numOfRightAnswers} answers out of ${count} are corrcet`;
    } else {
      resultTxt = `<span class="bad">Bad!</span> ${numOfRightAnswers} answers out of ${count} are corrcet`;
    }
    result.innerHTML = resultTxt;
  }
}


// scroll reveal animation
const sr = ScrollReveal({
  origin: 'top',
  distance: '80px',
  duration: 2000,
  reset: true
})

sr.reveal('.answer', {delay: 100})
sr.reveal('.quiz-area', {delay: 200})
sr.reveal('.submit', {delay: 300})
sr.reveal('.bullets', {delay: 400})
