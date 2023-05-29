// Datafeed implementation, will be added later
import Datafeed from "./datafeed.js";
import { RequestQuery } from "./utilities.js";

let indicator1_id = null;

window.tvWidget = new TradingView.widget({
	symbol: `${RequestQuery.market}:${RequestQuery.symbol}`, // default symbol
	//   debug: true,
	fullscreen: true, // displays the chart in the fullscreen mode
	container: "tv_chart_container",
	datafeed: Datafeed,
	library_path: "../charting_library_clonned_data/charting_library/",
	autosize: true,

	//symbol: `${RequestQuery.market}:${RequestQuery.symbol}`, // default symbol
	interval: RequestQuery.interval ?? "15", // default interval
	theme: "dark",
	hide_legend: true,
	hide_top_toolbar: true,
	enable_publishing: false,
	...RequestQuery,
	disabled_features: [
		//  "header_widget",
		//  "left_toolbar",
		// "control_bar",
		"timeframes_toolbar",
		//"items_favoriting"
	],
	enabled_features: ["hide_left_toolbar_by_default"],
	favorites: {
		intervals: RequestQuery.isPaied == 'true' ? ["1", "5", "15", "60", "4h"] : ["15"]
	},
	allow_symbol_change: false,
	isUserEditEnabled: true,
	locale: "en",
	style: "1",
	timezone: "Etc/UTC",
	timeframe: "45",
	time_frames: [],
	overrides: {
		"mainSeriesProperties.haStyle.drawWick": true,
		"mainSeriesProperties.haStyle.drawBorder": true,
		"mainSeriesProperties.haStyle.drawBody": true,
		"paneProperties.legendProperties.showStudyTitles": false,
		"paneProperties.legendProperties.showStudyArguments": false,
		"paneProperties.legendProperties.showStudyValues": false
	},

	//   custom indicators

	custom_indicators_getter: function (PineJS) {
		return Promise.resolve([

			// start of my own


			{
				name: "SWING TRADE SIGNALS",
				metainfo: {
					_metainfoVersion: 51,

					id: "SWINGTRADESIGNALS@tv-basicstudies-1",

					name: "SWINGTRADESIGNALS",
					description: "Cryptosignals app",
					shortDescription: "Cryptosignals app",
					scriptIdPart: "",
					is_price_study: true,
					is_hidden_study: false,
					isCustomIndicator: true,
					linkedToSeries: true,

					isTVScript: false,
					isTVScriptStub: false,

					format: {
						type: 'price',
						precision: 4,
					},

					defaults: {
						precision: 4,
						palettes: {
							palette_0: {
								// palette colors
								// change it to the default colors that you prefer,
								// but note that the user can change them in the Style tab
								// of indicator properties
								colors: [
									{ color: "#FFFF00" },
									{ color: "#0000FF" }
								]
							},
							palette_1: {
								// palette colors
								// change it to the default colors that you prefer,
								// but note that the user can change them in the Style tab
								// of indicator properties
								colors: [
									{ color: "green" },
									{ color: "red" }
								]
							},
							palette_bar: {
								colors: [
									{ color: 'green', width: 1, style: 0 },
									{ color: 'red', width: 1, style: 0 },
								],
							},
						},
						inputs: {
							ema_value: 5,
							sma_value: 50,
							overbought_limit_of_rsi: 80,
							oversold_limit_of_rsi: 20
						},
						ohlcPlots: {
							plot_candle: {
								borderColor: '#000000',
								color: '#000000',
								drawBorder: true,
								drawWick: true,
								plottype: 'ohlc_candles',
								visible: true,
								wickColor: '#000000',
							},
						},
					},
					plots: [
						{
							id: "plot_0",
							type: "line"
						}
						,
						{
							id: "plot_1",
							type: "line",

						}
						,
						{
							id: "plot_2",
							type: "shapes",

						}
						,
						{
							id: "plot_3",
							type: "shapes",

						}
						,
						{
							id: "plot_6",
							type: "line",

						}
						,
						{
							id: "plot_7",
							type: "line",

						},
						{
							id: "plot_38",
							type: "line",

						},
						// {
						// 	id: "plot_39",

						// 	// plot type should be set to 'bar_colorer'
						// 	type: "bar_colorer",
						// 	palette: "palette_1"
						// },
						// {
						// 	id: "plot_40", 
						// 	type: "border_colorer", 
						// 	palette: "palette_1"
						// },
						// {
						// 	id: "plot_41", 
						// 	type: "wick_colorer", 
						// 	palette: "palette_1"
						// },

						{
							id: 'plot_open',
							type: 'ohlc_open',
							target: 'plot_candle',
						},
						{
							id: 'plot_high',
							type: 'ohlc_high',
							target: 'plot_candle',
						},
						{
							id: 'plot_low',
							type: 'ohlc_low',
							target: 'plot_candle',
						},
						{
							id: 'plot_close',
							type: 'ohlc_close',
							target: 'plot_candle',
						},
						{
							id: 'plot_bar_color',
							type: 'ohlc_colorer',
							palette: 'palette_bar',
							target: 'plot_candle',
						},
						{
							id: 'plot_wick_color',
							type: 'wick_colorer',
							palette: 'palette_1',
							target: 'plot_candle',
						},
						{
							id: 'plot_border_color',
							type: 'border_colorer',
							palette: 'palette_1',
							target: 'plot_candle',
						},

					],
					palettes: {
						palette_0: {
							colors: [
								{ name: "Color 0" },
								{ name: "Color 1" }
							],

							// the mapping between the values that
							// are returned by the script and palette colors
							valToIndex: {
								100: 0,
								200: 1
							}
						},
						palette_1: {
							colors: [
								{ name: "Color 0" },
								{ name: "Color 1" }
							],

							// the mapping between the values that
							// are returned by the script and palette colors
							valToIndex: {
								300: 0,
								400: 1
							}
						},
						palette_bar: {
							colors: [{ name: 'Colour One' }, { name: 'Colour Two' }],

							valToIndex: {
								300: 0,
								400: 1,
							},
						},
					},
					ohlcPlots: {
						plot_candle: {
							title: 'Candles',
						}
					},
					styles: {
						plot_0: {
							title: "Long SMA",
							histogramBase: 0,
							joinPoints: 0,
							color: "#FFEB3B"

						},
						// plot_0 :{

						// },
						plot_1: {
							title: "Long SMA",
							histogramBase: 0,
							joinPoints: 0,
							color: "#00E676"

						},
						plot_2: {
							title: "BuyShape",
							linestyle: 0,
							linewidth: 20,
							plottype: "shape_label_up",
							text: "B",
							trackPrice: !1,
							location: "BelowBar",
							transparency: 0,
							visible: !0,
							color: "#00BCD4",
							textColor: "#FFFFFF",
						},
						plot_3: {
							title: "SellShape",
							linestyle: 0,
							linewidth: 20,
							plottype: "shape_label_down",
							text: "S",
							trackPrice: !1,
							location: "AboveBar",
							transparency: 0,
							visible: !0,
							color: "#FF5252",
							textColor: "#363A45",
						},

						plot_6: {
							title: "Long SMA",
							histogramBase: 0,
							joinPoints: 0,
							color: "#FF5252"

						},
						plot_7: {
							title: "Long SMA",
							histogramBase: 0,
							joinPoints: 0,
							color: "#FFEB3B"

						},
						plot_38: {
							title: "Long SMA",
							histogramBase: 0,
							joinPoints: 0,
							color: "#FFEB3B"

						},

					},
					inputs: [
						{
							id: "ema_value",
							name: "Ema_value",
							defval: 5,
							type: "integer",
							min: 1,
							max: 1e4
						},

						{
							id: "sma_value",
							name: "Sma_value",
							defval: 50,
							type: "integer",
							min: 1,
							max: 1e4
						},

						{
							id: "overbought_limit_of_rsi",
							name: "Overbought limit of RSI",
							defval: 80,
							type: "integer",
							min: 1,
							max: 1e4
						},

						{
							id: "oversold_limit_of_rsi",
							name: "Oversold limit of RSI",
							defval: 20,
							type: "integer",
							min: 1,
							max: 1e4
						}

					],
				},
				constructor: function () {

					this.bar_color = 0;
					this.is_green = false;
					this.is_green_1 = false;
					this.is_red = false;
					this.is_red_1 = false;
					this.my_color = null;
					this.signal = null; // Variable to store the current signal (buy/sell)

					this.toggleSignal = function () {
						if (this.signal === "buy") {
							this.signal = "sell";
							this.bar_color = 400; // Set the color for sell signal
						} else if (this.signal === "sell") {
							this.signal = "buy";
							this.bar_color = 300; // Set the color for buy signal
						}
					};
					this.my_rma_using_buildin = function (source, length, context) {

						return PineJS.Std.rma(source, length, context)

					},


						this.my_sma = function (source, length, context) {

							return source.length;



							var sum = 0.0;


							for (let i = 0; i < length; i++) {
								sum = sum + source[i] / length;

							}

							return sum;




						},



						this.my_rma = function (source, length, context) {

							var alpha = 1 / length;

							sum = 0.0;





						},

						this.my_rsi = function (source, length, context) {




							var u = context.new_var(PineJS.Std.max(PineJS.Std.change(source), 0));
							var d = context.new_var(-PineJS.Std.min(PineJS.Std.change(source), 0));

							var rs = PineJS.Std.rma(u, length, context) / PineJS.Std.rma(d, length, context);

							var res = 100 - 100 / (1 + rs);

							return res;
						},


						this.main = function (context, input) {

							this._context = context;
							this._input = input;

							var valueForColor0 = 100;
							var valueForColor1 = 200;
							this.toggleSignal();
							// perform your calculations here and return one of the constants
							// that is specified as a key in 'valToIndex' mapping
							//var result =Math.random() * 100 % 2 > 1 ? // we randomly select one of the color values
							//		valueForColor0 : valueForColor1;

							//var i = s.Std["close"](this._context);
							var open_price = PineJS.Std.open(this._context);
							var close_price = PineJS.Std.close(this._context);
							var high_price = PineJS.Std.high(this._context);
							var low_price = PineJS.Std.low(this._context);

							var close_price_series = this._context.new_var(close_price);
							var high_price_series = this._context.new_var(high_price);
							var low_price_series = this._context.new_var(low_price);
							var open_price_series = this._context.new_var(open_price);

							/*var inputValue0_ema_value = this._input(0);
							var inputValue1_sma_value = this._input(1);
							var inputValue2_hl_value = this._input(2);
							var inputValue3_ll_value = this._input(3);
						   
							
				
							var indicator_ema = PineJS.Std.ema(close_price_series, inputValue0_ema_value,    this._context );
							
							var indicator_sma = PineJS.Std.sma(close_price_series, inputValue1_sma_value,    this._context );
				
							
							var indicator_ema_series = this._context.new_var(indicator_ema);
							var indicator_sma_series = this._context.new_var(indicator_sma);
							 
						
							var rsi_14 = 14;
							var rsi_14_series = this._context.new_var(rsi_14);
							
							//var indicator_rs = PineJS.Std.rsi(close_price_series, 14,    this._context );
							
							
							var ttt = close_price_series.get(10);
							//var buyexit= 
							
							
							var inputValue2_hl_value_series = this._context.new_var(inputValue2_hl_value);
							
							//var if_cross = PineJS.Std.cross(indicator_ema, indicator_sma,  this._context);
							
							//var if_cross_series = this._context.new_var(if_cross);
							
							//return [if_cross_series];
							
							var indicator_ema_series = this._context.new_var(indicator_ema);
							
							//var plot_my_rma= this.my_rma(close_price_series, 14, this._context );
							
							//var plot_my_rsi = this.my_rsi(close_price_series, 14, this._context );
							
							
							 var close_price_array = [];
							 
							 for ( let i= 0; i<200;i++)
							 {
								
								close_price_array[i] = close_price_series.get(i) ; 
				
							 }
					
							//var plot_my_sma = this.my_sma(close_price_array, 14, this._context );
							//var std_sma = PineJS.Std.sma(close_price_series, 14,    this._context );
							
							var std_rma =   PineJS.Std.rma(close_price_series, 14, context);
							var std_rsi =   PineJS.Std.rsi(close_price_series, 14, context);
							var plot_my_rsi = this.my_rsi(close_price_series, 14, context);
							var plot_my_rsi_series = this._context.new_var(plot_my_rsi);
							
							var buyexit = plot_my_rsi_series.get(1) > inputValue2_hl_value && plot_my_rsi_series.get(0) < inputValue2_hl_value;
							var sellexit = plot_my_rsi_series.get(1) < inputValue3_ll_value &&  plot_my_rsi_series.get(0) > inputValue3_ll_value;
				
							var bull_color = 300;
							var bear_color = 400;
							
							var iff_1 = high_price_series.get(0) < indicator_sma_series.get(0) ? bear_color : this.my_color;
							var iff_2 = low_price_series.get(0) > indicator_sma_series.get(0) ? bull_color : iff_1;
							this.my_color = plot_my_rsi_series.get(0) >= 85 || plot_my_rsi_series.get(0) <= 15 ? this.my_color : iff_2;
				
							this.is_green_1 = this.is_green;
							this.is_green = this.my_color == bull_color;
							this.is_red_1 = this.is_red;
							this.is_red = this.my_color == bear_color;
				
							var is_new_green = ! this.is_green_1 && this.is_green;
							var is_new_red = ! this.is_red_1 && this.is_red;
				
							var buycall = is_new_green;
							var sellcall = is_new_red;
				
							// var sellcall = indicator_sma_series.get(1) < indicator_ema_series.get(1) && indicator_sma_series.get(0) > indicator_ema_series.get(0)
							// 	&&   PineJS.Std.open(this._context) >  PineJS.Std.close(this._context);
							
							// var buycall = indicator_sma_series.get(1) > indicator_ema_series.get(1) && indicator_sma_series.get(0) < indicator_ema_series.get(0)
							// 	&&  PineJS.Std.high(this._context) > indicator_sma_series.get(0);
							
							var plot_sma_segment = 0;
							
							if ( plot_my_rsi >= 85 || plot_my_rsi <= 15)
							{
								 plot_sma_segment = 0;
								
							}
							else if (PineJS.Std.low(this._context)  > indicator_sma)
							{
								plot_sma_segment = 1;
								
							}
							else if ( PineJS.Std.high(this._context)  < indicator_sma  )
							{
								plot_sma_segment = 2;
							}
							else{
								plot_sma_segment = 3;
							}*/
							let highestValue = 0;
							let highestIndex = 0;
							for (let c = 0; c < 20; c++) {
								if (highestValue < high_price_series.get(c)) {
									highestValue = high_price_series.get(c);
									highestIndex = c;
								}

							}

							let lowestValue = 9999999;
							let lowestIndex = 0;
							for (let c = 0; c < 20; c++) {
								if (lowestValue > low_price_series.get(c)) {
									lowestValue = low_price_series.get(c);
									lowestIndex = c;
								}

							}

							var buycall = lowestIndex == 0 ? 400 : null;
							var sellcall = highestIndex == 0 ? 300 : null;

							if (buycall)
								this.bar_color = 300

							if (sellcall)
								this.bar_color = 400

							// Determine the signal based on the toggle variable
							if (this.signal === "buy") {
								buycall = highestIndex == 0 ? 300 : null;
							} else if (this.signal === "sell") {
								sellcall = lowestIndex == 0 ? 400 : null;
							}
							// return [plot_sma_segment == 0 ? indicator_sma : null ,
							// 	plot_sma_segment == 1 ? indicator_sma : null ,

							// console.log(open_price);
							//console.log(buycall , " " , new Date(PineJS.Std.time(this._context)) +  "Low "+ PineJS.Std.lowestbars(low_price_series, 20,this._context));
							return [null,
								null,
								buycall ? PineJS.Std.low(this._context) : null,
								sellcall ? PineJS.Std.high(this._context) : null,
								// plot_sma_segment == 2 ? indicator_sma : null, 
								// plot_sma_segment == 3 ? indicator_sma : null,
								null,
								null,
								null,
								open_price,
								high_price,
								low_price,
								close_price,
								this.bar_color /*bar*/,
								this.bar_color /*wick*/,
								this.bar_color /*border*/
							];//PineJS.Std.low(this._context) : null ];



							//return [plot_my_rsi, plot_my_rsi];

							//return [indicator_ema_series.get(3), indicator_ema];
							//return [ {value:  PineJS.Std.ema(o, inputValue0_ema_value,    this._context ), offset: 1 }   ];
						}
				}
			},

		]);
	},

	// end of custom indicators	

});

