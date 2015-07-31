// cooking step-by-step instructions 

// invocation name: 

// dialog:
// what cuisine would you like?
// how much time do you have?
// would you like blah blah and blah?

var RECIPES = {
    "italian" : {
        "pasta" : ["spaghetti", "onions", "tomato sauce"]
    },
    "american" : {
        "omelette" : ["eggs", "tomatoes", "onions"],    
        "steak": ["tenderloin, salt, pepper"],
        "rum and coke" : ["rum, coke"]
    }
}

var PANTRY = [
    "spaghetti", "onions", "sugar", "rum", "coke"
]

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
    },
    getRecipeIntent: function (intent, session, response) {
        handleGetRecipeIntent(intent, session, response);
    },
    RecipeDetailsIntent: function (intent, session, response) {
        handleGetRecipeDetails(intent, session, response);
    },
    YesNoIntent: function(intent, session, response){},
    ExitIntent: function(intent, session, response){
        handleExitIntent(intent, session, response);
    }
};

recipeSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
};

function handleRecommendRecipeIntent(session, response) {
    var repromptSpeech = "";
    console.log("handle recommended recipe: " + session.sessionId) 
    var speechOutput = "What cuisine would you like?";
    response.askWithCard(speechOutput, repromptSpeech, "fresh", speechOutput);
}

function handleCuisinePrefIntent(intent, session, response) {
    session.attributes.cuisine = intent.slots.cuisine.value;
    console.log(session.attributes.cuisine);
    var speechOutput = "How much time do you have to cook?";
    response.askWithCard(speechOutput, "", "fresh", speechOutput);    
}

function handleDurationPrefIntent(intent, session, response) {
    session.attributes.duration = intent.slots.duration.value;
    console.log(session.attributes.cuisine);
    console.log(RECIPES[session.attributes.cuisine]);
    var speechOutput = "Would you like " + Object.keys(RECIPES[session.attributes.cuisine]).join(" or ");
    response.askWithCard(speechOutput, "", "fresh", speechOutput);
}

//User has chosen recipe
function handleGetRecipeDetails(intent, session, response){
    var speechOutput = "";
    var repromptSpeech = "";
    var orderFromFresh = ""; //start order from fresh intent
    var continueCooking = ""; //start continue cooking intent

    // if (session.attributes.stage === 1){
        console.log("intent.slots.recipe.value");
        var ingredientList = RECIPES[session.attributes.cuisine][intent.slots.recipe.value];
        var missingIngredients = RECIPES[session.attributes.cuisine][intent.slots.recipe.value].filter(function(x){ return PANTRY.indexOf(x)<0})

        if (missingIngredients.length > 0 ){
            orderFromFresh = " and you are missing " + missingIngredients.join(" and ") + " ... should I make an amazon fresh order?";
            delete recipeSkill.prototype.intentHandlers.YesNoIntent;
            recipeSkill.prototype.intentHandlers.YesNoIntent = function (intent, session, response){
                var speechOutput = "";
                var yesnoAnswer = intent.slots.yesnoAnswer.value;
                var repromptSpeech = "Sorry, could you repeat that?";
                console.log(recipeSkill.prototype.intentHandlers);
                switch (yesnoAnswer){
                    case "sure":
                    case "yes":
                        speechOutput = " cool, your order has been placed, it will arrive before 6 tonight."; // this will have to launch another app, ideally 
                        break
                    case "no":
                        speechOutput = "ok bye ***";
                        break
                }
                response.tellWithCard(speechOutput, repromptSpeech, "fresh", speechOutput);
                delete recipeSkill.prototype.intentHandlers.YesNoIntent;
            }            
        } else {
            continueCooking = " ... shall we start cooking?";
            delete recipeSkill.prototype.intentHandlers.YesNoIntent;
            recipeSkill.prototype.intentHandlers.YesNoIntent = function (intent, session, response){
                var speechOutput = "";
                var yesnoAnswer = intent.slots.yesnoAnswer.value;
                var repromptSpeech = "Sorry, could you repeat that?";
                console.log(recipeSkill.prototype.intentHandlers);
                switch (yesnoAnswer){
                    case "sure":
                    case "yes":
                        speechOutput = "ok ask Anni for instructions"; // this will have to launch another app, ideally 
                        break
                    case "no":
                        speechOutput = "ok hit me up when you're hungry again ... ";
                        break
                }
                response.tellWithCard(speechOutput, repromptSpeech, "fresh", speechOutput);
                delete recipeSkill.prototype.intentHandlers.YesNoIntent;
            }
        }

        speechOutput = "Your ingredients are " + ingredientList.join(", ") + orderFromFresh + continueCooking;
        response.askWithCard(speechOutput, "fresh", speechOutput);
        console.log("i'm finished asking you first q");
}

function handleExitIntent(intent, session, response){
    var speechOutput = "Ok";
    response.tellWithCard(speechOutput, "fresh", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var skill = new recipeSkill();
    skill.execute(event, context);
};
