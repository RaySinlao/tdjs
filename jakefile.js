// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
/* globals jake:false,desc:false,task:false,complete:false,fail:false,directory:false */

(function() {
  "use strict";

  var shell = require("shelljs");
  var semver = require("semver");
  var jshint = require("simplebuild-jshint");
  var karma = require("simplebuild-karma");

  var KARMA_CONFIG = "karma.conf.js";
  var DIST_DIR = "generated/dist";

  //**** General-purpose tasks

  desc("Start the Karma server");
  task("karma", function() {
    karma.start({
      configFile: KARMA_CONFIG
    }, complete, fail);
  }, { async: true });

  desc("Default build");
  task("default", [ "version", "lint", "test"], function() {
    console.log("\n\nBUILD OK");
  });

  desc("Run a localhost server");
  task("run", ["build"], function() {
    jake.exec("node node_modules/http-server/bin/http-server " + DIST_DIR, { interactive: true }, complete);
  }, { async: true });

  desc("Erase all generated files");
  task("clean", function() {
    console.log("Erasing generated files: .");
    shell.rm("-rf", "generated");
  });

  //**** Supporting tasks

  desc("Check Node version");
  task("version", function() {
    console.log("Checking Node version: .");
    
    var packageJson = require("./package.json");
    var expectedVersion = packageJson.engines.node;

    var actualVersion = process.version;
    if(semver.neq(expectedVersion, actualVersion)) {
      fail("Incorrect Node version expected " + expectedVersion + " but was " + actualVersion);
    }

  });

  desc("Lint the code");
  task("lint", function() {
    process.stdout.write("Linting Javascript: ");

    jshint.checkFiles({
      files: ["jakefile.js", "src/js/**/*.js"],
      options: lintOptions(),
      globals: lintGlobals()
    }, complete, fail);

  }, { async: true });

  desc("Run tests");
  task("test", function() {
    console.log("Testing Javascipt");
    karma.run({
      configFile: KARMA_CONFIG,
      expectedBrowsers: expectedBrowsers(),
      strict: !process.env.loose
    }, complete, fail);
  }, { async: true });

  desc("Build distribution directory");
  task("build", [DIST_DIR], function(){
    console.log("Building distribution directory: .");

    shell.rm("-rf", DIST_DIR + "/*");
    shell.cp("src/content/index.html", DIST_DIR);

    jake.exec(
      "node node_modules/browserify/bin/cmd.js src/js/app.js -o " + DIST_DIR + "/bundle.js", 
      { interactive: true }, 
      complete
    );

  }, { async: true });

  directory(DIST_DIR);

  function expectedBrowsers() {
    return [
      "Chrome 47.0.2526 (Mac OS X 10.10.5)"
      // "Safari 9.0.1 (Mac OS X 10.10.5)"
    ];
  }

  function lintOptions(){
    return {
      bitwise: true,
      eqeqeq: true,
      forin: true,
      freeze: true,
      futurehostile: true,
      latedef: "nofunc",
      noarg: true,
      nocomma: true,
      nonbsp: true,
      nonew: true,
      strict: true,
      undef: true,

      node: true,
      browser: true
    };
  }

  function lintGlobals(){
    return {
      // Mocha
      describe: false,
      it: false,
      before: false,
      after: false,
      beforeEach: false,
      afterEach: false
    };
  }

}());