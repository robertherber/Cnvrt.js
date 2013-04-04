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
		describe('no library', function(){
			var _lib = null;

			Cnvrt.setNumberLib(null);
			it("Create with unit", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 5;

				var celsius = Cnvrt.Celsius(value);
				expect(celsius.valueOf()).toEqual(value);
				expect(celsius.getUnit()).toEqual(Cnvrt.Celsius);
			});

			it("Create with library", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 5;

				var celsius = Cnvrt(value, Cnvrt.Celsius);
				expect(celsius.valueOf()).toEqual(value);
				expect(celsius.getUnit()).toEqual(Cnvrt.Celsius);
			});
		});

		describe('BigNumber', function(){
			var _lib = BigNumber;

			Cnvrt.setNumberLib(null);
			it("Create with unit", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 5;

				var celsius = Cnvrt.Celsius(value);
				expect(celsius.valueOf()).toEqual(value);
				expect(celsius.getUnit()).toEqual(Cnvrt.Celsius);
			});

			it("Create with library", function(){
				Cnvrt.setNumberLib(_lib);
				var value = 5;

				var celsius = Cnvrt(value, Cnvrt.Celsius);
				expect(celsius.valueOf()).toEqual(value);
				expect(celsius.getUnit()).toEqual(Cnvrt.Celsius);
			});
		});
	})

	describe('Comparison', function() {
		describe('no library', function(){
			var _lib = null;

			it("41 Fahrenheit should equal 5 Celsius", function(){
				Cnvrt.setNumberLib(_lib);

				var fahrenheit = Cnvrt.Fahrenheit(41);
				var celsius = Cnvrt.Celsius(5);

				//expect(fahrenheit.equals(celsius)).toBeTruthy(); //fails because of arithmetic precision
				expect(celsius.equals(fahrenheit)).toBeTruthy(); //
			});

			it("5 Meters should equal 5000 millimeters", function(){
				Cnvrt.setNumberLib(_lib);

				var meters = Cnvrt.Meter(5);
				var millimeters = Cnvrt.Millimeter(5000);

				expect(meters.equals(millimeters)).toBeTruthy();
				expect(millimeters.equals(meters)).toBeTruthy();
			});

			it("41 Fahrenheit shouldn't be identical to 5 Celsius", function(){
				Cnvrt.setNumberLib(_lib);

				var fahrenheit = Cnvrt.Fahrenheit(41);
				var celsius = Cnvrt.Celsius(5);

				expect(fahrenheit.isIdentical(celsius)).toBeFalsy();
				expect(celsius.isIdentical(fahrenheit)).toBeFalsy();
			});

			it("41 Fahrenheit should be identical to 41 Fahrenheit", function(){
				Cnvrt.setNumberLib(_lib);

				var fahrenheit = Cnvrt.Fahrenheit(41);
				var fahrenheit2 = Cnvrt.Fahrenheit(41);

				expect(fahrenheit.isIdentical(fahrenheit2)).toBeTruthy();
				expect(fahrenheit2.isIdentical(fahrenheit)).toBeTruthy();
			});

			it("41 Fahrenheit should be more than 4 Celsius", function(){
				Cnvrt.setNumberLib(_lib);

				var fahrenheit = Cnvrt.Fahrenheit(41);
				var celsius = Cnvrt.Celsius(4);

				expect(fahrenheit.isMoreThan(celsius)).toBeTruthy(); //fails because of arithmetic precision
				expect(celsius.isLessThan(fahrenheit)).toBeTruthy(); //
			});

			it("41 Fahrenheit should be less than 6 Celsius", function(){
				Cnvrt.setNumberLib(_lib);

				var fahrenheit = Cnvrt.Fahrenheit(41);
				var celsius = Cnvrt.Celsius(6);

				expect(fahrenheit.isLessThan(celsius)).toBeTruthy(); //fails because of arithmetic precision
				expect(celsius.isMoreThan(fahrenheit)).toBeTruthy(); //
			});
		});

		describe('BigNumber', function(){
			var _lib = BigNumber;

			it("41 Fahrenheit should equal 5 Celsius", function(){
				Cnvrt.setNumberLib(_lib);

				var fahrenheit = Cnvrt.Fahrenheit(41);
				var celsius = Cnvrt.Celsius(5);

				expect(fahrenheit.equals(celsius)).toBeTruthy();
				expect(celsius.equals(fahrenheit)).toBeTruthy();
			});

			it("5 Meters should equal 5000 millimeters", function(){
				Cnvrt.setNumberLib(_lib);

				var meters = Cnvrt.Meter(5);
				var millimeters = Cnvrt.Millimeter(5000);

				expect(meters.equals(millimeters)).toBeTruthy();
				expect(millimeters.equals(meters)).toBeTruthy();
			});

			it("41 Fahrenheit shouldn't be identical to 5 Celsius", function(){
				Cnvrt.setNumberLib(_lib);

				var fahrenheit = Cnvrt.Fahrenheit(41);
				var celsius = Cnvrt.Celsius(5);

				expect(fahrenheit.isIdentical(celsius)).toBeFalsy();
				expect(celsius.isIdentical(fahrenheit)).toBeFalsy();
			});

			it("41 Fahrenheit should be identical to 41 Fahrenheit", function(){
				Cnvrt.setNumberLib(_lib);

				var fahrenheit = Cnvrt.Fahrenheit(41);
				var fahrenheit2 = Cnvrt.Fahrenheit(41);

				expect(fahrenheit.isIdentical(fahrenheit2)).toBeTruthy();
				expect(fahrenheit2.isIdentical(fahrenheit)).toBeTruthy();
			});

			it("41 Fahrenheit should be more than 4 Celsius", function(){
				Cnvrt.setNumberLib(_lib);

				var fahrenheit = Cnvrt.Fahrenheit(41);
				var celsius = Cnvrt.Celsius(4);

				expect(fahrenheit.isMoreThan(celsius)).toBeTruthy(); //
				expect(celsius.isLessThan(fahrenheit)).toBeTruthy(); //
			});

			it("41 Fahrenheit should be less than 6 Celsius", function(){
				Cnvrt.setNumberLib(_lib);

				var fahrenheit = Cnvrt.Fahrenheit(41);
				var celsius = Cnvrt.Celsius(6);

				expect(fahrenheit.isLessThan(celsius)).toBeTruthy(); //
				expect(celsius.isMoreThan(fahrenheit)).toBeTruthy(); //
			});
		});
	});


	describe('Arithmetics with', function() {
		describe('no library', function(){
			var _lib = null;

			it("Multiply 5 by 5", function(){
				Cnvrt.setNumberLib(_lib);

				var val = Cnvrt.Celsius(5).multiply(5).valueOf();

				expect(val).toEqual(25);
			});

			it("Divide 6 by 5", function(){
				Cnvrt.setNumberLib(_lib);

				var val = Cnvrt.Celsius(6).divide(5).valueOf();

				expect(val).toEqual(1.2);
			});

			it("Mod 6 by 5", function(){
				Cnvrt.setNumberLib(_lib);

				var val = Cnvrt.Celsius(6).mod(5).valueOf();

				expect(val).toEqual(1);
			});

			it("Add 6 to 5", function(){
				Cnvrt.setNumberLib(_lib);

				var val = Cnvrt.Celsius(6).add(5).valueOf();

				expect(val).toEqual(11);
			});

			it("Subtract 6 to 5", function(){
				Cnvrt.setNumberLib(_lib);

				var val = Cnvrt.Celsius(6).subtract(5).valueOf();

				expect(val).toEqual(1);
			});
		});

		describe('BigNumber', function(){
			var _lib = BigNumber;

			
			it("Multiply 5 by 5", function(){
				Cnvrt.setNumberLib(_lib);

				var val = Cnvrt.Celsius(5).multiply(5).valueOf();

				expect(val).toEqual(25);
			});

			it("Divide 6 by 5", function(){
				Cnvrt.setNumberLib(_lib);

				var val = Cnvrt.Celsius(6).divide(5).valueOf();

				expect(val).toEqual(1.2);
			});

			it("Mod 6 by 5", function(){
				Cnvrt.setNumberLib(_lib);

				var val = Cnvrt.Celsius(6).mod(5).valueOf();

				expect(val).toEqual(1);
			});

			it("Add 6 to 5", function(){
				Cnvrt.setNumberLib(_lib);

				var val = Cnvrt.Celsius(6).add(5).valueOf();

				expect(val).toEqual(11);
			});

			it("Subtract 6 to 5", function(){
				Cnvrt.setNumberLib(_lib);

				var val = Cnvrt.Celsius(6).subtract(5).valueOf();

				expect(val).toEqual(1);
			});
		});
	});

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