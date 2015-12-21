(function(){
  "use strict";

  var addition = require("./addition.js");
  var assert = require("../vendor/chai-v2.1.0.js").assert;

  describe("Addition", function() {

    it("Adds positive numbers", function(){
      assert.equal(addition.add(3, 4), 7);
    });

    it("Uses IEEE 754 floating point", function(){
      assert.equal(addition.add(0.1, 0.2), 0.30000000000000004);
    });

  });

})();