const buttonNoClick = () => {
	const removeEvents = (element) => {
		try {
			var old_element = element;
			var new_element = old_element.cloneNode(true);
			old_element.parentNode.replaceChild(new_element, old_element);
		} catch (error) { }
	};
	var doc = window.frames[0].document;

	removeEvents(doc.getElementById("header-toolbar-indicators"));
	//removeEvents(doc.getElementById("header-toolbar-intervals"));
	// try {
	//   doc.getElementById(
	//     "header-toolbar-intervals"
	//   ).children[0].children[0].children[0].innerHTML = "15m";
	// } catch (error) {}

	removeEvents(doc.getElementById("header-toolbar-symbol-search"));
	removeEvents(doc.getElementById("header-toolbar-undo-redo"));
	removeEvents(doc.getElementById("header-toolbar-compare"));
	removeEvents(doc.getElementById("header-toolbar-properties"));
	removeEvents(doc.getElementById("header-toolbar-fullscreen"));
	try {
		removeEvents(doc.getElementById("header-toolbar-screenshot"));
		doc.getElementsByClassName("toggleButton-3zv4iS2j")[0].style =
			"bottom:100px";
		doc.getElementById("header-toolbar-chart-styles").parentElement.style =
			"display:none";

	} catch (error) { }
	try {
		var table = doc.getElementsByTagName("table")[0];
		var tr = table.children[table.children.length - 1];

		removeEvents(tr.children[tr.children.length - 1]);
	} catch (error) { }

	setTimeout(() => {
		try {
			doc.getElementsByClassName('js-btn-reset')[0].click()
		} catch (error) { }

	}, 500)


};

