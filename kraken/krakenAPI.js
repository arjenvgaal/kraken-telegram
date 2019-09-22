const kraken = require('kraken-api');
const constants = require('./krakenConstants');


const krakenAPI = new kraken();

exports.getPrices = async function(asset) {
    console.log("getting price for asset: " + asset);

    let priceData = await krakenAPI.api('Ticker', {pair: 'XXBTZUSD,XETHZUSD, XREPZUSD, BATUSD, BCHUSD,ADAUSD, ATOMUSD, DASHUSD, EOSUSD, XETCZUSD,GNOUSD,ICXUSD,LTCUSD,XXMRZUSD,QTUMUSD,XXRPZUSD,XXLMZUSD,USDTZUSD,XTZUSD,WAVESUSD,XZECZUSD'});
    console.log(priceData);
    return convertPriceData(priceData);
};

exports.getPrice = async function(asset) {
    console.log("getting price for asset: " + asset);
    let pair = getTicker(asset);
    console.log("ticker = " + pair);
    let priceData = await krakenAPI.api('Ticker', {pair: pair});
    return convertPriceData(priceData, pair);
};

exports.biggestIncrease = async function() {
    let data = await krakenAPI.api('Ticker', {pair: 'XXBTZUSD,XETHZUSD, XREPZUSD, BATUSD, BCHUSD,ADAUSD, ATOMUSD, DASHUSD, EOSUSD, XETCZUSD,GNOUSD,ICXUSD,LTCUSD,XXMRZUSD,QTUMUSD,XXRPZUSD,XXLMZUSD,USDTZUSD,XTZUSD,WAVESUSD,XZECZUSD'});
    let coins = data.result;

    let mostVolume;
    let volumes = [];
    let difference = 0;
    let percentageUp = 0;
    for (var coin in coins) {
        percentageUp = (parseFloat(coins[coin].c[0]) - parseFloat(coins[coin].o)) / parseFloat(coins[coin].o);
        percentageUp *= 100;
        percentageUp = percentageUp.toFixed(2);

        console.log(parseFloat(percentageUp));
        difference = parseFloat(coins[coin].c[0]) - parseFloat(coins[coin].o);
        volumes.push([coin, percentageUp])
    }

    volumes.sort(function(a, b) {
        return b[1] - a[1]
    });

    console.log(volumes.length);
    let volumeString = "Coins that increased the most since price open today (00:00:00 UTC) 👇\n\n";
    for (var i = 0; i < 10; i++) {
        let percentage = volumes[i][1];
        if (percentage > 0) {
            volumeString += "#" + (i + 1) + "📈 " + this.getTickerByPair(volumes[i][0]) + " => +" + volumes[i][1] + "%";
        } else {
            volumeString += "# " + (i + 1) + "📉 " + this.getTickerByPair(volumes[i][0]) + " => " + volumes[i][1] + "%";
        }
        volumeString += "\n";
    }
    return volumeString;
};

exports.biggestDecrease = async function() {
    let data = await krakenAPI.api('Ticker', {pair: 'XXBTZUSD,XETHZUSD, XREPZUSD, BATUSD, BCHUSD,ADAUSD, ATOMUSD, DASHUSD, EOSUSD, XETCZUSD,GNOUSD,ICXUSD,LTCUSD,XXMRZUSD,QTUMUSD,XXRPZUSD,XXLMZUSD,USDTZUSD,XTZUSD,WAVESUSD,XZECZUSD'});
    let coins = data.result;

    let mostVolume;
    let volumes = [];
    let difference = 0;
    let percentageUp = 0;
    for (var coin in coins) {
        percentageUp = (parseFloat(coins[coin].c[0]) - parseFloat(coins[coin].o)) / parseFloat(coins[coin].o);
        percentageUp *= 100;
        percentageUp = percentageUp.toFixed(2);

        console.log(parseFloat(percentageUp));
        difference = parseFloat(coins[coin].c[0]) - parseFloat(coins[coin].o);
        volumes.push([coin, percentageUp])
    }

    volumes.sort(function(a, b) {
        return a[1] - b[1]
    });

    console.log(volumes.length);
    let volumeString = "Coins that decreased the most since price open today (00:00:00 UTC) 👇\n\n";
    for (var i = 0; i < 10; i++) {
        let percentage = volumes[i][1];
        if (percentage > 0) {
            volumeString += "#" + (i + 1) + "📈 " + this.getTickerByPair(volumes[i][0]) + " => +" + volumes[i][1] + "%";
        } else {
            volumeString += "# " + (i + 1) + "📉 " + this.getTickerByPair(volumes[i][0]) + " => " + volumes[i][1] + "%";
        }
        volumeString += "\n";
    }
    return volumeString;
};

exports.getMostVolume = async function() {
    let data = await krakenAPI.api('Ticker', {pair: 'XXBTZUSD,XETHZUSD, XREPZUSD, BATUSD, BCHUSD,ADAUSD, ATOMUSD, DASHUSD, EOSUSD, XETCZUSD,GNOUSD,ICXUSD,LTCUSD,XXMRZUSD,QTUMUSD,XXRPZUSD,XXLMZUSD,USDTZUSD,XTZUSD,WAVESUSD,XZECZUSD'});
    let coins = data.result;

    let volumes = [];

    for (var coin in coins) {
        volumes.push([coin, parseInt(coins[coin].v[0]) ])
    }

    volumes.sort(function(a, b) {
        return b[1] - a[1]
    });

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    let volumeString = "Top 10 coins by volume in the last 24H 👇\n\n";
    for (var i = 0; i < 10; i++) {
        let percentage = volumes[i][1];
        volumeString += "#" + (i + 1) + " " + this.getTickerByPair(volumes[i][0])+ " => " + formatter.format(volumes[i][1]);
        volumeString += '\n';
    }
    return volumeString;
};

