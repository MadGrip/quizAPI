//XXX get quiz settings
const generateBtn = document.getElementById("generateBtn");

function getQuizSettings() {
    const formGen = document.getElementById("generateFrm");
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const type = document.getElementById("type").value;
    const values = [
        { key: "amount", value: amount, sym: "=" },
        { key: "category", value: category, sym: "=" },
        { key: "difficulty", value: difficulty, sym: "=" },
        { key: "type", value: type, sym: "=" }
    ];
    //get filtered values
    const valuesFilt = [];
    for (let item of values) {
        if (item.value != "any") {
            valuesFilt.push(item);
        }
    };
    //push values into array and make string out of it
    const result = [];
    valuesFilt.forEach(item => {
        const a = `${item.key}${item.sym}${item.value}`;
        result.push(a);
    })
    let resultStr = result.join("&");
    const genURL = `https://opentdb.com/api.php?${resultStr}`;
    return genURL;
}
const data = [];
//Event listeners
generateBtn.addEventListener("click", getQuizSettings);
generateBtn.addEventListener("click", () => {
    fetch(getQuizSettings())
        .then(res => res.json())
        .then(json => {
            data.push(...json.results);
        })
        .then(() => {
            joinAnswers(data);
            renderQuiz(data);
        })
        .catch(err => { throw err });
});


//XXX generate Quiz
const quiz = document.getElementById("quiz");

//randomly shuffle answers in array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

//join and shuffle correct & incorrect answers to 1 arr
function joinAnswers(data) {
    data.forEach(obj => {
        let answers = obj.incorrect_answers.concat(obj.correct_answer);
        shuffle(answers);
        obj.answers = answers;
    })
}

function renderAnswers(obj) {
    let str = "";
    obj.answers.forEach(answer => {
        let item = `<li class="quiz--answer">${answer}</li>`;
        str += item;
    });
    return str;
}

function renderQuizItem(obj) {
    let item =
        `
        <div class="quiz--item">
            <h4 class="quiz--question">${obj.question}</h4>
            <ul class="quiz--answers">
                ${renderAnswers(obj)}
            </ul>
        </div>
        `;
    return item;
}

function renderQuiz(data) {
    console.log(data);
    let items = "";
    data.forEach(obj => {
        const item = renderQuizItem(obj);
        items += item;
    })
    quiz.innerHTML = items;
}