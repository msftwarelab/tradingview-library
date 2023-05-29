import { makeApiRequest, generateSymbol, parseFullSymbol } from "./helpers.js";
import * as Streaming from "./streaming/index.js";
import { RequestQuery } from "./utilities.js";

const market = RequestQuery.market ?? "Bitfinex";
const symbol = RequestQuery.symbol;
const type = RequestQuery.type ?? "crypto";

const pricescale = RequestQuery.pricescale
  ? Number(RequestQuery.pricescale)
  : 100000;

const subscribeOnStream = (
  symbolInfo,
  resolution,
  callBack,
  subscribeUId,
  pmResetCallBack,
  lastDialyBar
) => {
  return Streaming.Binance.subscribeOnStream(
    symbolInfo,
    resolution,
    callBack,
    subscribeUId,
    pmResetCallBack,
    lastDialyBar
  );
};

const unsubscribeFromStream = (subscribeUId) => {
  return Streaming.Binance.unsubscribeFromStream(subscribeUId);
};

const lastBarsCache = new Map();

const configurationData = {
  pricescale: pricescale,
  //   intraday_multipliers: ["15", "480"],
  supported_resolutions: RequestQuery.isPaied=='true'? ["1","5","15","60","4h"]: ["15"],
  volume_precision: 8,
  exchanges: [
    {
      value: market,

      // filter name
      name: market,

      // full exchange name displayed in the filter popup
      desc: market,
    },
  ],
};

export default {
  onReady: (callback) => {
    console.log("[onReady]: Method call");
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback
  ) => {
    onResultReadyCallback([]);
  },

  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    let symbolItem = {
      description: symbol,
      exchange: market,
      full_name: `${market}:${symbol}`,
      symbol: symbol,
      type: type,
    };

    const symbolInfo = {
      ticker: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: configurationData.pricescale,
      has_intraday: true,
      intraday_multipliers: configurationData.intraday_multipliers,
      volume_precision: 8,
      has_no_volume: true,
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      data_status: "streaming",
    };

    console.log("[resolveSymbol]: Symbol resolved", symbolName);
    // onSymbolResolvedCallback(symbolInfo); // Trading View Recommendation
    setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
  },

  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    console.log("[getBars]: Method call", symbolInfo, resolution, from, to);
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);


    var interval = 15;
    var intervalText = '15m';

    if(resolution=="1")
    {
      interval=1;
      intervalText = '1m';
    }
    else if(resolution=="5")
    {
      interval=5;
      intervalText = '5m';
    }
    else if(resolution=="15")
    {
      interval=15;
      intervalText = '15m';
    }
    else if(resolution=="30")
    {
      interval=30;
      intervalText = '30m';
    }
    else if(resolution=="60")
    {
      interval=60;
      intervalText = '1h';
    }
    else if(resolution=="240")
    {
      interval=60*4;
      intervalText = '4h';
    }


    const urlParameters = {
      //e: parsedSymbol.exchange,
      //fsym: parsedSymbol.fromSymbol,
      //tsym: parsedSymbol.toSymbol,
     // endTime: to,
      startTime:to*1000 - interval*1000 * 60 * 301,
      limit: 301,
    };

    
// debugger
    const query = Object.keys(urlParameters)
      .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join("&");
    try {
      //   const data = await makeApiRequest(
      //     `https://tradesignals.app/Home/Data?${query}`
      //   );
      // var result = JSON.parse(data.data);
      // if (!result || result.length === 0) {
      //   // "noData" should be set if there is no data in the requested period.
      //   onHistoryCallback([], {
      // 	noData: true,
      //   });
      //   return;
      // }

      const data = await makeApiRequest(
        `https://api.binance.us/api/v3/klines?symbol=${parsedSymbol.fromSymbol}${parsedSymbol.toSymbol}&interval=${intervalText}&${query}`
      );
      
      if (
        data.length === 0
       
      ) {
        // "noData" should be set if there is no data in the requested period.
        onHistoryCallback([], { noData: true });
        return;
      }

      let bars = [];

      data.forEach((bar) => {
        
        var time = bar[0]
     
        bars = [
          ...bars,
          {
            time: time,
            open: Number(bar[1]),
            high: Number(bar[2]),
            low:Number(bar[3]),
            close: Number(bar[4]),
          },
        ];
      });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      console.log(bars);

      onHistoryCallback(bars, {
        noData: false,
      });
    } catch (error) {
      console.log("[getBars]: Get error", error);
      onErrorCallback(error);
    }
  },

  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    console.log(
      "[subscribeBars]: Method call with subscribeUID:",
      subscribeUID
    );
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.full_name)
    );
  },

  unsubscribeBars: (subscriberUID) => {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    unsubscribeFromStream(subscriberUID);
  },
};