exports.getInfo = async function() {
    let info = await krakenAPI.api('AssetPairs', {info: 'LTCUSD'});
    console.log(info);
};



exports.getCoinName = function(asset) {
    switch (asset) {
        case 'XBT':
            return constants.coinname.XBT;
        case 'ETH':
            return constants.coinname.ETH;
        case 'REP':
            return constants.coinname.REP;
        case 'BAT':
            return constants.coinname.BAT;
        case 'BCH':
            return constants.coinname.BCH;
        case 'ADA':
            return constants.coinname.ADA;
        case 'ATOM':
            return constants.coinname.ATOM;
        case 'DASH':
            return constants.coinname.DASH;
        case 'EOS':
            return constants.coinname.EOS;
        case 'ETC':
            return constants.coinname.ETC;
        case 'GNO':
            return constants.coinname.GNO;
        case 'ICX':
            return constants.coinname.ICX;
        case 'LTC':
            return constants.coinname.LTC;
        case 'XMR':
            return constants.coinname.XMR;
        case 'QTUM':
            return constants.coinname.QTUM;
        case 'XRP':
            return constants.coinname.XRP;
        case 'XLM':
            return constants.coinname.XLM;
        case 'USDT':
            return constants.coinname.USDT;
        case 'XTZ':
            return constants.coinname.XTZ;
        case 'WAVES':
            return constants.coinname.WAVES;
        case 'ZEC':
            return constants.coinname.ZEC;
    }
};

function convertPriceData(priceData, ticker) {
    let aData = priceData.result[ticker];
    console.log(aData);
    let data = {
        askPrice: parseFloat(aData.a[0]),
        bidPrice: parseFloat(aData.b[0]),
        lastTradeClosedPrice: parseFloat(aData.c[0]),
        volumeToday: parseFloat(aData.v[0]),
        volume24H: parseFloat(aData.v[1]),
        volumeWeightedAveragePriceToday: parseFloat(aData.p[0]),
        volumeWeightedAveragePrice24H: parseFloat(aData.p[1]),
        numberOfTradesToday: parseFloat(aData.t[0]),
        numberOfTrades24H: parseFloat(aData.t[1]),
        lowPrice: parseFloat(aData.l[0]),
        highPrice: parseFloat(aData.h[0]),
        openPrice: parseFloat(aData.o),
        percentageIncrease: (parseFloat(aData.c[0]) - parseFloat(aData.o)) / parseFloat(aData.o) * 100
    };
    return data;
}

function getTicker(asset) {
    switch (asset) {
        case 'XBT':
            return constants.pairs.XBT;
        case 'ETH':
            return constants.pairs.ETH;
        case 'REP':
            return constants.pairs.REP;
        case 'BAT':
            return constants.pairs.BAT;
        case 'BCH':
            return constants.pairs.BCH;
        case 'ADA':
            return constants.pairs.ADA;
        case 'ATOM':
            return constants.pairs.ATOM;
        case 'DASH':
            return constants.pairs.DASH;
        case 'EOS':
            return constants.pairs.EOS;
        case 'ETC':
            return constants.pairs.ETC;
        case 'GNO':
            return constants.pairs.GNO;
        case 'ICX':
            return constants.pairs.ICX;
        case 'LTC':
            return constants.pairs.LTC;
        case 'XMR':
            return constants.pairs.XMR;
        case 'QTUM':
            return constants.pairs.QTUM;
        case 'XRP':
            return constants.pairs.XRP;
        case 'XLM':
            return constants.pairs.XLM;
        case 'USDT':
            return constants.pairs.USDT;
        case 'XTZ':
            return constants.pairs.XTZ;
        case 'WAVES':
            return constants.pairs.WAVES;
        case 'ZEC':
            return constants.pairs.ZEC;
    }
}

exports.getTickerByPair = function(asset) {
    console.log("getting tickerByPair for asset: " + asset);
    switch (asset) {
        case 'XXBTZUSD':
            return constants.bypair.XXBTZUSD;
        case 'XETHZUSD':
            return constants.bypair.XETHZUSD;
        case 'XREPZUSD':
            return constants.bypair.XREPZUSD;
        case 'BATUSD':
            return constants.bypair.BATUSD;
        case 'BCHUSD':
            return constants.bypair.BCHUSD;
        case 'ADAUSD':
            return constants.bypair.ADAUSD;
        case 'ATOMUSD':
            return constants.bypair.ATOMUSD;
        case 'DASHUSD':
            return constants.bypair.DASHUSD;
        case 'EOSUSD':
            return constants.bypair.EOSUSD;
        case 'XETCZUSD':
            return constants.bypair.XETCZUSD;
        case 'GNOUSD':
            return constants.bypair.GNOUSD;
        case 'ICXUSD':
            return constants.bypair.ICXUSD;
        case 'XLTCZUSD':
            return constants.bypair.XLTCZUSD;
        case 'XXMRZUSD':
            return constants.bypair.XXMRZUSD;
        case 'QTUMUSD':
            return constants.bypair.QTUMUSD;
        case 'XXRPZUSD':
            return constants.bypair.XXRPZUSD;
        case 'XXLMZUSD':
            return constants.bypair.XXLMZUSD;
        case 'USDTZUSD':
            return constants.bypair.USDTZUSD;
        case 'XTZUSD':
            return constants.bypair.XTZUSD;
        case 'WAVESUSD':
            return constants.bypair.WAVESUSD;
        case 'XZECZUSD':
            return constants.bypair.XZECZUSD;
    }
}