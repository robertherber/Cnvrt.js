var Cnvrt = require("../../bin/Cnvrt.js"),
	BigNumber = require("bignumber.js");

Cnvrt.setNumberLib(BigNumber);

function UsDollarToSwedishKrona (amount) {
	var usDollar = Cnvrt.USD(amount);

	console.log("You go to the exchange with " + usDollar.toString());

	var swedishKrona = usDollar.to(Cnvrt.SEK);

	console.log("You exchange them for " + swedishKrona.toString() + " in preparation for going to Sweden");
}

function CelsiusToFahrenheit (amount) {
	var celsius = Cnvrt.Celsius(amount);

	console.log("You talk with your grandma home in Europe, she tells you it's " + celsius.toString() + " outside");

	var fahrenheit = celsius.to(Cnvrt.Fahrenheit);

	console.log("You quickly realize that's about " + fahrenheit.toString() + ", damn hot isn't it!");
}


UsDollarToSwedishKrona(5);
CelsiusToFahrenheit(45);