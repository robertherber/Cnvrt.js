var Convert = Convert || {};

//formatCallback can be specified at Library level, overriden by unit level (attach as formatCallback property on unit), which in turn is overridden by formatCallback specified as input argument to the toString function

//Todo:
//Make val and unit private (module patternize, keep prototype for performance)
//Fetch currencies from webservice (probably yahoo)
//Create unit test suite
//Make it use BigNumber or other lib if available

Convert = function (val, unit) {
	this.val = val;
	this.unit = unit;
}

Convert.units = {
	currency : {
		sek: {
			value: 6.8,
			suffix: 'kr'
		},
		usd: {
			value: 1,
			prefix: '$'
		},
		eur: {
			value: 0.8,
			prefix: '€'
		}
	},
	weight : {
		kilo: {
			value: 0.001,
			suffix: 'kg'
		},
		gram: {
			value: 1,
			suffix: 'g'
		},
		milligram: {
			value: 1000,
			suffix: 'mg'
		},
		microgram: {
			value: 1000000,
			suffix: 'µg'
		},
		ounce: {
			value: 0.035274,
			suffix: 'oz.',
			init: function(value){
				return new Convert(value, Convert.units.weight.ounce);
			}
		}
	}
}

var addTypes = (function(){
	for(var siType in Convert.units){
		if(Convert.units.hasOwnProperty(siType)){
			for(var unit in Convert.units[siType]){
				if(Convert.units[siType].hasOwnProperty(unit)){
					Convert.units[siType][unit].typeOfUnit = siType;
				}
			}
		}
	}
})();


Convert.formatCallback = null;

Convert.prototype.toString = function(accuracy, formatCallback) {
	var accMultiplier = (accuracy || accuracy === 0) ? Math.pow(10, accuracy) : 100;
	var displayVal = (accMultiplier > 0) ? Math.floor(this.val * accMultiplier) / accMultiplier : this.val;
	var formatCallback = (formatCallback) ? formatCallback : 
		(this.unit.formatCallback) ? this.unit.formatCallback :
		Convert.formatCallback;

	if(formatCallback){
		return formatCallback(this.val, this.unit);
	}
	else{
		var prefix = (this.unit.prefix) ? this.unit.prefix : "";
		var suffix = (this.unit.suffix) ? this.unit.suffix : "";
		return prefix + displayVal + suffix;
	}	
};

Convert.prototype.toUnit = function(unit) {
	this.assertUnit(unit);
	this.val = this.val * (unit.value / this.unit.value);
	this.unit = unit;
	return this;
};

Convert.prototype.toNumber = function() {
	return this.val;
};

Convert.prototype.plus =
Convert.prototype.add = function(number) {
	this.val += number;
	return this;
};

Convert.prototype.minus = 
Convert.prototype.subtract = function(number) {
	this.val -= number;
	return this;
};

Convert.prototype.times = 
Convert.prototype.multiply = function(number) {
	this.val *= number;
	return this;
};

Convert.prototype.divide = function(number) {
	this.val /= number;
	return this;
};

Convert.prototype.mod = function(number) {
	this.val %= number;
	return this;
};

Convert.prototype.assertUnit = function(unit) {
	if(unit.typeOfUnit !== this.unit.typeOfUnit)
		throw "Attempted calculation with mixed types '" + unit.typeOfUnit + "' and '" + this.unit.typeOfUnit + "'"
}

//Equal in value
Convert.prototype.isEqual = function(convertable) {
	this.assertUnit(convertable.unit);
	var number = convertable.toUnit(this.unit).toNumber();
	return this.val === number;
};

//Equal in type and value 
Convert.prototype.isEqualAbs = function(convertable) {
	this.assertUnit(convertable.unit);
	return 
		this.unit === convertable.unit && 
		this.val === convertable.val;
};

Convert.prototype.isMoreThan = function(convertable) {
	this.assertUnit(convertable.unit);
	var number = convertable.toUnit(this.unit).toNumber();
	return this.val > number;
};

Convert.prototype.isLessThan = function(convertable) {
	this.assertUnit(convertable.unit);
	var number = convertable.toUnit(this.unit).toNumber();
	return this.val < number;
};

Convert.prototype.clone = function() {
	return new Convert(this.val, this.unit);
};

//This should make the equals operator able to compare objects across types..?
Convert.prototype.valueOf = function() {
	return this.val / this.unit.value;
};

var myVal = new Convert(5, Convert.units.currency.sek);

console.log(myVal.toString());