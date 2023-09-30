$(document).ready(function () {


    // Get all the square buttons
    const buttons = $('.square-button');

    // Define the available classes
    const classes = ['btn-info', 'btn-dark'];

    // Loop through each button and assign a random class
    buttons.each(function () {
        const randomClass = classes[Math.floor(Math.random() * classes.length)];
        $(this).addClass(randomClass);

        // Get the button's ID
        const buttonId = $(this).attr('id');

        // Add a click event handler to toggle classes
        $(this).click(function () {
            // Toggle the class between btn-info and btn-dark
            $(this).toggleClass('btn-info btn-dark');

            // Parse the row and column from the buttonId
            const [, row, col] = buttonId.split('-');
            const rowIndex = parseInt(row);
            const colIndex = parseInt(col);

            // Toggle classes of neighboring buttons
            toggleNeighbor(rowIndex - 1, colIndex); // Top neighbor
            toggleNeighbor(rowIndex + 1, colIndex); // Bottom neighbor
            toggleNeighbor(rowIndex, colIndex - 1); // Left neighbor
            toggleNeighbor(rowIndex, colIndex + 1); // Right neighbor

            // Check for a win
            checkForWin();
        });
    });

    // Function to toggle classes of neighboring buttons
    function toggleNeighbor(row, col) {
        const neighbor = $(`#button-${row}-${col}`);
        if (neighbor.length) {
            neighbor.toggleClass('btn-info btn-dark');
        }
    }

    // Initialize timer variables
    let startTime = new Date();

    // Function to start the timer
    function startTimer() {


        // Function to update the timer
        function updateTimer() {
            const currentTime = new Date();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            $('#timer').text(`Timer: ${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }

        setInterval(updateTimer, 1000);
    }



    // Function to check if all buttons are the same class
    function checkForWin() {
        const allButtons = $('.square-button');
        const areAllButtonsInfo = allButtons.toArray().every(button => $(button).hasClass('btn-info'));
        const areAllButtonsDark = allButtons.toArray().every(button => $(button).hasClass('btn-dark'));

        if (areAllButtonsInfo || areAllButtonsDark) {
            const endTime = new Date();
            const elapsedTimeInSeconds = Math.floor((endTime - startTime) / 1000);
            const minutes = Math.floor(elapsedTimeInSeconds / 60);
            const seconds = elapsedTimeInSeconds % 60;

            const message = `You Won! Time taken: ${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            showModal("Winner", message);
        }
    }


    function cheat() {
        const randomClass = Math.random() < 0.5 ? 'btn-info' : 'btn-dark';
        $('.square-button').removeClass('btn-info btn-dark').addClass(randomClass);
        checkForWin();
    }


    // Attach event listener to cheat button
    $('#cheatButton').click(function () {
        cheat();
    });
    startTimer();
});





