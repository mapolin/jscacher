jscacher
========

A simple object for caching JS variables/objects/etc

For sample use see index.html;

Methods:
=======

.__ID__
  - unique ID of the current cache object; of no real use :X

.clone() 
  - clone the current cache object; returns a new Cache(map);
  
.set(property[, value]) 
  - add a property to the current cache object; 
  - optional Value of that property can be given;
  * if property is an object and no value is given, property will be used as a Map;
  
.update()
  - updates the current cache object (uses current cache.map);
