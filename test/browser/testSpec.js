function roundWithAccuracy(value, acc){
	if(!acc || acc < 0)
		acc = 0;

	var multiplier = Math.pow(10, acc);

	return Math.round(value * multiplier) / multiplier;
}


describe('Cnvrt.js', function(){
	beforeEach(function(){

	});

	describe('Creation', function() {
		Cnvrt.setNumberLib(null);
		it("Create with unit", function(){
			var value = 5;

			var celsius = Cnvrt.Celsius(value);
			expect(celsius.valueOf()).toEqual(value);
			expect(celsius.getUnit()).toEqual(Cnvrt.Celsius);
		});
	})

	describe('Convert from', function() {
		describe('no lib', function(){
			var _lib = null;

			it("Celsius to Fahrenheit", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 5;

				var celsius = Cnvrt.Celsius(value);

				var fahrenheit = celsius.to(Cnvrt.Fahrenheit);

				expect(roundWithAccuracy(fahrenheit.valueOf(), 2)).toEqual(41);
				expect(fahrenheit.getUnit()).toEqual(Cnvrt.Fahrenheit);
			});

			it("Fahrenheit to Celsius", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 41;

				var fahrenheit = Cnvrt.Fahrenheit(value);

				var celsius = fahrenheit.to(Cnvrt.Celsius);

				expect(roundWithAccuracy(celsius.valueOf(), 2)).toEqual(5);
				expect(celsius.getUnit()).toEqual(Cnvrt.Celsius);
			});

			it("Meter to Millimeter", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 41;

				var meters = Cnvrt.Meter(value);

				var millimeters = meters.to(Cnvrt.Millimeter);

				expect(millimeters.valueOf()).toEqual(41000);
				expect(millimeters.getUnit()).toEqual(Cnvrt.Millimeter);
			});

			it("Millimeter to meter", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 41000;

				var millimeters = Cnvrt.Millimeter(value);

				var meters = millimeters.to(Cnvrt.Meter);

				expect(meters.valueOf()).toEqual(41);
				expect(meters.getUnit()).toEqual(Cnvrt.Meter);
			});

			it("Hour to Millisecond", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 1;

				var hour = Cnvrt.Hour(value);

				var milliseconds = hour.to(Cnvrt.Millisecond);

				expect(milliseconds.valueOf()).toEqual(3600000);
				expect(milliseconds.getUnit()).toEqual(Cnvrt.Millisecond);
			});

			it("Millisecond to hour", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 3600000;

				var milliseconds = Cnvrt.Millisecond(value);

				var hour = milliseconds.to(Cnvrt.Hour);

				expect(roundWithAccuracy(hour.valueOf(), 2)).toEqual(1);
				expect(hour.getUnit()).toEqual(Cnvrt.Hour);
			});	
		});

		describe('BigNumber', function(){
			var _lib = BigNumber;

			it("Celsius to Fahrenheit", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 5;

				var celsius = Cnvrt.Celsius(value);

				var fahrenheit = celsius.to(Cnvrt.Fahrenheit);

				expect(fahrenheit.valueOf()).toEqual(41);
				expect(fahrenheit.getUnit()).toEqual(Cnvrt.Fahrenheit);
			});

			it("Fahrenheit to Celsius", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 41;

				var fahrenheit = Cnvrt.Fahrenheit(value);

				var celsius = fahrenheit.to(Cnvrt.Celsius);

				expect(celsius.valueOf()).toEqual(5);
				expect(celsius.getUnit()).toEqual(Cnvrt.Celsius);
			});

			it("Meter to Millimeter", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 41;

				var meters = Cnvrt.Meter(value);

				var millimeters = meters.to(Cnvrt.Millimeter);

				expect(millimeters.valueOf()).toEqual(41000);
				expect(millimeters.getUnit()).toEqual(Cnvrt.Millimeter);
			});

			it("Millimeter to meter", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 41000;

				var millimeters = Cnvrt.Millimeter(value);

				var meters = millimeters.to(Cnvrt.Meter);

				expect(meters.valueOf()).toEqual(41);
				expect(meters.getUnit()).toEqual(Cnvrt.Meter);
			});

			it("Hour to Millisecond", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 1;

				var hour = Cnvrt.Hour(value);

				var milliseconds = hour.to(Cnvrt.Millisecond);

				expect(milliseconds.valueOf()).toEqual(3600000);
				expect(milliseconds.getUnit()).toEqual(Cnvrt.Millisecond);
			});

			it("Millisecond to hour", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 3600000;

				var milliseconds = Cnvrt.Millisecond(value);

				var hour = milliseconds.to(Cnvrt.Hour);

				expect(hour.valueOf()).toEqual(1);
				expect(hour.getUnit()).toEqual(Cnvrt.Hour);
			});	
		});
	})
});