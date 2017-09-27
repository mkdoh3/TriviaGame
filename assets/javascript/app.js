//make an api call to gather all of the available categories and then pick 5 at random to populate the html




//response is equal to the json object returned from the ajax call, response has one key "trivia_catageories" that contains a an array of 24 objects that represent the available trivia categories
//generate 5 random numbers 0-24 to correspond to the 24 elements in the categories array, repeat 5 times pushing those elements into the random categories array
//generate 5 buttons for the five random categories, each button hold a data attribute that is equal to the category id needed to make the api call
//record category id on click



let randomCategories = [];
let categoryID = 0;
let difficulty = "";
let numberCorrect = 0;
let numberWrong = 0;
let questionBank = [];
let correctAnswer = "";
const container = $(".container");


function initialSetup() {
    randomCategories = [];
    numberCorrect = 0;
    numberWrong = 0;
    $(".container").empty();
    $(".container").append("<h1>Pick a Category</h1>")
    $.ajax({
        url: "https://opentdb.com/api_category.php",
        method: "GET"
    }).done(function (response) {
        let categories = response.trivia_categories
        for (let i = 0; i < 5; i++) {
            let index = Math.floor(Math.random() * 24);
            randomCategories.push(categories[index]);
        }
        $.each(randomCategories, function (i, element) {
            let newButton = $("<btn/>")
                .addClass("btn btn-info btn-block .btn-group-vertical category-select")
                .attr("data", element.id)
                .text(element.name)
            container.append(newButton);
        })
    })
}


function renderDifficultyButtons() {
    let easyButton = $("<btn/>")
        .addClass("btn btn-success btn-block .btn-group-vertical difficulty")
        .html("easy")
    $(".container").append(easyButton);
    let hardButton = $("<btn/>")
        .addClass("btn btn-danger btn-block .btn-group-vertical difficulty")
        .html("hard")
    $(".container").append(hardButton);
}


function renderStartButton() {
    $(".container").empty()
    let newButton = $("<btn/>")
        .addClass("btn btn-info btn-block .btn-group-vertical")
        .attr("id", "start-button")
        .text("Start")
    $(".container").append(newButton);
    $(".container").prepend("<h1>Y'all ready for this??</h1>")
}




function renderQuestion() {
    let currentQuestion = questionBank[0].question;
    $(".container").empty();
    $(".container").append("<h1>" + currentQuestion + "</h1");
    renderSelectionButtons()
}

function renderSelectionButtons() {
    let possibleAnswers = [];
    correctAnswer = questionBank[0].correct_answer;
    possibleAnswers.push(questionBank[0].correct_answer);
    $.each(questionBank[0].incorrect_answers, function (i, element) {
        possibleAnswers.push(element);
    })
    for (let i = 0; i < 4; i++) {
        let randomIndex = Math.floor(Math.random() * possibleAnswers.length);
        let newButton = $("<btn/>")
            .addClass("btn btn-info btn-block .btn-group-vertical answer-selection")
            .text(possibleAnswers[randomIndex])
        $(".container").append(newButton);
        possibleAnswers.splice(randomIndex, 1);
    }
}


function renderGameStats() {
    $(".container").empty();
    $(".container").append("<h3> Correct Answers: " + numberCorrect + "</h3")
    $(".container").append("<h3> Wrong Answers: " + numberWrong + "</h3")
}


function renderRestart() {
    let newButton = $("<btn/>")
        .addClass("btn btn-success btn-block .btn-group-vertical restart")
        .text("Try Again!")
    $(".container").append(newButton);
}



function checkGameEnd() {
    questionBank.splice(0, 1);
    if (questionBank.length === 0) {
        renderGameStats();
        renderRestart();
    } else {
        renderQuestion();
    }
}


function ifWrong() {
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/random?api_key=CDrewNwfN9TWDnXhucfwDmCGcZIfoVuy&tag=wrong&rating=G",
        method: "GET"
    }).done(function (response) {
        console.log(response)
        let gifURL = response.data.image_url
        console.log(gifURL)
        let gifImg = $("<img>")
        gifImg.attr("src", gifURL)
        container.empty();
        container.append("<h1>Wrong!</h1>")
        container.append(gifImg)
        container.append("<h3>The correct answer was: " + correctAnswer)
    })
    setTimeout(function () {
        checkGameEnd();
    }, 5000)

}

function ifRight() {
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/random?api_key=CDrewNwfN9TWDnXhucfwDmCGcZIfoVuy&tag=winning&rating=G",
        method: "GET"
    }).done(function (response) {
        console.log(response)
        let gifURL = response.data.image_url
        console.log(gifURL)
        let gifImg = $("<img>")
        gifImg.attr("src", gifURL)
        container.empty();
        container.append("<h1>Right!</h1>")
        container.append(gifImg)
        container.append("<h3>Way to Go!</h3>")
    })
    setTimeout(function () {
        checkGameEnd();
    }, 5000)
}









function checkAnswer(obj) {
    if ($(obj).text() === correctAnswer) {
        numberCorrect++
        ifRight()

    } else {
        numberWrong++
        ifWrong();
    }
}





$(document).ready(function () {
    initialSetup();
})



$(document).on("click", ".category-select", function () {
    categoryID = $(this).attr("data");
    container.empty()
    container.html('<h1>Choose a difficulty</h1>')
    renderDifficultyButtons();
})



$(document).on("click", ".difficulty", function () {
    difficulty = $(this).text();
    $.ajax({
        url: "https://opentdb.com/api.php?amount=5&category=" + categoryID + "&difficulty=" + difficulty + "&type=multiple",
        method: "GET"
    }).done(function (response) {
        console.log(response)
        questionBank = response.results
        renderStartButton()
    })
})


$(document).on("click", "#start-button", function () {
    renderQuestion();
})


$(document).on("click", ".answer-selection", function () {
    checkAnswer(this)
})

$(document).on("click", ".restart", function () {
    initialSetup()
})
