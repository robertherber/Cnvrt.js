var Cnvrt = Cnvrt || {};

//formatCallback can be specified at Library level, overriden by unit level (attach as formatCallback property on unit), which in turn is overridden by formatCallback specified as input argument to the toString function

//Todo:
//Make val and unit private (module patternize, keep prototype for performance)
//Fetch currencies from webservice (probably yahoo)
//Derived types (m/s and so on): 

Cnvrt = (function() {
	//private

	var _numberLib = (typeof BigNumber !== 'undefined') ? BigNumber : null,
		_formatCallback = null;

	var _ensureNumberType = function(number){
		return (!_numberLib || _numberLib === null || (number instanceof _numberLib.constructor)) ? 
			number : 
			new _numberLib(number);
	}

	var _assertUnit = function(unit1, unit2) {
		if(unit1.measure !== unit2.measure)
			throw "Attempted calculation with mixed measures '" + unit1.measure + "' and '" + unit2.measure + "'"
	};

	//public

	var setNumberLib = function(library) {
		_numberLib = library;
	};

	var addUnits = function(config){
		for(var measure in config){
			if(config.hasOwnProperty(measure)){
				var units = config[measure];
				for(var unitName in units){
					if(units.hasOwnProperty(unitName)){
						addUnit(unitName, measure, units[unitName])
					}
				}
			}
		}
	};

	var addUnit = function (name, measure, attributes) {
		if(!name || !measure || !(attributes.hasOwnProperty('value') || attributes.hasOwnProperty('isDefault') || (attributes.hasOwnProperty('convertTo') && attributes.hasOwnProperty('convertFrom'))))
			throw "Unit requires 'name', 'value' and 'type' to be specified";

		var unit = Unit(measure, name, attributes);

		Cnvrt[measure] = Cnvrt[measure] || {};
		Cnvrt[measure][name] = unit;
		Cnvrt[name] = unit;
		return unit;
	}

	var add = function(number1, number2) {
		number1 = _ensureNumberType(number1);
		number2 = _ensureNumberType(number2);

		return (_numberLib) ?
			number1.plus(number2) : 
			number1 + number2;
	}

	var subtract = function(number1, number2) {
		number1 = _ensureNumberType(number1);
		number2 = _ensureNumberType(number2);

		return (_numberLib) ?
			number1.minus(number2) : 
			number1 - number2;
	}

	var multiply = function(number1, number2) {
		number1 = _ensureNumberType(number1);
		number2 = _ensureNumberType(number2);

		return (_numberLib) ?
			number1.times(number2) : 
			number1 * number2;
	}

	var divide = function(number1, number2) {
		number1 = _ensureNumberType(number1);
		number2 = _ensureNumberType(number2);

		return (_numberLib) ?
			number1.dividedBy(number2) : 
			number1 / number2;
	}

	var mod = function(number1, number2) {
		number1 = _ensureNumberType(number1);
		number2 = _ensureNumberType(number2);

		return (_numberLib) ?
			number1.mod(number2) : 
			number1 % number2;
	}

	var equals = function(convertable1, convertable2) {
		var unit1 = convertable1.getUnit(),
			unit2 = convertable2.getUnit();

		_assertUnit(unit1, unit2);

		var number1 = convertable1.toNumber(),
			number2 = convertable2.clone().to(unit1).toNumber();

		return number1 === number2;
	}

	var isMoreThan = function(convertable1, convertable2){
		var unit1 = convertable1.getUnit(),
			unit2 = convertable2.getUnit();

		_assertUnit(unit1, unit2);

		var number1 = convertable1.toNumber(),
			number2 = convertable2.to(unit1).toNumber();

		return number1 > number2;
	}

	var isLessThan = function(convertable1, convertable2){
		var unit1 = convertable1.getUnit(),
			unit2 = convertable2.getUnit();

		_assertUnit(unit1, unit2);

		var number1 = convertable1.toNumber(),
			number2 = convertable2.to(unit1).toNumber();

		return number1 < number2;
	}

	var isIdentical = function(convertable1, convertable2){
		var unit1 = convertable1.getUnit(),
			unit2 = convertable2.getUnit();

		_assertUnit(unit1, unit2);

		var number1 = convertable1.toNumber(),
			number2 = convertable2.toNumber();

		return (unit1 === unit2 && 
			number1 === number2);
	}

	var toValue = function(convertable, unit){
		var _unit = convertable.getUnit(),
			val = convertable.getValue();

		if(unit === _unit)
			return val;

		_assertUnit(_unit, unit);

		if(!_unit.convertFrom && !unit.convertTo){
			val = divide(multiply(val, unit.value), _unit.value);
		}
		else{
			if(_unit.convertFrom){
				val = _unit.convertFrom(val);
			}	
			if(unit.convertTo){
				val = unit.convertTo(val);
			}
		}

		return val;
	}

	var toString = function(convertable, accuracy, formatCallback){
		var _unit = convertable.getUnit(),
			_val = convertable.getValue();

		var accMultiplier = (accuracy || accuracy === 0) ? Math.pow(10, accuracy) : 100;
		var displayVal = (accMultiplier > 0) ? Math.floor(_val * accMultiplier) / accMultiplier : _val;
		var formatCallback = (formatCallback) ? formatCallback : 
			(_unit.formatCallback) ? _unit.formatCallback :
			_formatCallback;

		if(formatCallback){
			return formatCallback(_val, _unit);
		}
		else{
			var prefix = (_unit.prefix) ? _unit.prefix : "";
			var suffix = (_unit.suffix) ? _unit.suffix : "";
			return prefix + displayVal + suffix;
		}
	}

	var Unit = function(measure, name, attributes) {
		var unit = function(value){
			return Convertable(value, Cnvrt[measure][name]);
		};

		for(var attr in attributes){
			if(attributes.hasOwnProperty(attr)){
				unit[attr] = attributes[attr];
			}
		}
		if(unit.value)
			unit.value = _ensureNumberType(unit.value);
		unit.measure = measure;
		unit.unitName = name;

		return unit;
	}
/*
	Unit.prototype.init = function(value) {
		return new Convertable(value, this);
	}*/

	

	var Convertable = (function (val, unit) {
		var _val = _ensureNumberType(val);;
		var _unit = unit;

		return {
			toString: function(accuracy, formatCallback) {
				return toString(this, accuracy, formatCallback);
			},
			to: function(unit) {
				_val = toValue(this, unit);
				_unit = unit;
				return this;
			},
			toNumber: function() {
				return _val.valueOf() * 1;
			},
			getUnit: function() {
				return _unit;
			},
			getValue: function() {
				return _val;
			},
			add: function(numberOrConvertable) {
				_val = add(_val, numberOrConvertable);
				return this;
			},
			subtract: function(numberOrConvertable) {
				_val = subtract(_val, numberOrConvertable);
				return this;
			},
			multiply: function(numberOrConvertable) {
				//Experimenting with derived units..
				/*if(numberOrConvertable instanceof Object && !(numberOrConvertable instanceof _numberLib)){
					var convertable = numberOrConvertable;
					var newValue = multiply(_val, convertable.valueOf());
					var otherUnit = convertable.getUnit();

					var newUnitSuffix = (_unit.unitName === otherUnit.unitName) ? _unit.suffix + "^2" : _unit.suffix + '*' + otherUnit.suffix;

					var newUnit = Cnvrt[_unit.unitName + "Times" + otherUnit.unitName] || Unit(_unit.measure + 'Times' + otherUnit.measure, _unit.unitName + "Times" + otherUnit.unitName, { suffix: newUnitSuffix, value: _unit.value * otherUnit.value });

					return Cnvrt(newValue, newUnit);
				}
				else*/
				_val = multiply(_val, numberOrConvertable);
				return this;
			},
			divide: function(numberOrConvertable) {
				_val = divide(_val, numberOrConvertable);
				return this;
			},
			mod: function(numberOrConvertable) {
				_val = mod(_val, numberOrConvertable);
				return this;
			},
			equals: function(convertable) {
				return equals(this, convertable);
			},
			isIdentical: function(convertable) {
				return isIdentical(this, convertable);
			},
			isMoreThan : function(convertable) {
				return isMoreThan(this, convertable);
			},
			isLessThan : function(convertable) {
				return isLessThan(this, convertable);
			},
			clone : function() {
				return Cnvrt(_val, _unit);
			},
			valueOf : function() {
				return this.toNumber();// this.divide(_unit.value);
			}
		};
	});

	var exports = Convertable;
	exports.add = add;
	exports.subtract = subtract;
	exports.divide = divide;
	exports.multiply = multiply;
	exports.mod = mod;
	exports.addUnits = addUnits;
	exports.setNumberLib = setNumberLib;

	return exports;
})();

if(typeof module !== 'undefined'){
	module.exports = Cnvrt;
}