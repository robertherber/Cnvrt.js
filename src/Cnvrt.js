//formatCallback can be specified at Library level, overriden by unit level (attach as formatCallback property on unit), which in turn is overridden by formatCallback specified as input argument to the toString function

var MicroEvent = MicroEvent || null,
	BigNumber = BigNumber || null;

Cnvrt = (function() {
	//private

	var	_nodeMode = (typeof module !== 'undefined'),
		_numberLib = (BigNumber) ? BigNumber : (_nodeMode) ? require('bignumber.js') : null,
		_formatCallback = null;

	var _ensureNumberType = function(number){
		var retNumber;

		if(_numberLib){
			return (number instanceof _numberLib.constructor) ? 
				number : 
				_numberLib(number);
		}
		else{
			return (typeof number === "number") ?
				number :
				parseFloat(number)
		}
	}

	var _assertUnit = function(unit1, unit2) {
		if(unit1.measure !== unit2.measure)
			throw "Attempted calculation with mixed measures '" + unit1.measure + "' and '" + unit2.measure + "'"
	};

	//public

	var setNumberLib = function(library) {
		_numberLib = library;
	};

	var loadConfig = function(config, preserve){
		if(!preserve){
			for(var prop in this){
				if(this.hasOwnProperty(prop) && (this[prop] instanceof Unit || this[prop] instanceof Measure)){
					delete this[prop];
				}
			}
		}

		for(var measure in config){
			if(config.hasOwnProperty(measure)){
				var props = config[measure];
				_ensureMeasure(measure, props);
			}
		}
	};

	var addUnit = function (name, measure, attributes) {
		if(!name || !measure || !(attributes.hasOwnProperty('value') || attributes.hasOwnProperty('isDefault') || (attributes.hasOwnProperty('convertTo') && attributes.hasOwnProperty('convertFrom'))))
			throw "Unit requires 'name', 'value' and 'type' to be specified";

		var unit = Unit(measure, name, attributes);

		_ensureMeasure(measure);
		Cnvrt[name] = unit;
		if(Cnvrt[measure])
			Cnvrt[measure][name] = unit;
		return unit;
	}

	var _ensureMeasure = function(measureName, props){
		if(!Cnvrt[measureName])
			Cnvrt[measureName] = new Measure(measureName, props);
	}

	var Measure = function(measureName, props){
		for(var prop in props){
			if(props.hasOwnProperty(prop)){
				if(prop === 'update' && typeof props[prop] === "function"){
					this.updateFunction = props[prop];
				}
				else if(prop === 'updateInterval' && isFinite(props[prop])){
					this.updateInterval = parseInt(props[prop]);
				}
				else{
					this[prop] = addUnit(prop, measureName, props[prop]);
				}
			}
		}
		if(this.updateFunction){
			this.updateFunction();
			setInterval(function(){
				this.updateFunction();
			}, this.updateInterval * 1000);
		}
	}

	if(_nodeMode){
		MicroEvent = require('microevent');
	}

	if(typeof MicroEvent !== 'undefined')
		MicroEvent.mixin(Measure);
	else
		console.log("Missing MicroEvent, events will not trigger");

	var _currencyCallback = function(data){
		var currencies = (data instanceof Object) ? data.list.resources : JSON.parse(data).list.resources,
			latestDataTS = 0;

		for(var cur in currencies){
			if(currencies.hasOwnProperty(cur) && currencies[cur].resource){
				var currency = currencies[cur].resource.fields;
				if(currency && currency.name && currency.name.indexOf('USD/') !== -1){
					var name = currency.name.replace('USD/', ''),
						value = currency.price,
						timestamp = currency.ts;

					latestDataTS = Math.max(latestDataTS, parseInt(timestamp));

					if(Cnvrt[name] && Cnvrt[name].value !== value){
						Cnvrt[name].value = _ensureNumberType(value);
						Cnvrt[name].updated = new Date(timestamp);
					}
					else{
						addUnit(name, "Currency", {
							value: value,
							suffix: name,
							updated: new Date(timestamp)
						});	
					}
				}
			}
		}

		if(!Cnvrt["USD"])
			addUnit("USD", "Currency", { 
				value: 1,
				prefix: '$'
			});

		Cnvrt.Currency.updated = new Date(latestDataTS * 1000);
		Cnvrt.Currency.fetched = new Date();

		if(Cnvrt.Currency.trigger)
			Cnvrt.Currency.trigger('updated');
	}

	var fetchCurrencies = function(){
		var uri = "http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json";

		if(typeof require !== 'undefined'){
			var request = require('request');

			request(uri, function(error, response, body){
				if(!error && response.statusCode === 200){
					_currencyCallback(body);
				}
				else{
					console.log("Error: " + error);
				}
			});
		}
		else
		{
			//JSONP request
			var script = document.createElement('script');
			script.src = uri + "&callback=Cnvrt._currencyCallback";

			document.getElementsByTagName('head')[0].appendChild(script);
		}
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

	var multiplyDerived = function(convertable1, convertable2) {
		var number1 = convertable1.getValue(),
			number2 = convertable2.getValue(),
			unit1 = convertable1.getUnit(),
			unit2 = convertable2.getUnit();

		var newValue = multiply(number1, number2);

		var newUnitSuffix = (unit1.unitName === unit2.unitName) ? 
			unit1.suffix + "^2" : 
			unit1.suffix + '*' + unit2.suffix;
		var newUnitMeasure = unit1.measure + 'Times' + unit2.measure;
		var newUnitName = unit1.unitName + "Times" + unit2.unitName;
		var newUnitValue = multiply(unit1.value, unit2.value);

		var newUnit = Cnvrt[newUnitMeasure][newUnitName] || 
			Unit(newUnitMeasure, newUnitName, 
				{ 
					suffix: newUnitSuffix, 
					value: newUnitValue
				});

		return Cnvrt(newValue, newUnit);
	}

	var divideDerived = function(convertable1, convertable2) {
		var number1 = convertable1.getValue(),
			number2 = convertable2.getValue(),
			unit1 = convertable1.getUnit(),
			unit2 = convertable2.getUnit();

		var newValue = divide(number1, number2);

		var newUnitMeasure = unit1.measure + 'Over' + unit2.measure;
		var newUnitName = unit1.unitName + "Over" + unit2.unitName;
		var newUnitSuffix = unit1.suffix + '/' + unit2.suffix;
		
		var newUnitValue = divide(unit1.value, unit2.value);

		var newUnit = 
			Unit(newUnitMeasure, newUnitName,
				{
					suffix: newUnitSuffix,
					value: newUnitValue
				});

		return Cnvrt(newValue, newUnit);
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
				/*if(numberOrConvertable instanceof Object && !(numberOrConvertable instanceof _numberLib))
					return multiplyDerived(this, numberOrConvertable);
				else*/
					_val = multiply(_val, numberOrConvertable);
				return this;
			},
			divide: function(numberOrConvertable) {
				/*if(numberOrConvertable instanceof Object && !(numberOrConvertable instanceof _numberLib) && numberOrConvertable.getUnit().measure !== _unit.measure)
					return divideDerived(this, numberOrConvertable);
				else*/
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
	exports.loadConfig = loadConfig;
	exports.addUnit = addUnit;
	exports.setNumberLib = setNumberLib;
	exports.fetchCurrencies = fetchCurrencies;
	exports._currencyCallback = _currencyCallback;

	return exports;
})();

if(typeof module !== 'undefined'){
	module.exports = Cnvrt;
}