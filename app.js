"use strict";

let express = require('express');
const bodyparser = require('body-parser');

const { WebhookClient } = require('dialogflow-fulfillment');

//text-to-speech
const textToSpeech = require('@google-cloud/text-to-speech');
// Import other required libraries
const fs = require('fs');
const util = require('util');

//kraken
const krakenAPI = require('./kraken/krakenAPI');
const krakenFormatter = require('./kraken/formatter');
const telegram = require('./kraken/telegramAPI');
const krakenResponses = require('./kraken/krakenResponses');
const images = require('./kraken/images');

//sterrenbeeld-horoscoop
const request = require('request');
const {google} = require('googleapis');

const jwtClient = new google.auth.JWT(
    serviceAccount.client_email, null, serviceAccount.private_key,
    ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
    null
);

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

function getTelegramUserId(agent) {
    return agent.originalRequest.payload.from.id;
}

async function start(agent) {
    let chatId = getTelegramUserId(agent);

    telegram.sendMessage(chatId, "Welcome to Kraken, the number 1 🥇 cryptocurrency exchange out there.");
    await sleep(500);

    telegram.sendGIF(chatId, "https://ethel-dialogflow.s3-eu-west-1.amazonaws.com/telegrambotkraken/number1.gif");
    await sleep(500);

    telegram.sendMessage(chatId, "I will try to help you with whatever you may need. Type / to see a list of our available commands or simply type 'help' 🆘\n");
    await sleep(500);

    agent.add("");
}

async function DFI(agent) {
    if (agent.originalRequest.payload.text === '/help') {
        agent.add("Try these commands: \n\n/biggestlosers - Today's biggest losers 📉\n" +
            "/biggestwinners - Today's biggest winners 📈\n" +
            "/mosttraded - Today's most traded coins\n" +
            "/price - Check the price of your favorite coin\n" +
            "/pricebtc - Check Bitcoin's price\n" +
            "/priceethereum - Check Ethereum's price\n" +
            "/help - Get help\n" + "/kraken - Check out our podcasts or contact support!");
        return;
    }
    let chatId = getTelegramUserId(agent);
    let response = await krakenResponses.getDFIResponse();

    telegram.sendGIF(chatId, response.GIF);
    await sleep(1000);

    telegram.sendMessage(chatId, response.text);


    agent.add("");
}

async function mostVolume(agent) {
    let answer = await krakenAPI.getMostVolume();
    console.log(answer);
    agent.add(answer);
}

async function biggestIncreases(agent) {
    let answer = await krakenAPI.biggestIncrease();
    console.log(answer);
    agent.add(answer);
}

async function biggestDecreases(agent) {
    let answer = await krakenAPI.biggestDecrease();
    console.log(answer);
    agent.add(answer);
}

async function getPriceBtc(agent) {
    let chatId = getTelegramUserId(agent);
    let asset = 'XBT';
    let coinname = krakenAPI.getCoinName('XBT');

    let priceData = await krakenAPI.getPrice(asset);

    let lastPrice = priceData.lastTradeClosedPrice;
    let price = lastPrice.toFixed(2);

    console.log(priceData.percentageIncrease);

    if (priceData.percentageIncrease < -2) {
        telegram.sendGIF(chatId, images.btcGoingDown[0]);
        await sleep(1000);
        telegram.sendMessage(chatId,"It's going down! Bitcoin currently costs $" + price);
    } else if (priceData.percentageIncrease > 2) {
        let response = await krakenResponses.getBTCGoingUpResponse();
        telegram.sendGIF(chatId, response.GIF);
        await sleep(1000);
        telegram.sendMessage(chatId,response.text + "Bitcoin currently costs $" + price);
    } else {
        let response = await krakenResponses.getBTCGoingSideways();
        telegram.sendGIF(chatId, response.GIF);
        await sleep(1000);
        telegram.sendMessage(chatId,"We're going sideways... At least it's better than going down amirite?\nBitcoin currently costs $" + price);
    }

    agent.add("");
}

async function help(agent) {
    console.log("/help");
    agent.add("Try these commands: \n\n/biggestlosers - Today's biggest losers 📉\n" +
        "/biggestwinners - Today's biggest winners 📈\n" +
        "/mosttraded - Today's most traded coins\n" +
        "/price - Check the price of your favorite coin\n" +
        "/pricebtc - Check Bitcoin's price\n" +
        "/priceethereum - Check Ethereum's price\n" +
        "/help - Get help\n" + "/kraken - Check out our podcasts or contact support!");
}

