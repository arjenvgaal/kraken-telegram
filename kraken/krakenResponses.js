const images = require('./images');

exports.getDFIResponse = async function() {

    let random = generateRandom(11);
    console.log("generated => ");
    console.log(random);
    let response = {
        text: "",
        GIF: ""
    };

    switch (random){
        case 0:
            response.text = "Uhhhh I didn't quite get that. Try rephrasing that or use our commands '/'.";
            response.GIF = images.wut[random];
            return response;
        case 1:
            response.text = "Bruh... I suggest you use our commands instead by starting with '/'";
            response.GIF = images.wut[random];
            return response;
        case 2:
            response.text = "What the hell.. Check out our fancy commands by typing '/'";
            response.GIF = images.wut[random];
            return response;
        case 3:
            response.text = "This is awkward... You can check the price of any supported coin like this 👇\n'Price EOS'";
            response.GIF = images.wut[random];
            return response;
        case 4:
            response.text = "Omg can you try again? I didn't get that..";
            response.GIF = images.wut[random];
            return response;
        case 5:
            response.text = ".....";
            response.GIF = images.wut[random];
            return response;
        case 6:
            response.text = "What in the hell was that about..?\n\nDid you know you can check our most traded coins by typing 'most traded'?";
            response.GIF = images.wut[random];
            return response;
        case 7:
            response.text = "Mmmhhh.. Can you maybe try again?";
            response.GIF = images.wut[random];
            return response;
        case 8:
            response.text = "What? 😅";
            response.GIF = images.wut[random];
            return response;
        case 9:
            response.text = "Failure 🤖. Try again";
            response.GIF = images.wut[random];
            return response;
        case 10:
            response.text = "I jusht didn0t get whuat yu ment bai thet";
            response.GIF = images.wut[random];
            return response;
        case 11:
            response.text = "Awkwaaaard. Perhaps you should try out our commands by typing /";
            response.GIF = images.wut[random];
            return response;
    }
};

exports.getMakingMoneyResponse = async function() {
    let random = generateRandom(9);
    console.log("generated => ");
    console.log(random);
    let response = {
        text: "",
        GIF: ""
    };

    switch (random){
        case 0:
            response.GIF = images.makingMoney[random];
            return response;
        case 1:
            response.GIF = images.makingMoney[random];
            return response;
        case 2:
            response.GIF = images.makingMoney[random];
            return response;
        case 3:
            response.GIF = images.makingMoney[random];
            return response;
        case 4:
            response.GIF = images.makingMoney[random];
            return response;
        case 5:
            response.GIF = images.makingMoney[random];
            return response;
        case 6:
            response.GIF = images.makingMoney[random];
            return response;
        case 7:
            response.GIF = images.makingMoney[random];
            return response;
        case 8:
            response.GIF = images.makingMoney[random];
            return response;
        case 9:
            response.GIF = images.makingMoney[random];
            return response;
    }
};

exports.getLosingMoneyResponse = async function() {
    let random = generateRandom(1);
    console.log("generated => ");
    console.log(random);
    let response = {
        text: "",
        GIF: ""
    };

    switch (random){
        case 0:
            response.GIF = images.losingMoney[random];
            return response;
        case 1:
            response.GIF = images.losingMoney[random];
            return response;
    }
};

exports.getBTCGoingUpResponse = async function() {
    let response = {
        text: "We're going up baby! 🤑\n",
        GIF: images.btcGoingUp[0]
    };

    return response;
};

exports.getBTCGoingSideways = async function() {
    let random = generateRandom(1);
    console.log(random);

    let response = {
        text: "We're going up baby! 🤑\n",
        response: ''
    };

    switch (random) {
        case 0:
            response.GIF = images.btcGoingSideways[0];
            return response;
        case 1:
            response.GIF = images.btcGoingSideways[1];
            return response;
    }
};

function generateRandom(max) {
    return Math.floor((Math.random() * max));
}