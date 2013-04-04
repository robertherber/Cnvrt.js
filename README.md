mCnvrt.js
=========

Library for easily converting between units and currencies.

Example:

    var tempInFahrenheit = Cnvrt.Celsius(20).to(Cnvrt.Fahrenheit);
    tempInFahrenheit.toString(); //Outputs 68°F

FEATURES:
* Fully chainable for simplicity and readabiliy
* Arithmetic precision with BigNumber.js (https://github.com/MikeMcl/bignumber.js) if loaded
* Extensible units, simply add more to config.js
* Node.js is now supported

TODO:
* Add more units
* Fetch currencies from webservice (Yahoo probably)
* Add support for derived units (ex. 10 meters * 10 meters = 100 sq. meters)
* Add headless Node.js unit tests
* Add more chainable mathematical operations
