var config = {
	Currency : {
		SEK: {
			value: 6.8,
			suffix: 'kr'
		},
		USD: {
			value: 1,
			prefix: '$'
		},
		EUR: {
			value: 0.8,
			prefix: '€'
		}
	},
	Weight : {
		Tonne:{
			value: 0.001,
			suffix: ' tonne'
		},
		Kilogram: {
			value: 1,
			suffix: 'kg'
		},
		Gram : {
			value: 1000,
			suffix: 'g'
		},
		Milligram: {
			value: 1000000,
			suffix: 'mg'
		},
		Microgram: {
			value: 1000000000,
			suffix: 'µg'
		},
		Ounce: {
			value: 35.2739619,
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
		}
	},
	ElectricCurrent: {
		Ampere: {
			value: 1,
			suffix: 'A'
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
	Substance:{
		mole:{
			value: 1
		}
	},
	LuminousIntensity:{
		candela:{
			value: 1
		}
	}
}

Cnvrt.addUnits(config);