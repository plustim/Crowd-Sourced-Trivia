
$(document).ready(function(){

	var triviaItems;
	var fallbackTrivia = [
		{
			"category": "Animals",
			"type": "multiple",
			"difficulty": "medium",
			"question": "A carnivorous animal eats flesh, what does a nucivorous animal eat?",
			"correct_answer": "Nuts",
			"incorrect_answers": [
				"Nothing",
				"Fruit",
				"Seaweed"
			]
		},
		{
			"category": "Animals",
			"type": "multiple",
			"difficulty": "medium",
			"question": "What type of animal is a natterjack?",
			"correct_answer": "Toad",
			"incorrect_answers": [
				"Bird",
				"Fish",
				"Insect"
			]
		},
		{
			"category": "Animals",
			"type": "multiple",
			"difficulty": "medium",
			"question": "Cashmere is the wool from which kind of animal?",
			"correct_answer": "Goat",
			"incorrect_answers": [
				"Sheep",
				"Camel",
				"Llama"
			]
		},
		{
			"category": "Animals",
			"type": "multiple",
			"difficulty": "medium",
			"question": "What is the scientific name for the &quot;Polar Bear&quot;?",
			"correct_answer": "Ursus Maritimus",
			"incorrect_answers": [
				"Polar Bear",
				"Ursus Spelaeus",
				"Ursus Arctos"
			]
		},
		{
			"category": "Animals",
			"type": "multiple",
			"difficulty": "medium",
			"question": "What are rhino&#039;s horn made of?",
			"correct_answer": "Keratin",
			"incorrect_answers": [
				"Bone",
				"Ivory",
				"Skin"
			]
		},
		{
			"category": "Animals",
			"type": "multiple",
			"difficulty": "medium",
			"question": "For what reason would a spotted hyena &quot;laugh&quot;?",
			"correct_answer": "Nervousness",
			"incorrect_answers": [
				"Excitement",
				"Aggression",
				"Exhaustion"
			]
		},
		{
			"category": "Animals",
			"type": "multiple",
			"difficulty": "medium",
			"question": "Which animal was part of an Russian domestication experiment in 1959?",
			"correct_answer": "Foxes",
			"incorrect_answers": [
				"Pigeons",
				"Bears",
				"Alligators"
			]
		},
		{
			"category": "Animals",
			"type": "multiple",
			"difficulty": "medium",
			"question": "The now extinct species &quot;Thylacine&quot; was native to where?",
			"correct_answer": "Tasmania, Australia",
			"incorrect_answers": [
				"Baluchistan, Pakistan",
				"Wallachia, Romania",
				"Oregon, United States"
			]
		},
		{
			"category": "Animals",
			"type": "multiple",
			"difficulty": "medium",
			"question": "What is the name of the family that the domestic cat is a member of?",
			"correct_answer": "Felidae",
			"incorrect_answers": [
				"Felinae",
				"Felis",
				"Cat"
			]
		},
		{
			"category": "Animals",
			"type": "multiple",
			"difficulty": "medium",
			"question": "What dog bread is one of the oldest breeds of dog and has flourished since before 400 BCE.",
			"correct_answer": "Pugs",
			"incorrect_answers": [
				"Bulldogs",
				"Boxers",
				"Chihuahua"
			]
		}
	];

	var triviaGame = {
		current: 0,
		countdown: 0,
		rightAnswer: 10,
		numberCorrect: 0,

		startTimer: function( element, seconds ){
			// countdown from number seconds
			var secondsLeft = seconds;
			triviaGame.countdown = setInterval(function(){
				$(element).html( secondsLeft );
				if(secondsLeft <= 0){
					triviaGame.stopTimer();
					triviaGame.checkAnswer( "none" );
				}
				secondsLeft--;
			}, 1000);
		},

		stopTimer: function(){
			clearInterval(triviaGame.countdown);
		},

		// start the game
		startGame: function(){
			$("#result").fadeOut(300);
			numberCorrect = 0;
			current = 0;
			$.ajax({
				url: "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple",
				method: "GET",
			    timeout: 5000,
			    success: function( data, textStatus ){
					triviaItems = data.results;
					// show the question
					triviaGame.ask(current);
					// set the timer
					triviaGame.startTimer( "#clock", 15 );
			    },
			    error: function( xhr, textStatus, errorThrown ){
			    	// if ajax does not return a result after 5 seconds, use fallback
					triviaItems = fallbackTrivia;
					// show the question
					triviaGame.ask(current);
					// set the timer
					triviaGame.startTimer( "#clock", 15 );
			    }
			});
		},

		endGame: function(){
			//alert();
			finalResults = "<h2>you got " + numberCorrect + " right out of " + triviaItems.length + " total questions!</h2><button id='start'>Play Again?</button>";
			$("#result").html(finalResults).fadeIn(300);
		},

		// show question
		ask: function( number ){
			var question = triviaItems[number].question + "<hr>";
			var options = triviaItems[number].incorrect_answers.slice();
			rightAnswer = Math.floor(Math.random()*(options.length+1));
			options.splice( rightAnswer, 0, triviaItems[number].correct_answer );
			var answers = "";
			$.each( options, function( index, value ){
				answers += "<span class='option select' data-answer=" + index + ">" + value + "</span><br>";
			});
			$("#question").html(question);
			$("#answers").html(answers);
			$("#question, #answers").fadeIn(300);
			// get image ready for answer
			$("#result").html("<video  preload='auto' autoplay='autoplay' muted='true' loop='loop' webkit-playsinline playsinline poster='assets/images/untitled.jpg'></video>");
			$.ajax({
				url: "https://api.giphy.com/v1/gifs/random?api_key=cd348e08c50247ec84489456201900ba&tag=" + triviaItems[current].correct_answer + "&rating=G",
				method: "GET"
			}).done(function(response) {
				$("#result video").html("<source src='" + response.data.image_mp4_url + "' type='video/mp4'>");
			});
		},

		// check answer
		checkAnswer: function( answer ){
			// check if given answer equals set answer
			var yourResult = "";
			if( answer === rightAnswer ){
				yourResult = "Correct!";
				numberCorrect++;
			}else if( answer === "none" ){
				yourResult = "Out of Time!";
			}else{
				yourResult = "Wrong!";
			};
			$("#result").prepend("<h2>" + yourResult + "</h2>");
			$("#result").append("<p>" + triviaItems[current].question + "</p><h3>" + triviaItems[current].correct_answer + "</h3>");
			$("#answers .option").removeClass("select");
			$("#question, #answers").fadeOut(300);
			$("#result").fadeIn(300);
			// after 15 seconds, hide result screen and empty it
			setTimeout(function(){
				current++;
				$("#result").fadeOut(300);
				setTimeout(function(){
					// if there are questions left, move on to next question
					if( current < triviaItems.length ){
						triviaGame.ask(current);
						triviaGame.startTimer( "#clock", 15 );
					}else{ // otherwise end the game
						triviaGame.endGame();
					}
				}, 300);
			}, 10000);
		}



	};

	$(document).on("click", "#start", triviaGame.startGame);

	$("#answers").on("click", ".select", function(){
		triviaGame.stopTimer();
		triviaGame.checkAnswer( $(this).data("answer") );
	});
});