async function getPriceEth(agent) {
    let chatId = getTelegramUserId(agent);
    let asset = 'ETH';
    let coinname = krakenAPI.getCoinName('ETH');

    let response;
    let priceData = await krakenAPI.getPrice(asset);
    let percentageIncrease = priceData.percentageIncrease;
    percentageIncrease = percentageIncrease.toFixed(2);
    let price = krakenFormatter.formatPrice(priceData.lastTradeClosedPrice);

    console.log("unformattedPrice");

    if (percentageIncrease > 2) {
        response = await krakenResponses.getMakingMoneyResponse();
        console.log(response.GIF);
        telegram.sendGIF(chatId, response.GIF);
        await sleep(500);
        agent.add(coinname + " is up " + percentageIncrease.toString() + "% today! 🤑💰\nCurrently valued at " + price.toString());
        return;
    } else {
        if (percentageIncrease < -2) {
            response = await krakenResponses.getLosingMoneyResponse();
            telegram.sendGIF(chatId, response.GIF);
            await sleep(500);
            agent.add(coinname + " is down " + percentageIncrease.toString() + "% today.💰\nCurrently valued at " + price.toString());
            return;
        } else {
            if (percentageIncrease > 0) {
                agent.add(coinname + " is up " + percentageIncrease.toString() + "% today! 🤑💰\nCurrently valued at " + price.toString());
            } else {
                agent.add(coinname + " is down " + percentageIncrease.toString() + "% today.💰\nCurrently valued at " + price.toString());
            }
        }
    }
}

async function getPrice(agent) {
    let asset;
    let coinname;
    let parameters;
    let chatId = getTelegramUserId(agent);

    if (agent.parameters.crypto !== undefined && agent.parameters.crypto !== ''){
        parameters = agent.parameters;
        asset = parameters.crypto;
        coinname = krakenAPI.getCoinName(asset);
    } else {
        agent.add("Which coin would you like the get the price of?");
        return;
    }

    let response;
    let priceData = await krakenAPI.getPrice(asset);
    let percentageIncrease = priceData.percentageIncrease;
    percentageIncrease = percentageIncrease.toFixed(2);
    let price = krakenFormatter.formatPrice(priceData.lastTradeClosedPrice);

    console.log("unformattedPrice");

    if (percentageIncrease > 2) {
        response = await krakenResponses.getMakingMoneyResponse();
        console.log(response.GIF);
        telegram.sendGIF(chatId, response.GIF);
        await sleep(500);
        agent.add(coinname + " is up " + percentageIncrease.toString() + "% today! 🤑💰\nCurrently valued at " + price.toString());
        return;
    } else {
        if (percentageIncrease < -2) {
            response = await krakenResponses.getLosingMoneyResponse();
            telegram.sendGIF(chatId, response.GIF);
            await sleep(500);
            agent.add(coinname + " is down " + percentageIncrease.toString() + "% today.💰\nCurrently valued at " + price.toString());
            return;
        } else {
            if (percentageIncrease > 0) {
                agent.add(coinname + " is up " + percentageIncrease.toString() + "% today! 🤑💰\nCurrently valued at " + price.toString());
            } else {
                agent.add(coinname + " is down " + percentageIncrease.toString() + "% today.💰\nCurrently valued at " + price.toString());
            }
        }
    }
}

function WebhookProcessing(req, res) {
    const agent = new WebhookClient({request: req, response: res});

    let intentMap = new Map();
    intentMap.set('getPrice', getPrice);
    intentMap.set('mostVolume', mostVolume);
    intentMap.set('biggestIncreases', biggestIncreases);
    intentMap.set('biggestDecreases', biggestDecreases);
    intentMap.set('getPrice.btc', getPriceBtc);
    intentMap.set('getPrice.eth', getPriceEth);
    intentMap.set('start', start);
    intentMap.set('Default Fallback Intent', DFI);
    intentMap.set('help', help);
    intentMap.set('buy', buy);

    agent.handleRequest(intentMap);
}

app.post('/', function (req, res) {
    WebhookProcessing(req, res);
});


app.get('/kraken/getPrice', async function(req, res) {
    let bitcoinPrice = await krakenAPI.getPrice('XBT');

    res.send("OK");
});

app.get('/kraken/getAllPrices', async function(req, res) {
    let bitcoinPrice = await krakenAPI.getPrices();
    res.send("OK");
});

app.get('/kraken/getInfo', async function(req, res) {
    let info = await krakenAPI.getInfo();
    res.send("OK");
});

function sleep(ms){
    console.log("gonna sleep");
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}



let port = process.env.PORT || 5555;
app.listen(port, () => console.log(`App running on port ${port}`));