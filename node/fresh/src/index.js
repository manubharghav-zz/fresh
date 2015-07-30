// cooking step-by-step instructions 

// invocation name: cooking

//dialog
var recipes = {
    "pasta" : ["spaghetti", "onions", "tomato sauce"]
}


var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var recipeSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
recipeSkill.prototype = Object.create(AlexaSkill.prototype);
recipeSkill.prototype.constructor = recipeSkill;

recipeSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // Any session init logic would go here.
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
recipeSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log(cookingSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getRecipeIntent(session, response);
};

cookingSkill.prototype.intentHandlers = {
    getRecipeIntent: function (intent, session, response) {
        handleGetRecipeIntent(session, response);
    },
}

function handleGetRecipeIntent(intent, session, response) {
    var speechOutput = "";
    var repromptSpeech = "";

    speechOutput = " "; 
    response.askWithCard(speechOutput, repromptSpeech, "cooking", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WiseGuy Skill.
    var skill = new WiseGuySkill();
    skill.execute(event, context);
};
