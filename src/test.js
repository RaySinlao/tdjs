(function(){
  "use strict";

  assertEqual(8, add(3, 4));

  function add(a, b) {
    return a + b;
  }

  function assertEqual(actual, expected) {
    if ( actual !== expected) throw new Error("Expected " + expected + ", but got " + actual);
  }

})();