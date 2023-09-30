$(document).ready(function () {
    const colors = ["blue", "purple", "orange", "pink", "brown", "teal"]; // New colors
    let solution = generateSolution(); // Initialize the solution when the page is loaded
    let guessCount = 1; // Initialize guess count


    updateGuessButtonLabel(); // Update guess button label

    $("#submitBtn").click(function () {

        mainGuess();
    });

    $("#resetBtn").click(function () {
        location.reload(); // Reload the page
    });

    // Function that processes the full game logic, triggered by cliking the guess button
    function mainGuess() {
        const guesses = []; // Array to store the player's guessed colors

        // Collect the guessed colors
        $(".mastermind-playfield .guess-active .circle").each(function () {
            const guessedColor = $(this).data("color");
            const guessedColorIndex = colors.indexOf(guessedColor);
            guesses.push(guessedColorIndex); // Store color index as number
        });

        const feedback = checkGuess(guesses, solution);
        updateFeedbackVisuals(feedback); // Update the feedback row with the new feedback

        if (feedback === 33333) {
            // Solution guessed completely
            showModal("Congratulations!", `You guessed the solution in ${guessCount} guesses.`);
        }

        // Remove event handlers and circle ids for the current guess row
        $(".guess-area .circle").off();
        $(".guess-area .circle").removeAttr("id");
        $("#submitBtn").prop("disabled", true);

        // Remove submit ID from the currently active submit button
        $("#submitBtn").removeAttr("id");

        // Remove the guess-active class from the current row
        $(".guess-area .guess-row").removeClass("guess-active");
        // Append a new row for the next guess
        const newGuessRow = $("<div class='row mastermind-playfield guess-row guess-active'></div>");

        for (let i = 0; i < 5; i++) {
            const newCircle = $("<div class='col-2 mb-3'><div class='circle'></div></div>");

            // Add event listener to the new circle for changing colors
            newCircle.find(".circle").click(function () {
                const circle = $(this);
                const currentColor = circle.data("color");
                const currentIndex = colors.indexOf(currentColor);
                const newColorIndex = (currentIndex + 1) % colors.length;
                const newColor = colors[newColorIndex];
                circle.css("background-color", newColor);
                circle.data("color", newColor);
            });

            newGuessRow.append(newCircle);
        }

        const newGuessButton = $("<div class='col-2'><button class='btn btn-primary' id='submitBtn'>Guess</button></div>");
        newGuessRow.append(newGuessButton);

        $(".guess-area").append(newGuessRow);
        guessCount++; // Increment guess count
        updateGuessButtonLabel(); // Update guess button label
        $("#submitBtn").click(function () {
            mainGuess();
        });
        // Scroll to the bottom of the "content" div without animation
        const contentDiv = $(".content");
        contentDiv.scrollTop(contentDiv.prop("scrollHeight"));


    }

    // Function to update the guess button label
    function updateGuessButtonLabel() {
        $("#submitBtn").text(`Guess ${guessCount}`);
    }

    // Function to generate the solution
    function generateSolution() {
        let solution = '';
        for (let i = 0; i < 5; i++) {
            const randomColorIndex = Math.floor(Math.random() * colors.length);
            solution += randomColorIndex.toString();
        }
        return solution;
    }

    // Function to check the guessed pattern against the solution
    function checkGuess(guesses, solution) {
        const feedbackArray = [];


        // Convert solution string to an array of numbers
        const solutionArray = solution.split('').map(Number);

        // Compare the guessed colors with the solution
        for (let i = 0; i < solutionArray.length; i++) {
            if (solutionArray[i] === guesses[i]) {
                feedbackArray.push(3); // Right color and position
            } else if (solutionArray.includes(guesses[i])) {
                feedbackArray.push(2); // Right color but wrong position
            } else {
                feedbackArray.push(1); // Completely wrong color
            }
        }

        // Combine the feedback digits into a single number
        const feedbackNumber = parseInt(feedbackArray.join(''));
        return feedbackNumber;
    }

    $(".mastermind-playfield .circle").click(function () {
        const circle = $(this);
        const currentColor = circle.data("color");
        const currentIndex = colors.indexOf(currentColor);

        const newColorIndex = (currentIndex + 1) % colors.length;
        const newColor = colors[newColorIndex];

        circle.css("background-color", newColor);
        circle.data("color", newColor);
    });

    // Function to update the feedback circles with new feedback
    function updateFeedbackVisuals(feedback) {

        const feedbackCircles = $(".feedback-circle"); // Select existing feedback circles

        for (let i = 0; i < 5; i++) {
            const feedbackDigit = Math.floor(feedback / Math.pow(10, 4 - i)) % 10;
            const feedbackCircle = $(feedbackCircles[i]); // Get the specific feedback circle

            feedbackCircle.removeClass("green yellow red"); // Remove previous classes

            switch (feedbackDigit) {
                case 3:
                    feedbackCircle.addClass("green"); // Add green class
                    break;
                case 2:
                    feedbackCircle.addClass("yellow"); // Add yellow class
                    break;
                case 1:
                    feedbackCircle.addClass("red"); // Add red class

                    break;
                default:
                    break;
            }
        }
    }

});
