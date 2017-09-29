//gotta figure out a way to prevent multiple events from triggering on fast multi clicks. 
//also need to sort out why the next question seems to briefly flash before the gif page displays

let randomCategories = [];
let categoryID = 0;
let difficulty = "";
let numberCorrect = 0;
let numberWrong = 0;
let questionBank = [];
let correctAnswer = "";
const container = $(".container");


function initialSetup() {
    gameReset();
    getRandomCategories();

};


function gameReset() {
    randomCategories = [];
    numberCorrect = 0;
    numberWrong = 0;
    container.empty();
    container.append("<h1>Pick a Category</h1>")
};

function getRandomCategories() {
    $.ajax({
        url: "https://opentdb.com/api_category.php",
        method: "GET"
    }).done(function (response) {
        let categories = response.trivia_categories
        for (let i = 0; i < 5; i++) {
            let index = Math.floor(Math.random() * 24);
            randomCategories.push(categories[index]);
        }
        renderCategoryButtons();
    })
};

function renderCategoryButtons() {
    console.log(randomCategories)
    $.each(randomCategories, function (i, element) {
        let category = element.name;
        category = category.replace(/Entertainment: /g, '');
        let newButton = $("<btn/>")
            .addClass("btn btn-outline-secondary btn-block .btn-group-vertical category-select")
            .attr("data", element.id)
            .text(category)
        container.append(newButton);
    })
};



function renderDifficultyButtons() {
    let easyButton = $("<btn/>")
        .addClass("btn btn-outline-secondary btn-block .btn-group-vertical difficulty")
        .html("Easy")
    container.append(easyButton);
    let hardButton = $("<btn/>")
        .addClass("btn btn-outline-secondary btn-block .btn-group-vertical difficulty")
        .html("Hard")
    container.append(hardButton);
}



function renderStartButton() {
    container.empty()
    let newButton = $("<btn/>")
        .addClass("btn btn-outline-secondary btn-block .btn-group-vertical")
        .attr("id", "start-button")
        .text("START")
    container.append(newButton);
    container.prepend("<h1>Y'all ready for this??</h1>")
}



function renderQuestion() {
    countDown();
    let currentQuestion = questionBank[0].question;
    let questionElement = $("<h2>");
    questionElement.html(currentQuestion);
    container.empty();
    container.append(questionElement);
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
            .addClass("btn btn-outline-secondary btn-block .btn-group-vertical answer-selection")
            .text(possibleAnswers[randomIndex])
        container.append(newButton);
        possibleAnswers.splice(randomIndex, 1);
    }
}




function renderGameStats() {
    $("#timer").empty();
    container.empty();
    container.append("<h1>Thanks for Playing!</h1");
    container.append("<h4> Correct Answers: " + numberCorrect + "</h4");
    container.append("<h4> Wrong Answers: " + numberWrong + "</h4");
}




function renderRestart() {
    let newButton = $("<btn/>")
        .addClass("btn btn-outline-secondary btn-block .btn-group-vertical restart")
        .text("Try Again!")
    container.append(newButton);
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



function ifTimeOut() {
    $("#timer").empty(); //why does this not work here??
    numberWrong++;
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/random?api_key=CDrewNwfN9TWDnXhucfwDmCGcZIfoVuy&tagtimes-up=&rating=G",
        method: "GET"
    }).done(function (response) {
        let gifImg = $("<img>")
        gifImg.attr("src", response.data.fixed_height_downsampled_url)
        gifImg.addClass("giphy")
        container.empty();
        container.append("<h1>Times Up!!</h1>")
        container.append(gifImg)
        container.append("<p>The correct answer was: " + correctAnswer + "</p>")
    })
    setTimeout(function () {

        checkGameEnd();
    }, 5000)
}




function ifWrong() {
    //ajax call to get "thumbs-down" gif and display it for 5 seconds
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/random?api_key=CDrewNwfN9TWDnXhucfwDmCGcZIfoVuy&tag=thumbs-down&rating=G",
        method: "GET"
    }).done(function (response) {
        console.log(response)
        let gifImg = $("<img>")
        gifImg.attr("src", response.data.fixed_height_downsampled_url)
        gifImg.addClass("giphy")
        container.empty();
        container.append("<h1>Wrong!</h1>")
        container.append(gifImg)
        container.append("<p>The correct answer was: " + correctAnswer + "</p")
    })
    setTimeout(function () {
        checkGameEnd();
    }, 5000)

}



function ifRight() {
    //ajax call to get "clapping" gif and display it for 5 seconds
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/random?api_key=CDrewNwfN9TWDnXhucfwDmCGcZIfoVuy&tag=clapping&rating=G",
        method: "GET"
    }).done(function (response) {
        console.log(response)
        let gifImg = $("<img>")
        gifImg.attr("src", response.data.image_url)
        gifImg.addClass("giphy")
        container.empty();
        container.append("<h1>BOOMSHAKALAKA!</h1>")
        container.append(gifImg)
        container.append("<h3>Correct!</h3>")
    })
    setTimeout(function () {
        checkGameEnd();
    }, 5000)
}


function checkAnswer(obj) {
    $("#timer").empty();
    clearInterval(decreaseTime)
    if ($(obj).text() === correctAnswer) {
        numberCorrect++
        ifRight()

    } else {
        numberWrong++
        ifWrong();
    }
}


function countDown() {
    timeRemaining = 10;
    $("#timer").html("<h5>Time Remaining: " + timeRemaining + " Seconds!</h5>")
    decreaseTime = setInterval(timer, 1000);

    function timer() {
        if (timeRemaining === 0) {
            clearInterval(decreaseTime)
            ifTimeOut();
        }
        if (timeRemaining > 0) {
            timeRemaining--
        }
        $("#timer").html("<h5>Time Remaining: " + timeRemaining + " Seconds!</h5>")
    }
}



$(document).ready(function () {
    initialSetup();
})



$(document).on("click", ".category-select", function (e) {
    e.stopPropagation();
    categoryID = $(this).attr("data");
    container.empty()
    container.html('<h1>Choose a difficulty</h1>')
    renderDifficultyButtons();
})



$(document).on("click", ".difficulty", function () {
    difficulty = $(this).text().toLocaleLowerCase();
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


$(document).on("click", ".restart", function (e) {
    e.stopPropagation();
    initialSetup()
})
