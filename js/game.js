const question = document.getElementById("question");
const chioces = Array.from(document.getElementsByClassName("chioce-text"));
// const questionCounterText = document.getElementById("questionCounter");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById('loader');
const game = document.getElementById('game');
// console.log(chioces);

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple").then((res) => {
    // console.log(res);
    return res.json();
})
    .then(loadedQuestions => {
        // console.log(loadedQuestions.results);
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChioces = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            // console.log(formattedQuestion.answer);

            answerChioces.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer,
            );

            answerChioces.forEach((chioce, index) => {
                formattedQuestion['chioce' + (index + 1)] = chioce;
            });

            return formattedQuestion;

        });
        //     // questions = loadedQuestions;
        game.classList.remove('hidden');
        loader.classList.add('hidden');
        startGame();
    })
    .catch(err => {
        console.log(err);
    });

//   Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    // console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        // go to the end page
        // console.log('done')
        return window.location.assign('./end.html');
    }

    questionCounter++;
    // questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    // Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    chioces.forEach(chioce => {
        const number = chioce.dataset["number"];
        chioce.innerText = currentQuestion["chioce" + number];
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

chioces.forEach(chioce => {
    chioce.addEventListener("click", e => {
        // console.log(e.target);
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChioce = e.target;
        const selectedAnswer = selectedChioce.dataset["number"];

        console.log(selectedAnswer == currentQuestion.answer);

        // Method 1
        // const classToApply = "incorrect";
        // if(selectedAnswer == currentQuestion.answer){
        //     classToApply = "correct";
        // }

        // Method 2
        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        // console.log(classToApply);

        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }

        selectedChioce.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChioce.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}


startGame();