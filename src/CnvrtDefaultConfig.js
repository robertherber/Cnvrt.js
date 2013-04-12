var nodeMode = (typeof module !== 'undefined');

var Cnvrt = (nodeMode) ? require("./Cnvrt.js") : Cnvrt;

if(!Cnvrt)
	throw "Cnvrt.js not found";

CnvrtDefaultConfig = {
	Currency:{
		update: Cnvrt.fetchCurrencies,
		updateInterval: 60 * 60 //update interval in seconds
	},
	Weight : {
		MetricGigatonne:{
			value: 0.000000000001,
			suffix: 'Gt'
		},
		MetricMegatonne:{
			value: 0.000000001,
			suffix: 'Mt'
		},
		MetricKilotonne:{
			value: 0.000001,
			suffix: 'kt'
		},
		MetricTonne:{
			value: 0.001,
			suffix: 't'
		},
		Kilogram: {
			value: 1,
			suffix: 'kg'
		},
		Hectogram: {
			value: 10,
			suffix: 'hg'
		},
		Decagram: {
			value: 100,
			suffix: 'dag'
		},
		Gram : {
			value: 1000,
			suffix: 'g'
		},
		Decigram: {
			value: 10000,
			suffix: 'dg'
		},
		Centigram: {
			value: 100000,
			suffix: 'cg'
		},
		Milligram: {
			value: 1000000,
			suffix: 'mg'
		},
		Microgram: {
			value: 1000000000,
			suffix: 'µg'
		},
		Nanogram: {
			value: 1000000000000,
			suffix: 'ng'
		},
		Quarter: {
			value: 12.70058636,
			suffix: 'qtr'
		},
		Ounce: {
			value: 35.27396194,
			suffix: 'oz'
		},
		Pound: {
			value: 2.20462262,
			suffix: 'lb'
		}
	},
	Length: {
		Millimeter: {
			value: 1000,
			suffix: 'mm'
		},
		Inch: {
			value: 39.3700787,
			suffix: '"'
		},
		Meter: {
			value: 1,
			suffix: 'm'
		}
	},
	Time:{
		Millenium: {
			value: 1000000,
			suffix: 'millenia'
		},
		Century: {
			value: 100000,
			suffix: 'c.'
		},
		Decade: {
			value: 10000,
			suffix: 'decade'
		},
		Year: {
			value: 8766,
			suffix: 'a'
		},
		Week: {
			value: 168,
			suffix: 'w'
		},
		Day: {
			value: 24,
			suffix: 'd'
		},
		Hour: {
			value: 1,
			suffix: 'h'
		},
		Minute: {
			value: 60,
			suffix: 'm'
		},
		Second: {
			value: 3600,
			suffix: 's'
		},
		Millisecond: {
			value: 3600000,
			suffix: 'ms'
		},
		Microsecond: {
			value: 3600000000,
			suffix: 'µs'
		},
		Nanosecond: {
			value: 3600000000000,
			suffix: 'ns'
		}
	},
	ElectricCurrent: {
		Ampere: {
			value: 1,
			suffix: 'amp'
		}
	},
	Temp: {
		Celsius: {
			convertFrom: function(value)
			{
				return Cnvrt.add(value, 273.15);
			},
			convertTo: function(value)
			{
				return Cnvrt.subtract(value, 273.15);
			},
			suffix: "°C"
		},
		Kelvin: {
			isDefault: true
		},
		Rankine: {
			convertFrom: function(value)
			{
				return Cnvrt.divide(Cnvrt.multiply(value, 5), 9);
			},
			convertTo: function(value)
			{
				return Cnvrt.divide(Cnvrt.multiply(value, 9), 5);
			},
			suffix: "°R"
		},
		Fahrenheit: {
			convertFrom: function(value)
			{
				return Cnvrt.divide(Cnvrt.multiply(Cnvrt.add(value, 459.67), 5), 9);
			},
			convertTo: function(value)
			{
				return Cnvrt.subtract(Cnvrt.divide(Cnvrt.multiply(value, 9), 5), 459.67);
			},
			suffix: "°F"
		},
	},
	LengthTimesLength:{
		"MeterTimesMeter":{
			value: 1,
			suffix: "m²"
		},
		"DecimeterTimesDecimeter":{
			value: 100,
			suffix: "dm²"
		}
	},
	Volume:{
		Liter: {
			value: 1,
			suffix: 'l'
		},
		USFluidOunce: {
			value: 33.8140227,
			suffix: 'oz'
		},
		USPint: {
			value: 2.11337642,
			suffix: 'pt'
		},
		ImperialPint:{
			value: 1.75975326,
			suffix: 'pt'
		},
		ImperialFluidOunce:{
			value: 35.1950652,
			suffix: 'oz'
		},
		Quartz: {
			value: 1.05668821,
			suffix: 'qt'
		},
		USGallon: {
			value: 0.264172052,
			suffix: 'gal'
		},
		ImperialGallon:{
			value: 0.219969157,
			suffix: 'gal'
		}
	},
	LuminousIntensity:{
		candela:{
			value: 1
		}
	}
}

if(typeof module !== 'undefined'){
	Cnvrt.loadConfig(CnvrtDefaultConfig);
	module.exports = Cnvrt;
}
else if(Cnvrt.loadConfig)
	Cnvrt.loadConfig(CnvrtDefaultConfig);