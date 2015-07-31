// cooking step-by-step instructions 

// invocation name: cooking

//dialog
var RECIPES = {
    "pasta" : ["spaghetti", "onions", "tomato sauce"],
    "omlette" : ["sugar, spice, eggs, milk"],
    "rum and coke" : ["rum, coke"]
}

var PANTRY = [
    "spaghetti", "onions", "sugar", "tomato sauce", "rum", "coke"
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
//     getRecipeIntent(session, response);
};

recipeSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
};

recipeSkill.prototype.intentHandlers = {
    getRecipeIntent: function (intent, session, response) {
        handleGetRecipeIntent(intent, session, response);
    },
    RecipeDetailsIntent: function (intent, session, response) {
        handleGetRecipeDetails(intent, session, response);
    },
    YesNoIntent: function(){}
}

function handleGetRecipeIntent(intent, session, response) {
    var speechOutput = "";
    var repromptSpeech = "";

    speechOutput = " "; 
    response.askWithCard(speechOutput, repromptSpeech, "cooking", speechOutput);
}

//User has chosen recipe
function handleGetRecipeDetails(intent, session, response){
    var speechOutput = "";
    var repromptSpeech = "";
    var orderFromFresh = ""; //start order from fresh intent
    var continueCooking = ""; //start continue cooking intent

    // if (session.attributes.stage === 1){
        var ingredientList = RECIPES[intent.slots.recipe.value];
        var missingIngredients = RECIPES[intent.slots.recipe.value].filter(function(x){ return PANTRY.indexOf(x)<0})

        if (missingIngredients.length > 0 ){
            orderFromFresh = " and you are missing " + missingIngredients.join(" and ") + " ... should I make an amazon fresh order?";
            recipeSkill.prototype.intentHandlers.YesNoIntent = function (intent, session, response){
                var speechOutput = "";
                var yesnoAnswer = intent.slots.yesnoAnswer.value;
                var repromptSpeech = "Sorry, could you repeat that?";
                console.log(recipeSkill.prototype.intentHandlers);
                switch (yesnoAnswer){
                    case "sure":
                    case "yes":
                        speechOutput = " cool, your order has been placed, it will arrive in 2 hours"; // this will have to launch another app, ideally 
                        break
                    case "no":
                        speechOutput = " go die in a fire";
                        break
                }
                response.tellWithCard(speechOutput, repromptSpeech, "dad", speechOutput);
            }            
        } else {
            continueCooking = " ... shall we start cooking?";
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
                response.tellWithCard(speechOutput, repromptSpeech, "dad", speechOutput);
            }
        }

        speechOutput = "Your ingredients are " + ingredientList.join(", ") + orderFromFresh + continueCooking;
        response.askWithCard(speechOutput, "dad", speechOutput);
        console.log("i'm finished asking you first q");
    // }
}

function handleGetAmazonFreshOrder(intent, session, response){
    var speechOutput = "";
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WiseGuy Skill.
    var skill = new recipeSkill();
    skill.execute(event, context);
};
