Cnvrt.js
=========

Now available in the NPM Registry for all ye Node coders!

Library for easily converting between units and currencies.

Example:

    var tempInFahrenheit = Cnvrt.Celsius(20).to(Cnvrt.Fahrenheit);
    tempInFahrenheit.toString(); //Outputs 68°F

FEATURES:
* Fully chainable for simplicity and readabiliy
* Arithmetic precision with BigNumber.js (https://github.com/MikeMcl/bignumber.js) if loaded
* Extensible units, simply add more to config.js
* Node.js is now supported
* Fetch currencies from webservice (Yahoo it is)
* Unit testing both for the browser and Node.js

TODO:
* Add more units
* Add support for derived units (ex. 10 meters * 10 meters = 100 sq. meters)
* Add more chainable mathematical operations

Any issues will be added automatically to this Trello board: https://trello.com/board/cnvrt-js/515837dc4f9c91bf1f0005f7