function bringIndicator1OnFront(result) {
	//console.log("Indicator ID: " + result);
	window.tvWidget.activeChart().bringToFront([result]);
}

window.tvWidget.onChartReady(function () {
	//   window.tvWidget.activeChart().setChartType(8);
	console.log("------");
	console.log(window.tvWidget);
	console.log(window.tvWidget.activeChart().createStudy());
	// window.tvWidget.activeChart().onMarkClick(function (markEvent) {
	// 	console.log('----------->mark click');
	// 	// Get the selected candle's timestamp
	// 	const selectedTimestamp = markEvent.time;

	// 	// Get the selected candle's data
	// 	const selectedCandle = widget.activeChart().getData()[selectedTimestamp];

	// 	// Log the selected candle
	// 	console.log('Selected Candle:', selectedCandle);
	// });
	try {
		// window.frames[0].document.getElementsByClassName(
		// 	"chart-gui-wrapper"
		// )[0].children[0].style = "user-select:auto";
		// window.frames[0].document.getElementsByClassName(
		// 	"chart-gui-wrapper"
		// )[0].children[1].style = "user-select:auto";

		window.frames[0].document.getElementsByClassName(
			"chart-gui-wrapper"
		)[0].children[2].style = "display:none";
	} catch (error) { }
	try {
		window.frames[0].document.getElementsByClassName(
			"chart-gui-wrapper"
		)[0].onclick = function () {
			console.log('===========>chart clicked!')
		};
	} catch (error) { }
	buttonNoClick();

	try {
		window.ReactNativeWebView.postMessage("--feed--");
	} catch (error) { }

	window.tvWidget.activeChart().createStudy("Cryptosignals app", false, false).then(bringIndicator1OnFront);
	console.log("widget: ", window.tvWidget.activeChart());

	
	//window.tvWidget.activeChart().removeAllStudies();
});
buttonNoClick();