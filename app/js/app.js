/*
 * VARIABLES
 */

var specialThanksTo = [
    {user: "morganmarzv3", reason: "pointing out that we need little hand with a finger pointing thing"}
]

var ball = new Ball('ball');
var cup0 = new Cup('cup0', 0, 0);
var cup1 = new Cup('cup1', 1, 1);
var cup2 = new Cup('cup2', 2, 2);
var messages = new Messages('messages');
var numOfRounds;
var roundsLeft;
var gamelevel = 1;
var switchtime = 1;
var switchdelay = 1;
var scoreElem = document.getElementById('score');

//Define the positions for ball and cups
var cupPos = [40, 270, 490];
var ballPos = [73, 300, 523];

var game =  document.getElementById('game')


/*
 * THE GAME
 */


    //Simple event handler
    var ROUND_COMPLETE = 'roundComplete';
    var ROUNDS_COMPLETE = 'roundsComplete';
    function simpleEventHandler(event) {
        switch (event) {
            case ROUND_COMPLETE:
               roundComplete();
                break;
            case ROUNDS_COMPLETE:
                roundsComplete();
                break;
        }
    }

    //functions to create cup, ball and messages objects for easy access to DOM and variables.
    function Cup(element, number, position) {
        this.elm = document.getElementById(element);
        this.position = position;
        this.number = number;
    }
    function Ball(element) {
        this.elm = document.getElementById(element);
    }
    function Messages(element) {
        this.active = false;
        this.elm = document.getElementById(element);
        this.elm.style.opacity = 0;
    }


    //Let's start this madness!
    function initGame() {
        console.log('Game initiated!');

        //Set up everything
        TweenMax.set(ball.elm, {left: ballPos[1], top: 240});
        TweenMax.set(cup0.elm, {left: cupPos[0]});
        TweenMax.set(cup1.elm, {left: cupPos[1]});
        TweenMax.set(cup2.elm, {left: cupPos[2]});


        //Wait 2 seconds and show intro text.
        var introtext = "The Piranha Plant is on the lose, do not lose sight of it! <br/><br/> <button class='small kongtext' onclick='startGame(4)'>Start game</button>"
        TweenMax.delayedCall(2, showMessage, [introtext]);

    }

    function roundComplete() {
        roundsLeft--;
        if (roundsLeft > 0) {
            startRound();
        } else {
            simpleEventHandler(ROUNDS_COMPLETE);
        }
    }
    function roundsComplete() {
        showMessage('Select the pipe you think the Piranha Plant is hiding in.');
        cup0.elm.onclick = function() { userGuessed(0) };
        cup1.elm.onclick = function() { userGuessed(1) };
        cup2.elm.onclick = function() { userGuessed(2) };
        cup0.elm.style.cursor = "pointer";
        cup1.elm.style.cursor = "pointer";
        cup2.elm.style.cursor = "pointer";
    }
    function userGuessed(int) {
        console.log('you guess ' + int);
        cup0.elm.onclick = null;
        cup1.elm.onclick = null;
        cup2.elm.onclick = null;
        cup0.elm.style.cursor = "initial";
        cup1.elm.style.cursor = "initial";
        cup2.elm.style.cursor = "initial";
        if (int === 1) {
            playAnimation('won');
            TweenMax.delayedCall(4, function() {
                hideMessage();
                gamelevel++;
                numOfRounds++;
                roundsLeft = numOfRounds;
                switchdelay *= 0.9;
                switchtime *= 0.9;
                startGame(numOfRounds);
            })
        } else {
            playAnimation('lost', [int]);
        }
    }

    function startGame(nor) {
        console.log("nor", nor);
        if (messages.active) {
            hideMessage();
        }

        numOfRounds = nor;
        roundsLeft = nor;

        scoreElem.innerHTML = 'Level: ' + gamelevel;

        //Show where ball is
        TweenMax.set(ball.elm, {autoAlpha: 1});
        TweenMax.to(ball.elm,.5, {y: -80});
        TweenMax.to(ball.elm,.5, {y: 0, delay: 1.5});

        TweenMax.delayedCall(2, function() {
            TweenMax.set(ball.elm, {autoAlpha: 0});
            startRound();
        })

    }




    function startRound() {
        cupsToSwitch = getCupsToSwitch();
        console.log('cups to switch: ' + cupsToSwitch[0] + ' and ' + cupsToSwitch[1]);
        doSwitch(cupsToSwitch);
    }

    function getCupsToSwitch() {
        //What cup should NOT switch this round?
        var exclude = Math.floor(Math.random() * 3);

        //ok, get the cups we WANT to switch this round
        var cupsToSwitch = [];
        for (var i=0; i <= 2; i++) {
            if (i != parseInt(exclude)) {
                cupsToSwitch.push(i);
            }
        }
        return cupsToSwitch;
    }

    function doSwitch(arr) {
        //Where do we want to move them?
        pos1 = this['cup'+(arr[0])].position;
        pos2 = this['cup'+(arr[1])].position;

        //make fancy vars for the elements
        elem1 = this['cup'+(arr[0])].elm;
        elem2 = this['cup'+(arr[1])].elm;


        //Get the unused cup so we can set z-indexes
        var i = -1;
        do {
            i++;
        }
        while (arr.indexOf(i) != -1)
        elem3 = this['cup'+i].elm;

        //set z-indexes so they don't collide in weird ways
        elem1.style.zIndex = 3;
        elem2.style.zIndex = 1;
        elem3.style.zIndex = 2;

        //update cup objects with new position index
        this['cup'+(arr[0])].position = pos2;
        this['cup'+(arr[1])].position = pos1;

        //Animate
        TweenMax.to(elem1, switchtime, { bezier:{type: 'quadratic', values:[{y:0}, {y:40}, {y:0}]}, left: cupPos[pos2]});
        TweenMax.to(elem2, switchtime, { bezier:{type: 'quadratic', values:[{y:0}, {y:-40}, {y:0}]}, left: cupPos[pos1]});
        TweenMax.delayedCall(switchdelay, function() {
            simpleEventHandler(ROUND_COMPLETE);
        } );

    }

    function playAnimation(str) {
        switch(str) {
            case 'won':
                TweenMax.set(ball.elm, {left: ballPos[cup1.position], autoAlpha: 1})
                TweenMax.to(ball.elm, 1, {y: -80})
                showMessage('You found it!<br/> Get ready for the next level.')
                break;
            case 'lost':
                TweenMax.set(ball.elm, {left: ballPos[cup1.position], autoAlpha: 1})
                TweenMax.to(ball.elm, 1, {y: -80})
                showMessage("The plant was in another pipe! You made it to level "+gamelevel+".<br/><br/> <button class='small kongtext' onclick='startGame(4)'>Play again!</button>")
                switchtime = 1;
                switchdelay = 1;
                gamelevel = 1;
                numOfRounds = 4;
                break;
        }
    }

    function showMessage(txt) {
        var tl = new TimelineMax();
        if (messages.active) {
            tl.to(messages.elm, 1, {autoAlpha: 0, scale: 0, transformOrigin: "50% 50%"});
        }
        tl.fromTo(messages.elm, 0.3, {autoAlpha: 0, scale: 0, transformOrigin: "50% 50%"}, {autoAlpha: 1, scale: 1, transformOrigin: "50% 50%"});
        messages.elm.childNodes[0].innerHTML = txt;
        messages.active = true;
    }
    function hideMessage() {
        console.log('hide');
        TweenMax.to(messages.elm, 1, {autoAlpha: 0, scale: 0, transformOrigin: "50% 50%"});
        messages.active = false;
    }



(function($) {
    'use strict';
    
      //foundation init
      $(document).foundation();

    //Game init
    initGame();
    
})(jQuery);
