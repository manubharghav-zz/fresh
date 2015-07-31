// cooking step-by-step instructions 

// invocation name: 

// dialog:
// what cuisine would you like?
// how much time do you have?
// would you like blah blah and blah?

var recipes = {
    "pasta" : ["spaghetti", "onions", "tomato sauce"],
    "omelette" : ["eggs", "tomates", "onions"],
    "steak": ["meat"],
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
    console.log("cookingSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleRecommendRecipeIntent(session, response);
};

recipeSkill.prototype.intentHandlers = {
    RecommendRecipeIntent: function (intent, session, response) {
        handleRecommendRecipeIntent(session, response);
    },
    CuisinePrefIntent: function(intent, session, response) {
        handleCuisinePrefIntent(intent, session, response);
    },
    DurationPrefIntent: function(intent, session, response) {
        handleDurationPrefIntent(intent, session, response);
    }
}


function handleRecommendRecipeIntent(session, response) {
    var repromptSpeech = "";
    console.log("handle recommended recipe: " + session.sessionId) 
    var speechOutput = "What cuisine would you like?";
    response.askWithCard(speechOutput, repromptSpeech, "fresh", speechOutput);
}

function handleCuisinePrefIntent(intent, session, response) {
    session.attributes.cuisine = intent.slots.cuisine;
    var speechOutput = "How much time do you have to cook?";
    response.askWithCard(speechOutput, "", "fresh", speechOutput);    
}

function handleDurationPrefIntent(intent, session, response) {
    session.attributes.duration = intent.slots.duration;
    var speechOutput = "Would you like " + Object.keys(recipes).join(" or ");
    response.askWithCard(speechOutput, "", "fresh", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the cooking Skill.
    var skill = new recipeSkill();
    skill.execute(event, context);
};
