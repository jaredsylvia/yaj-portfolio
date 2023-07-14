$(document).ready(function() {
    // Global variables defined with let they're accessible within this .ready 
    let windowWidth, windowHeight, buttonWidth, buttonHeight;
    let $button;
  
    //initialize everything
    initButtonMover();
  
    // initialize the button mover by calling all the required functions
    function initButtonMover() {
      getWindowDimensions();
      positionButtonInMiddle();
      attachButtonHandlers();
      attachWindowResizeHandler();
    }
  
    // get the window dimensions
    function getWindowDimensions() {
      windowWidth = $(window).width();
      windowHeight = $(window).height();
    }
  
    // calculate and move the button in the middle of the window
    function positionButtonInMiddle() {
      buttonWidth = 100;
      buttonHeight = 40;
  
      let buttonLeft = (windowWidth - buttonWidth) / 2;
      let buttonTop = (windowHeight - buttonHeight) / 2;
  
      $button = $('#clickMeButton');
  
      $button.css({
        left: buttonLeft,
        top: buttonTop,
        position: 'absolute'
      });
    }
  
    // attach event handlers to the button
    function attachButtonHandlers() {
      $button.hover(function() {
        moveButtonRandomly();
        changeButtonColor();
      });
  
      $button.click(function() {
        showModal("Congratulations!", "You clicked a button!");
      });
    }
  
    // move button to random position
    function moveButtonRandomly() {
      let newLeft = Math.random() * (windowWidth - buttonWidth);
      let newTop = Math.random() * (windowHeight - buttonHeight);
  
      $button.animate({
        left: newLeft,
        top: newTop
      });
    }
  
    // change color of button by changing class to random bootstrap button class
    function changeButtonColor() {
      let bootstrapClasses = [
        'btn-primary',
        'btn-secondary',
        'btn-success',
        'btn-danger',
        'btn-warning',
        'btn-info'
      ];
  
      let randomIndex = Math.floor(Math.random() * bootstrapClasses.length);
  
      $button.removeClass(bootstrapClasses.join(' ')).addClass(bootstrapClasses[randomIndex]);
    }
  
    // attach resize handler
    function attachWindowResizeHandler() {
      $(window).resize(function() {
        getWindowDimensions();
        positionButtonInMiddle();
      });
    }
  
    
  });
  
 