import { parseFullSymbol } from "../helpers.js";

let parsedSymbol = null;
const channelToSubscription = new Map();

const barHandler = (data) => {
  var message = JSON.parse(data);
  //console.log(message);
  var candlestick = message.k;
  //console.log(candlestick);

  const channelString = `0~${parsedSymbol?.exchange}~${parsedSymbol?.fromSymbol}~${parsedSymbol?.toSymbol}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem === undefined) {
    return;
  }

  const lastDailyBar = subscriptionItem.lastDailyBar;
  const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time);
  const tradeTime = candlestick.t;

  let bar;
  if (tradeTime >= nextDailyBarTime) {
    bar = {
      time: candlestick.t,
      open: Number(candlestick.o),
      high: Number(candlestick.h),
      low: Number(candlestick.l),
      close: Number(candlestick.c),
    };
    console.log("[socket] Generate new bar", bar);
  } else {
    const tradePrice = candlestick.c;
    bar = {
      ...lastDailyBar,
      high: Math.max(lastDailyBar.high, tradePrice),
      low: Math.min(lastDailyBar.low, tradePrice),
      close: Number(tradePrice),
    };
    console.log("[socket] Update the latest bar by price", tradePrice);
  }
  subscriptionItem.lastDailyBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
};

const Subscribe = () => {
  var binanceSocket = new WebSocket(
    `wss://stream.binance.com:9443/ws/${parsedSymbol?.fromSymbol?.toLowerCase()}${parsedSymbol?.toSymbol?.toLowerCase()}@kline_1m`
  );
  binanceSocket.onmessage = function (event) {
    barHandler(event.data);
  };

  window.addEventListener("message", (message) => {
    try {
      barHandler(message);
    } catch (error) {}
  });
};

function getNextDailyBarTime(barTime) {
  const date = new Date(barTime);
  date.setTime(date.getTime() + 15 * 60000);
  return date.getTime();
}

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscribeUID,
  onResetCacheNeededCallback,
  lastDailyBar
) {
  parsedSymbol = parseFullSymbol(symbolInfo.full_name);
  const channelString = `0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
  Subscribe();
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    subscribeUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  };
  channelToSubscription.set(channelString, subscriptionItem);
  console.log(
    "[subscribeBars]: Subscribe to streaming. Channel:",
    channelString
  );
  // binanceSocket.send({ subs: [channelString] });
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler) => handler.id === subscriberUID
    );

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        console.log(
          "[unsubscribeBars]: Unsubscribe from streaming. Channel:",
          channelString
        );
        // binanceSocket.send("SubRemove", { subs: [channelString] });
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}
