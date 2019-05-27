// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/json-stringify-safe/stringify.js":[function(require,module,exports) {
exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}

},{}],"../node_modules/random-seed/index.js":[function(require,module,exports) {
/*
 * random-seed
 * https://github.com/skratchdot/random-seed
 *
 * This code was originally written by Steve Gibson and can be found here:
 *
 * https://www.grc.com/otg/uheprng.htm
 *
 * It was slightly modified for use in node, to pass jshint, and a few additional
 * helper functions were added.
 *
 * Copyright (c) 2013 skratchdot
 * Dual Licensed under the MIT license and the original GRC copyright/license
 * included below.
 */

/*	============================================================================
									Gibson Research Corporation
				UHEPRNG - Ultra High Entropy Pseudo-Random Number Generator
	============================================================================
	LICENSE AND COPYRIGHT:  THIS CODE IS HEREBY RELEASED INTO THE PUBLIC DOMAIN
	Gibson Research Corporation releases and disclaims ALL RIGHTS AND TITLE IN
	THIS CODE OR ANY DERIVATIVES. Anyone may be freely use it for any purpose.
	============================================================================
	This is GRC's cryptographically strong PRNG (pseudo-random number generator)
	for JavaScript. It is driven by 1536 bits of entropy, stored in an array of
	48, 32-bit JavaScript variables.  Since many applications of this generator,
	including ours with the "Off The Grid" Latin Square generator, may require
	the deteriministic re-generation of a sequence of PRNs, this PRNG's initial
	entropic state can be read and written as a static whole, and incrementally
	evolved by pouring new source entropy into the generator's internal state.
	----------------------------------------------------------------------------
	ENDLESS THANKS are due Johannes Baagoe for his careful development of highly
	robust JavaScript implementations of JS PRNGs.  This work was based upon his
	JavaScript "Alea" PRNG which is based upon the extremely robust Multiply-
	With-Carry (MWC) PRNG invented by George Marsaglia. MWC Algorithm References:
	http://www.GRC.com/otg/Marsaglia_PRNGs.pdf
	http://www.GRC.com/otg/Marsaglia_MWC_Generators.pdf
	----------------------------------------------------------------------------
	The quality of this algorithm's pseudo-random numbers have been verified by
	multiple independent researchers. It handily passes the fermilab.ch tests as
	well as the "diehard" and "dieharder" test suites.  For individuals wishing
	to further verify the quality of this algorithm's pseudo-random numbers, a
	256-megabyte file of this algorithm's output may be downloaded from GRC.com,
	and a Microsoft Windows scripting host (WSH) version of this algorithm may be
	downloaded and run from the Windows command prompt to generate unique files
	of any size:
	The Fermilab "ENT" tests: http://fourmilab.ch/random/
	The 256-megabyte sample PRN file at GRC: https://www.GRC.com/otg/uheprng.bin
	The Windows scripting host version: https://www.GRC.com/otg/wsh-uheprng.js
	----------------------------------------------------------------------------
	Qualifying MWC multipliers are: 187884, 686118, 898134, 1104375, 1250205,
	1460910 and 1768863. (We use the largest one that's < 2^21)
	============================================================================ */
'use strict';

var stringify = require('json-stringify-safe');
/*	============================================================================
This is based upon Johannes Baagoe's carefully designed and efficient hash
function for use with JavaScript.  It has a proven "avalanche" effect such
that every bit of the input affects every bit of the output 50% of the time,
which is good.	See: http://baagoe.com/en/RandomMusings/hash/avalanche.xhtml
============================================================================
*/


var Mash = function () {
  var n = 0xefc8249d;

  var mash = function (data) {
    if (data) {
      data = data.toString();

      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }

      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    } else {
      n = 0xefc8249d;
    }
  };

  return mash;
};

var uheprng = function (seed) {
  return function () {
    var o = 48; // set the 'order' number of ENTROPY-holding 32-bit values

    var c = 1; // init the 'carry' used by the multiply-with-carry (MWC) algorithm

    var p = o; // init the 'phase' (max-1) of the intermediate variable pointer

    var s = new Array(o); // declare our intermediate variables array

    var i; // general purpose local

    var j; // general purpose local

    var k = 0; // general purpose local
    // when our "uheprng" is initially invoked our PRNG state is initialized from the
    // browser's own local PRNG. This is okay since although its generator might not
    // be wonderful, it's useful for establishing large startup entropy for our usage.

    var mash = new Mash(); // get a pointer to our high-performance "Mash" hash
    // fill the array with initial mash hash values

    for (i = 0; i < o; i++) {
      s[i] = mash(Math.random());
    } // this PRIVATE (internal access only) function is the heart of the multiply-with-carry
    // (MWC) PRNG algorithm. When called it returns a pseudo-random number in the form of a
    // 32-bit JavaScript fraction (0.0 to <1.0) it is a PRIVATE function used by the default
    // [0-1] return function, and by the random 'string(n)' function which returns 'n'
    // characters from 33 to 126.


    var rawprng = function () {
      if (++p >= o) {
        p = 0;
      }

      var t = 1768863 * s[p] + c * 2.3283064365386963e-10; // 2^-32

      return s[p] = t - (c = t | 0);
    }; // this EXPORTED function is the default function returned by this library.
    // The values returned are integers in the range from 0 to range-1. We first
    // obtain two 32-bit fractions (from rawprng) to synthesize a single high
    // resolution 53-bit prng (0 to <1), then we multiply this by the caller's
    // "range" param and take the "floor" to return a equally probable integer.


    var random = function (range) {
      return Math.floor(range * (rawprng() + (rawprng() * 0x200000 | 0) * 1.1102230246251565e-16)); // 2^-53
    }; // this EXPORTED function 'string(n)' returns a pseudo-random string of
    // 'n' printable characters ranging from chr(33) to chr(126) inclusive.


    random.string = function (count) {
      var i;
      var s = '';

      for (i = 0; i < count; i++) {
        s += String.fromCharCode(33 + random(94));
      }

      return s;
    }; // this PRIVATE "hash" function is used to evolve the generator's internal
    // entropy state. It is also called by the EXPORTED addEntropy() function
    // which is used to pour entropy into the PRNG.


    var hash = function () {
      var args = Array.prototype.slice.call(arguments);

      for (i = 0; i < args.length; i++) {
        for (j = 0; j < o; j++) {
          s[j] -= mash(args[i]);

          if (s[j] < 0) {
            s[j] += 1;
          }
        }
      }
    }; // this EXPORTED "clean string" function removes leading and trailing spaces and non-printing
    // control characters, including any embedded carriage-return (CR) and line-feed (LF) characters,
    // from any string it is handed. this is also used by the 'hashstring' function (below) to help
    // users always obtain the same EFFECTIVE uheprng seeding key.


    random.cleanString = function (inStr) {
      inStr = inStr.replace(/(^\s*)|(\s*$)/gi, ''); // remove any/all leading spaces

      inStr = inStr.replace(/[\x00-\x1F]/gi, ''); // remove any/all control characters

      inStr = inStr.replace(/\n /, '\n'); // remove any/all trailing spaces

      return inStr; // return the cleaned up result
    }; // this EXPORTED "hash string" function hashes the provided character string after first removing
    // any leading or trailing spaces and ignoring any embedded carriage returns (CR) or Line Feeds (LF)


    random.hashString = function (inStr) {
      inStr = random.cleanString(inStr);
      mash(inStr); // use the string to evolve the 'mash' state

      for (i = 0; i < inStr.length; i++) {
        // scan through the characters in our string
        k = inStr.charCodeAt(i); // get the character code at the location

        for (j = 0; j < o; j++) {
          //	"mash" it into the UHEPRNG state
          s[j] -= mash(k);

          if (s[j] < 0) {
            s[j] += 1;
          }
        }
      }
    }; // this EXPORTED function allows you to seed the random generator.


    random.seed = function (seed) {
      if (typeof seed === 'undefined' || seed === null) {
        seed = Math.random();
      }

      if (typeof seed !== 'string') {
        seed = stringify(seed, function (key, value) {
          if (typeof value === 'function') {
            return value.toString();
          }

          return value;
        });
      }

      random.initState();
      random.hashString(seed);
    }; // this handy exported function is used to add entropy to our uheprng at any time


    random.addEntropy = function ()
    /* accept zero or more arguments */
    {
      var args = [];

      for (i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      hash(k++ + new Date().getTime() + args.join('') + Math.random());
    }; // if we want to provide a deterministic startup context for our PRNG,
    // but without directly setting the internal state variables, this allows
    // us to initialize the mash hash and PRNG's internal state before providing
    // some hashing input


    random.initState = function () {
      mash(); // pass a null arg to force mash hash to init

      for (i = 0; i < o; i++) {
        s[i] = mash(' '); // fill the array with initial mash hash values
      }

      c = 1; // init our multiply-with-carry carry

      p = o; // init our phase
    }; // we use this (optional) exported function to signal the JavaScript interpreter
    // that we're finished using the "Mash" hash function so that it can free up the
    // local "instance variables" is will have been maintaining.  It's not strictly
    // necessary, of course, but it's good JavaScript citizenship.


    random.done = function () {
      mash = null;
    }; // if we called "uheprng" with a seed value, then execute random.seed() before returning


    if (typeof seed !== 'undefined') {
      random.seed(seed);
    } // Returns a random integer between 0 (inclusive) and range (exclusive)


    random.range = function (range) {
      return random(range);
    }; // Returns a random float between 0 (inclusive) and 1 (exclusive)


    random.random = function () {
      return random(Number.MAX_VALUE - 1) / Number.MAX_VALUE;
    }; // Returns a random float between min (inclusive) and max (exclusive)


    random.floatBetween = function (min, max) {
      return random.random() * (max - min) + min;
    }; // Returns a random integer between min (inclusive) and max (inclusive)


    random.intBetween = function (min, max) {
      return Math.floor(random.random() * (max - min + 1)) + min;
    }; // when our main outer "uheprng" function is called, after setting up our
    // initial variables and entropic state, we return an "instance pointer"
    // to the internal anonymous function which can then be used to access
    // the uheprng's various exported functions.  As with the ".done" function
    // above, we should set the returned value to 'null' once we're finished
    // using any of these functions.


    return random;
  }();
}; // Modification for use in node:


uheprng.create = function (seed) {
  return new uheprng(seed);
};

module.exports = uheprng;
},{"json-stringify-safe":"../node_modules/json-stringify-safe/stringify.js"}],"../js/random.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomWithSeed = getRandomWithSeed;

var _randomSeed = _interopRequireDefault(require("random-seed"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Get a random element from the array based on the seed provided.
function getRandomWithSeed(array, seed) {
  var quantity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var random = (0, _randomSeed.default)(seed);
  var remaining = array.slice();
  var picked = [];

  for (var i = 0; i < quantity; i++) {
    var index = random(remaining.length);
    picked.push(remaining[index]);
    remaining.splice(index, 1);
  }

  return picked;
}
},{"random-seed":"../node_modules/random-seed/index.js"}],"../json/adjectives.json":[function(require,module,exports) {
module.exports = ["Abroad", "Absorbing", "Abstract", "Academic", "Accelerated", "Accented", "Accountant", "Acquainted", "Acute", "Addicting", "Addictive", "Adjustable", "Admired", "Adult", "Adverse", "Advised", "Aerosol", "Afraid", "Aggravated", "Aggressive", "Agreeable", "Alienate", "Aligned", "All-round", "Alleged", "Almond", "Alright", "Altruistic", "Ambient", "Ambivalent", "Amiable", "Amino", "Amorphous", "Amused", "Anatomical", "Ancestral", "Angelic", "Angrier", "Answerable", "Antiquarian", "Antiretroviral", "Appellate", "Applicable", "Apportioned", "Approachable", "Appropriated", "Archer", "Aristotelian", "Aroused", "Arrested", "Arthurian", "Assertive", "Assigned", "Athletic", "Atrocious", "Attained", "Authoritarian", "Autobiographical", "Avaricious", "Avocado", "Awake", "Awsome", "Backstage", "Backwoods", "Balding", "Bandaged", "Banded", "Banned", "Barreled", "Battle", "Beaten", "Begotten", "Beguiled", "Bellied", "Belted", "Beneficent", "Besieged", "Betting", "Big-money", "Biggest", "Biochemical", "Bipolar", "Blackened", "Blame", "Blessed", "Blindfolded", "Bloat", "Blocked", "Blooded", "Blue-collar", "Blushing", "Boastful", "Bohemian", "Bolder", "Bolstered", "Bonnie", "Bored", "Boundary", "Bounded", "Bounding", "Branched", "Brawling", "Brazen", "Breeding", "Brethren", "Bridged", "Brimming", "Brimstone", "Broadest", "Broiled", "Broker", "Bronze", "Bruising", "Buffy", "Bullied", "Bungling", "Burial", "Buttery", "Candied", "Canonical", "Cantankerous", "Cardinal", "Carefree", "Caretaker", "Casual", "Cathartic", "Causal", "Chapel", "Characterized", "Charcoal", "Cheeky", "Cherished", "Chipotle", "Chirping", "Chivalrous", "Circumstantial", "Civic", "Civil", "Civilised", "Clanking", "Clapping", "Claptrap", "Classless", "Cleansed", "Cleric", "Cloistered", "Codified", "Colloquial", "Colour", "Combat", "Combined", "Comely", "Commissioned", "Commonplace", "Commuter", "Commuting", "Comparable", "Complementary", "Compromising", "Conceding", "Concentrated", "Conceptual", "Conditioned", "Confederate", "Confident", "Confidential", "Confining", "Confuse", "Congressional", "Consequential", "Conservative", "Constituent", "Contaminated", "Contemporaneous", "Contraceptive", "Convertible", "Convex", "Cooked", "Coronary", "Corporatist", "Correlated", "Corroborated", "Cosmic", "Cover", "Crash", "Crypto", "Culminate", "Cushioned", "Dandy", "Dashing", "Dazzled", "Decreased", "Decrepit", "Dedicated", "Defaced", "Defective", "Defenseless", "Deluded", "Deodorant", "Departed", "Depress", "Designing", "Despairing", "Destitute", "Detective", "Determined", "Devastating", "Deviant", "Devilish", "Devoted", "Diagonal", "Dictated", "Didactic", "Differentiated", "Diffused", "Dirtier", "Disabling", "Disconnected", "Discovered", "Disdainful", "Diseased", "Disfigured", "Disheartened", "Disheveled", "Disillusioned", "Disparate", "Dissident", "Doable", "Doctrinal", "Doing", "Dotted", "Double-blind", "Downbeat", "Dozen", "Draining", "Draught", "Dread", "Dried", "Dropped", "Dulled", "Duplicate", "Eaten", "Echoing", "Economical", "Elaborated", "Elastic", "Elective", "Electoral", "Elven", "Embryo", "Emerald", "Emergency", "Emissary", "Emotional", "Employed", "Enamel", "Encased", "Encrusted", "Endangered", "Engraved", "Engrossing", "Enlarged", "Enlisted", "Enlivened", "Ensconced", "Entangled", "Enthralling", "Entire", "Envious", "Eradicated", "Eroded", "Esoteric", "Essential", "Evaporated", "Ever-present", "Evergreen", "Everlasting", "Exacting", "Exasperated", "Excess", "Exciting", "Executable", "Existent", "Exonerated", "Exorbitant", "Exponential", "Export", "Extraordinary", "Exultant", "Exulting", "Facsimile", "Fading", "Fainter", "Faith-based", "Fallacious", "Faltering", "Famous", "Fancier", "Fast-growing", "Fated", "Favourable", "Fearless", "Feathered", "Fellow", "Fermented", "Ferocious", "Fiddling", "Filling", "Firmer", "Fitted", "Flammable", "Flawed", "Fledgling", "Fleshy", "Flexible", "Flickering", "Floral", "Flowering", "Flowing", "Foggy", "Folic", "Foolhardy", "Foolish", "Footy", "Forehand", "Forked", "Formative", "Formulaic", "Foul-mouthed", "Fractional", "Fragrant", "Fraudulent", "Freakish", "Freckled", "Freelance", "Freight", "Fresh", "Fretted", "Frugal", "Fulfilling", "Fuming", "Funded", "Funny", "Garbled", "Gathered", "Geologic", "Geometric", "Gibberish", "Gilded", "Ginger", "Glare", "Glaring", "Gleaming", "Glorified", "Glorious", "Goalless", "Gold-plated", "Goody", "Grammatical", "Grande", "Grateful", "Gratuitous", "Graven", "Greener", "Grinding", "Grizzly", "Groaning", "Grudging", "Guaranteed", "Gusty", "Half-breed", "Hand-held", "Handheld", "Hands-off", "Hard-pressed", "Harlot", "Healing", "Healthier", "Healthiest", "Heart", "Heart-shaped", "Heathen", "Hedonistic", "Heralded", "Herbal", "High-density", "High-performance", "High-res", "High-yield", "Hissy", "Hitless", "Holiness", "Homesick", "Honorable", "Hooded", "Hopeless", "Horrendous", "Horrible", "Hot-button", "Huddled", "Human", "Humbling", "Humid", "Humiliating", "Hypnotized", "Idealistic", "Idiosyncratic", "Ignited", "Illustrated", "Illustrative", "Imitated", "Immense", "Immersive", "Immigrant", "Immoral", "Impassive", "Impressionable", "Improbable", "Impulsive", "In-between", "In-flight", "Inattentive", "Inbound", "Inbounds", "Incalculable", "Incomprehensible", "Indefatigable", "Indigo", "Indiscriminate", "Indomitable", "Inert", "Inflate", "Inform", "Inheriting", "Injured", "Injurious", "Inking", "Inoffensive", "Insane", "Insensible", "Insidious", "Insincere", "Insistent", "Insolent", "Insufferable", "Intemperate", "Interdependent", "Interesting", "Interfering", "Intern", "Interpreted", "Intersecting", "Intolerable", "Intolerant", "Intuitive", "Irresolute", "Irritate", "Jealous", "Jerking", "Joining", "Joint", "Journalistic", "Joyful", "Keyed", "Knowing", "Lacklustre", "Laden", "Lagging", "Lamented", "Laughable", "Layered", "Leather", "Leathern", "Leery", "Left-footed", "Legible", "Leisure", "Lessening", "Liberating", "Life-size", "Lifted", "Lightest", "Limitless", "Listening", "Literary", "Liver", "Livid", "Lobster", "Locked", "Long-held", "Long-lasting", "Long-running", "Long-suffering", "Loudest", "Loveliest", "Low-budget", "Low-carb", "Lowering", "Lucid", "Luckless", "Lusty", "Luxurious", "Magazine", "Maniac", "Manmade", "Maroon", "Mastered", "Mated", "Material", "Materialistic", "Meaningful", "Measuring", "Mediaeval", "Medical", "Meditated", "Medley", "Melodic", "Memorable", "Memorial", "Metabolic", "Metallic", "Metallurgical", "Metering", "Midair", "Midterm", "Midway", "Mighty", "Migrating", "Mind-blowing", "Mind-boggling", "Minor", "Mirrored", "Misguided", "Misshapen", "Mitigated", "Mixed", "Modernized", "Molecular", "Monarch", "Monastic", "Morbid", "Mosaic", "Motley", "Motorized", "Mounted", "Multi-million", "Multidisciplinary", "Muscled", "Muscular", "Muted", "Mysterious", "Mythic", "Nail-biting", "Natural", "Nauseous", "Negative", "Networked", "Neurological", "Neutered", "Newest", "Night", "Nitrous", "No-fly", "Noncommercial", "Nonsense", "North", "Nuanced", "Occurring", "Oceanic", "Offensive", "Oldest", "Oncoming", "One-eyed", "One-year", "Onstage", "Onward", "Opaque", "Open-ended", "Operating", "Opportunist", "Opposing", "Opt-in", "Ordinate", "Outdone", "Outlaw", "Outsized", "Overboard", "Overheated", "Oversize", "Overworked", "Oyster", "Paced", "Panting", "Paralyzed", "Paramount", "Parental", "Parted", "Partisan", "Passive", "Pastel", "Patriot", "Peacekeeping", "Pedestrian", "Peevish", "Penal", "Penned", "Pensive", "Perceptual", "Perky", "Permissible", "Pernicious", "Perpetuate", "Perplexed", "Pervasive", "Petrochemical", "Philosophical", "Picturesque", "Pillaged", "Piped", "Piquant", "Pitching", "Plausible", "Pliable", "Plumb", "Politician", "Polygamous", "Poorest", "Portmanteau", "Posed", "Positive", "Possible", "Postpartum", "Prank", "Pre-emptive", "Precocious", "Predicted", "Premium", "Preparatory", "Prerequisite", "Prescient", "Preserved", "Presidential", "Pressed", "Pressurized", "Presumed", "Prewar", "Priced", "Pricier", "Primal", "Primer", "Primetime", "Printed", "Private", "Problem", "Procedural", "Process", "Proctor", "Prodigious", "Professional", "Programmed", "Progressive", "Prolific", "Promising", "Promulgated", "Pronged", "Proportionate", "Protracted", "Pulled", "Pulsed", "Purgatory", "Quick", "Rapid-fire", "Raunchy", "Razed", "Reactive", "Readable", "Realizing", "Recognised", "Recovering", "Recurrent", "Recycled", "Redeemable", "Reflecting", "Regal", "Registering", "Reliable", "Reminiscent", "Remorseless", "Removable", "Renewable", "Repeating", "Repellent", "Reserve", "Resigned", "Respectful", "Rested", "Restrict", "Resultant", "Retaliatory", "Retiring", "Revelatory", "Reverend", "Reversing", "Revolving", "Ridiculous", "Right-hand", "Ringed", "Risque", "Robust", "Roomful", "Rotating", "Roused", "Rubber", "Run-down", "Running", "Runtime", "Rustling", "Safest", "Salient", "Sanctioned", "Saute", "Saved", "Scandalized", "Scarlet", "Scattering", "Sceptical", "Scheming", "Scoundrel", "Scratched", "Scratchy", "Scrolled", "Seated", "Second-best", "Segregated", "Self-taught", "Semiautomatic", "Senior", "Sensed", "Sentient", "Sexier", "Shadowy", "Shaken", "Shaker", "Shameless", "Shaped", "Shiny", "Shipped", "Shivering", "Shoestring", "Short", "Short-lived", "Signed", "Simplest", "Simplistic", "Sizable", "Skeleton", "Skinny", "Skirting", "Skyrocketed", "Slamming", "Slanting", "Slapstick", "Sleek", "Sleepless", "Sleepy", "Slender", "Slimmer", "Smacking", "Smokeless", "Smothered", "Smouldering", "Snuff", "Socialized", "Solid-state", "Sometime", "Sought", "Spanking", "Sparing", "Spattered", "Specialized", "Specific", "Speedy", "Spherical", "Spiky", "Spineless", "Sprung", "Squint", "Stainless", "Standing", "Starlight", "Startled", "Stately", "Statewide", "Stereoscopic", "Sticky", "Stimulant", "Stinky", "Stoked", "Stolen", "Storied", "Strained", "Strapping", "Strengthened", "Stubborn", "Stylized", "Suave", "Subjective", "Subjugated", "Subordinate", "Succeeding", "Suffering", "Summary", "Sunset", "Sunshine", "Supernatural", "Supervisory", "Supply-side", "Surrogate", "Suspended", "Suspenseful", "Swarthy", "Sweating", "Sweeping", "Swinging", "Swooning", "Sympathize", "Synchronized", "Synonymous", "Synthetic", "Tailed", "Tallest", "Tangible", "Tanked", "Tarry", "Technical", "Tectonic", "Telepathic", "Tenderest", "Terran", "Territorial", "Testimonial", "Theistic", "Thicker", "Threatening", "Tight-lipped", "Timed", "Timely", "Timid", "Torrent", "Totalled", "Tougher", "Traditional", "Transformed", "Trapped", "Traveled", "Traverse", "Treated", "Trial", "Trunk", "Trusting", "Trying", "Tudor", "Twisted", "Two-lane", "Tyrannical", "Unaided", "Unassisted", "Unassuming", "Unattractive", "Uncapped", "Uncomfortable", "Uncontrolled", "Uncooked", "Uncooperative", "Underground", "Undersea", "Undisturbed", "Unearthly", "Uneasy", "Unequal", "Unfazed", "Unfinished", "Unforeseen", "Unforgivable", "Unidentified", "Unimaginative", "Uninspired", "Unintended", "Uninvited", "Universal", "Unmasked", "Unorthodox", "Unparalleled", "Unpleasant", "Unprincipled", "Unread", "Unreasonable", "Unregulated", "Unreliable", "Unremitting", "Unsafe", "Unsanitary", "Unsealed", "Unsuccessful", "Unsupervised", "Untimely", "Unwary", "Unwrapped", "Uppity", "Upstart", "Useless", "Utter", "Valiant", "Valid", "Valued", "Vanilla", "Vaulting", "Vaunted", "Veering", "Vegetative", "Vented", "Verbal", "Verifying", "Veritable", "Versed", "Vinyl", "Virgin", "Visceral", "Visual", "Voluptuous", "Walk-on", "Wanton", "Warlike", "Washed", "Waterproof", "Waved", "Weakest", "Well-bred", "Well-chosen", "Well-informed", "Wetting", "Wheeled", "Whirlwind", "Widen", "Widening", "Willful", "Willing", "Winnable", "Winningest", "Wireless", "Wistful", "Woeful", "Wooded", "Woodland", "Wordless", "Workable", "Worldly", "Worldwide", "Worst-case", "Worsted", "Worthless"];
},{}],"../json/characters.json":[function(require,module,exports) {
module.exports = ["Isaac", "Magdalene", "Cain", "???", "Eve", "Samson", "Azazel", "Lazarus", "Eden", "The Lost", "Lilith", "Keeper", "Apollyon"];
},{}],"../json/colours.json":[function(require,module,exports) {
module.exports = [{
  "hex": "#EFDECD",
  "name": "Almond"
}, {
  "hex": "#CD9575",
  "name": "Antique Brass"
}, {
  "hex": "#FDD9B5",
  "name": "Apricot"
}, {
  "hex": "#78DBE2",
  "name": "Aquamarine"
}, {
  "hex": "#87A96B",
  "name": "Asparagus"
}, {
  "hex": "#FFA474",
  "name": "Atomic Tangerine"
}, {
  "hex": "#FAE7B5",
  "name": "Banana Mania"
}, {
  "hex": "#9F8170",
  "name": "Beaver"
}, {
  "hex": "#FD7C6E",
  "name": "Bittersweet"
}, {
  "hex": "#000000",
  "name": "Black"
}, {
  "hex": "#ACE5EE",
  "name": "Blizzard Blue"
}, {
  "hex": "#1F75FE",
  "name": "Blue"
}, {
  "hex": "#A2A2D0",
  "name": "Blue Bell"
}, {
  "hex": "#6699CC",
  "name": "Blue Gray"
}, {
  "hex": "#0D98BA",
  "name": "Blue Green"
}, {
  "hex": "#7366BD",
  "name": "Blue Violet"
}, {
  "hex": "#DE5D83",
  "name": "Blush"
}, {
  "hex": "#CB4154",
  "name": "Brick Red"
}, {
  "hex": "#B4674D",
  "name": "Brown"
}, {
  "hex": "#FF7F49",
  "name": "Burnt Orange"
}, {
  "hex": "#EA7E5D",
  "name": "Burnt Sienna"
}, {
  "hex": "#B0B7C6",
  "name": "Cadet Blue"
}, {
  "hex": "#FFFF99",
  "name": "Canary"
}, {
  "hex": "#1CD3A2",
  "name": "Caribbean Green"
}, {
  "hex": "#FFAACC",
  "name": "Carnation Pink"
}, {
  "hex": "#DD4492",
  "name": "Cerise"
}, {
  "hex": "#1DACD6",
  "name": "Cerulean"
}, {
  "hex": "#BC5D58",
  "name": "Chestnut"
}, {
  "hex": "#DD9475",
  "name": "Copper"
}, {
  "hex": "#9ACEEB",
  "name": "Cornflower"
}, {
  "hex": "#FFBCD9",
  "name": "Cotton Candy"
}, {
  "hex": "#FDDB6D",
  "name": "Dandelion"
}, {
  "hex": "#2B6CC4",
  "name": "Denim"
}, {
  "hex": "#EFCDB8",
  "name": "Desert Sand"
}, {
  "hex": "#6E5160",
  "name": "Eggplant"
}, {
  "hex": "#CEFF1D",
  "name": "Electric Lime"
}, {
  "hex": "#71BC78",
  "name": "Fern"
}, {
  "hex": "#6DAE81",
  "name": "Forest Green"
}, {
  "hex": "#C364C5",
  "name": "Fuchsia"
}, {
  "hex": "#CC6666",
  "name": "Fuzzy Wuzzy"
}, {
  "hex": "#E7C697",
  "name": "Gold"
}, {
  "hex": "#FCD975",
  "name": "Goldenrod"
}, {
  "hex": "#A8E4A0",
  "name": "Granny Smith Apple"
}, {
  "hex": "#95918C",
  "name": "Gray"
}, {
  "hex": "#1CAC78",
  "name": "Green"
}, {
  "hex": "#1164B4",
  "name": "Green Blue"
}, {
  "hex": "#FF1DCE",
  "name": "Hot Magenta"
}, {
  "hex": "#B2EC5D",
  "name": "Inchworm"
}, {
  "hex": "#5D76CB",
  "name": "Indigo"
}, {
  "hex": "#CA3767",
  "name": "Jazzberry Jam"
}, {
  "hex": "#3BB08F",
  "name": "Jungle Green"
}, {
  "hex": "#FCB4D5",
  "name": "Lavender"
}, {
  "hex": "#FFBD88",
  "name": "Macaroni and Cheese"
}, {
  "hex": "#F664AF",
  "name": "Magenta"
}, {
  "hex": "#AAF0D1",
  "name": "Magic Mint"
}, {
  "hex": "#CD4A4C",
  "name": "Mahogany"
}, {
  "hex": "#EDD19C",
  "name": "Maize"
}, {
  "hex": "#979AAA",
  "name": "Manatee"
}, {
  "hex": "#FF8243",
  "name": "Mango Tango"
}, {
  "hex": "#C8385A",
  "name": "Maroon"
}, {
  "hex": "#EF98AA",
  "name": "Mauvelous"
}, {
  "hex": "#FDBCB4",
  "name": "Melon"
}, {
  "hex": "#1A4876",
  "name": "Midnight Blue"
}, {
  "hex": "#30BA8F",
  "name": "Mountain Meadow"
}, {
  "hex": "#C54B8C",
  "name": "Mulberry"
}, {
  "hex": "#1974D2",
  "name": "Navy Blue"
}, {
  "hex": "#FFA343",
  "name": "Neon Carrot"
}, {
  "hex": "#BAB86C",
  "name": "Olive Green"
}, {
  "hex": "#FF7538",
  "name": "Orange"
}, {
  "hex": "#FF2B2B",
  "name": "Orange Red"
}, {
  "hex": "#F8D568",
  "name": "Orange Yellow"
}, {
  "hex": "#E6A8D7",
  "name": "Orchid"
}, {
  "hex": "#414A4C",
  "name": "Outer Space"
}, {
  "hex": "#FF6E4A",
  "name": "Outrageous Orange"
}, {
  "hex": "#1CA9C9",
  "name": "Pacific Blue"
}, {
  "hex": "#FFCFAB",
  "name": "Peach"
}, {
  "hex": "#C5D0E6",
  "name": "Periwinkle"
}, {
  "hex": "#FDDDE6",
  "name": "Piggy Pink"
}, {
  "hex": "#158078",
  "name": "Pine Green"
}, {
  "hex": "#FC74FD",
  "name": "Pink Flamingo"
}, {
  "hex": "#F78FA7",
  "name": "Pink Sherbet"
}, {
  "hex": "#8E4585",
  "name": "Plum"
}, {
  "hex": "#7442C8",
  "name": "Purple Heart"
}, {
  "hex": "#9D81BA",
  "name": "Purple Mountain's Majesty"
}, {
  "hex": "#FE4EDA",
  "name": "Purple Pizzazz"
}, {
  "hex": "#FF496C",
  "name": "Radical Red"
}, {
  "hex": "#D68A59",
  "name": "Raw Sienna"
}, {
  "hex": "#714B23",
  "name": "Raw Umber"
}, {
  "hex": "#FF48D0",
  "name": "Razzle Dazzle Rose"
}, {
  "hex": "#E3256B",
  "name": "Razzmatazz"
}, {
  "hex": "#EE204D",
  "name": "Red"
}, {
  "hex": "#FF5349",
  "name": "Red Orange"
}, {
  "hex": "#C0448F",
  "name": "Red Violet"
}, {
  "hex": "#1FCECB",
  "name": "Robin's Egg Blue"
}, {
  "hex": "#7851A9",
  "name": "Royal Purple"
}, {
  "hex": "#FF9BAA",
  "name": "Salmon"
}, {
  "hex": "#FC2847",
  "name": "Scarlet"
}, {
  "hex": "#76FF7A",
  "name": "Screamin' Green"
}, {
  "hex": "#9FE2BF",
  "name": "Sea Green"
}, {
  "hex": "#A5694F",
  "name": "Sepia"
}, {
  "hex": "#8A795D",
  "name": "Shadow"
}, {
  "hex": "#45CEA2",
  "name": "Shamrock"
}, {
  "hex": "#FB7EFD",
  "name": "Shocking Pink"
}, {
  "hex": "#CDC5C2",
  "name": "Silver"
}, {
  "hex": "#80DAEB",
  "name": "Sky Blue"
}, {
  "hex": "#ECEABE",
  "name": "Spring Green"
}, {
  "hex": "#FFCF48",
  "name": "Sunglow"
}, {
  "hex": "#FD5E53",
  "name": "Sunset Orange"
}, {
  "hex": "#FAA76C",
  "name": "Tan"
}, {
  "hex": "#18A7B5",
  "name": "Teal Blue"
}, {
  "hex": "#EBC7DF",
  "name": "Thistle"
}, {
  "hex": "#FC89AC",
  "name": "Tickle Me Pink"
}, {
  "hex": "#DBD7D2",
  "name": "Timberwolf"
}, {
  "hex": "#17806D",
  "name": "Tropical Rain Forest"
}, {
  "hex": "#DEAA88",
  "name": "Tumbleweed"
}, {
  "hex": "#77DDE7",
  "name": "Turquoise Blue"
}, {
  "hex": "#926EAE",
  "name": "Violet"
}, {
  "hex": "#324AB2",
  "name": "Violet Blue"
}, {
  "hex": "#F75394",
  "name": "Violet Red"
}, {
  "hex": "#FFA089",
  "name": "Vivid Tangerine"
}, {
  "hex": "#8F509D",
  "name": "Vivid Violet"
}, {
  "hex": "#A2ADD0",
  "name": "Wild Blue Yonder"
}, {
  "hex": "#FF43A4",
  "name": "Wild Strawberry"
}, {
  "hex": "#FC6C85",
  "name": "Wild Watermelon"
}, {
  "hex": "#CDA4DE",
  "name": "Wisteria"
}];
},{}],"../json/items.json":[function(require,module,exports) {
module.exports = [{
  "cache": "firedelay",
  "description": "Tears up",
  "gfx": "Collectibles_001_TheSadOnion.png",
  "id": "1",
  "name": "The Sad Onion",
  "type": "passive"
}, {
  "cache": "firedelay damage",
  "description": "Triple shot",
  "gfx": "Collectibles_002_TheInnerEye.png",
  "id": "2",
  "name": "The Inner Eye",
  "type": "passive"
}, {
  "cache": "speed tearcolor tearflag",
  "description": "Homing shots",
  "gfx": "Collectibles_003_SpoonBender.png",
  "id": "3",
  "name": "Spoon Bender",
  "type": "passive"
}, {
  "cache": "damage shotspeed",
  "description": "DMG up",
  "gfx": "Collectibles_004_CricketsHead.png",
  "id": "4",
  "name": "Cricket's Head",
  "type": "passive"
}, {
  "cache": "tearflag shotspeed range",
  "description": "Boomerang tears",
  "gfx": "Collectibles_005_MyReflection.png",
  "id": "5",
  "name": "My Reflection",
  "type": "passive"
}, {
  "cache": "firedelay range tearcolor",
  "description": "Tears up",
  "gfx": "Collectibles_006_NumberOne.png",
  "id": "6",
  "name": "Number One",
  "type": "passive"
}, {
  "cache": "damage",
  "description": "DMG up",
  "gfx": "Collectibles_007_BloodOfTheMartyr.png",
  "id": "7",
  "name": "Blood of the Martyr",
  "type": "passive"
}, {
  "description": "Friends 'till the end",
  "gfx": "Collectibles_008_BrotherBobby.png",
  "id": "8",
  "name": "Brother Bobby",
  "type": "familiar"
}, {
  "description": "Fly love",
  "gfx": "Collectibles_009_Skatole.png",
  "id": "9",
  "name": "Skatole",
  "type": "passive"
}, {
  "description": "Projectile protection ",
  "gfx": "Collectibles_010_HaloOfFlies.png",
  "id": "10",
  "name": "Halo of Flies",
  "type": "familiar"
}, {
  "description": "Extra life",
  "gfx": "Collectibles_011_1Up.png",
  "id": "11",
  "name": "1up!",
  "type": "familiar"
}, {
  "cache": "damage range speed",
  "description": "All stats up!",
  "gfx": "Collectibles_012_MagicMushroom.png",
  "hearts": "100",
  "id": "12",
  "maxhearts": "2",
  "name": "Magic Mushroom",
  "type": "passive"
}, {
  "cache": "speed",
  "description": "Poison touch",
  "gfx": "Collectibles_013_TheVirus.png",
  "id": "13",
  "name": "The Virus",
  "type": "passive"
}, {
  "cache": "range speed",
  "description": "Speed and range up",
  "gfx": "Collectibles_014_RoidRage.png",
  "id": "14",
  "name": "Roid Rage",
  "type": "passive"
}, {
  "description": "HP up",
  "gfx": "Collectibles_015_Heart.png",
  "hearts": "99",
  "id": "15",
  "maxhearts": "2",
  "name": "<3",
  "type": "passive"
}, {
  "description": "HP up",
  "gfx": "Collectibles_016_RawLiver.png",
  "hearts": "99",
  "id": "16",
  "maxhearts": "4",
  "name": "Raw Liver",
  "type": "passive"
}, {
  "description": "99 keys",
  "gfx": "Collectibles_017_SkeletonKey.png",
  "id": "17",
  "keys": "99",
  "name": "Skeleton Key",
  "type": "passive"
}, {
  "coins": "99",
  "description": "$$$",
  "gfx": "Collectibles_018_ADollar.png",
  "id": "18",
  "name": "A Dollar",
  "type": "passive"
}, {
  "bombs": "10",
  "description": "10 bombs",
  "gfx": "Collectibles_019_Boom.png",
  "id": "19",
  "name": "Boom!",
  "type": "passive"
}, {
  "achievement": "8",
  "cache": "flying",
  "description": "We all float down here...",
  "gfx": "Collectibles_020_Transcendence.png",
  "id": "20",
  "name": "Transcendence",
  "type": "passive"
}, {
  "description": "The end is near",
  "gfx": "Collectibles_021_TheCompass.png",
  "id": "21",
  "name": "The Compass",
  "type": "passive"
}, {
  "description": "HP up",
  "gfx": "Collectibles_022_Lunch.png",
  "hearts": "2",
  "id": "22",
  "maxhearts": "2",
  "name": "Lunch",
  "type": "passive"
}, {
  "description": "HP up",
  "gfx": "Collectibles_023_Dinner.png",
  "hearts": "2",
  "id": "23",
  "maxhearts": "2",
  "name": "Dinner",
  "type": "passive"
}, {
  "description": "HP up",
  "gfx": "Collectibles_024_Dessert.png",
  "hearts": "2",
  "id": "24",
  "maxhearts": "2",
  "name": "Dessert",
  "type": "passive"
}, {
  "description": "HP up",
  "gfx": "Collectibles_025_Breakfast.png",
  "hearts": "2",
  "id": "25",
  "maxhearts": "2",
  "name": "Breakfast",
  "type": "passive"
}, {
  "description": "HP up",
  "gfx": "Collectibles_026_RottenMeat.png",
  "hearts": "2",
  "id": "26",
  "maxhearts": "2",
  "name": "Rotten Meat",
  "type": "passive"
}, {
  "cache": "speed",
  "description": "Speed up",
  "gfx": "Collectibles_027_WoodenSpoon.png",
  "id": "27",
  "name": "Wooden Spoon",
  "type": "passive"
}, {
  "cache": "speed",
  "description": "Speed up",
  "gfx": "Collectibles_028_TheBelt.png",
  "id": "28",
  "name": "The Belt",
  "type": "passive"
}, {
  "cache": "range",
  "description": "Range up",
  "gfx": "Collectibles_029_MomsUnderwear.png",
  "id": "29",
  "name": "Mom's Underwear",
  "type": "passive"
}, {
  "cache": "range",
  "description": "Range up",
  "gfx": "Collectibles_030_MomsHeels.png",
  "id": "30",
  "name": "Mom's Heels",
  "type": "passive"
}, {
  "cache": "range",
  "description": "Range up",
  "gfx": "Collectibles_031_MomsLipstick.png",
  "id": "31",
  "name": "Mom's Lipstick",
  "type": "passive"
}, {
  "achievement": "139",
  "cache": "firedelay",
  "description": "Tears up",
  "gfx": "Collectibles_032_WireCoatHanger.png",
  "id": "32",
  "name": "Wire Coat Hanger",
  "type": "passive"
}, {
  "cache": "flying",
  "description": "Temporary flight",
  "gfx": "Collectibles_033_TheBible.png",
  "id": "33",
  "maxcharges": "6",
  "name": "The Bible",
  "type": "active"
}, {
  "cache": "damage",
  "description": "Temporary DMG up",
  "gfx": "Collectibles_034_TheBookOfBelial.png",
  "id": "34",
  "maxcharges": "3",
  "name": "The Book of Belial",
  "type": "active"
}, {
  "achievement": "36",
  "description": "Mass room damage",
  "gfx": "Collectibles_035_TheNecronomicon.png",
  "id": "35",
  "maxcharges": "6",
  "name": "The Necronomicon",
  "type": "active"
}, {
  "description": "Plop!",
  "gfx": "Collectibles_036_ThePoop.png",
  "id": "36",
  "maxcharges": "1",
  "name": "The Poop",
  "type": "active"
}, {
  "description": "Reusable bomb buddy",
  "gfx": "Collectibles_037_MrBoom.png",
  "id": "37",
  "maxcharges": "2",
  "name": "Mr. Boom",
  "type": "active"
}, {
  "description": "Reusable tear burst",
  "gfx": "Collectibles_038_TammysHead.png",
  "id": "38",
  "maxcharges": "1",
  "name": "Tammy's Head",
  "type": "active"
}, {
  "cooldown": "220",
  "description": "Mass fear",
  "gfx": "Collectibles_039_MomsBra.png",
  "id": "39",
  "maxcharges": "3",
  "name": "Mom's Bra",
  "type": "active"
}, {
  "cooldown": "30",
  "description": "Become the bomb!",
  "gfx": "Collectibles_040_Kamikaze.png",
  "id": "40",
  "maxcharges": "0",
  "name": "Kamikaze!",
  "type": "active"
}, {
  "cooldown": "180",
  "description": "Gross...",
  "gfx": "Collectibles_041_MomsPad.png",
  "id": "41",
  "maxcharges": "3",
  "name": "Mom's Pad",
  "type": "active"
}, {
  "description": "Reusable ranged bomb",
  "gfx": "Collectibles_042_BobsRottenHead.png",
  "id": "42",
  "maxcharges": "3",
  "name": "Bob's Rotten Head",
  "type": "active"
}, {
  "cooldown": "30",
  "description": "Teleport!",
  "gfx": "Collectibles_044_Teleport.png",
  "id": "44",
  "maxcharges": "2",
  "name": "Teleport!",
  "type": "active"
}, {
  "description": "Reusable regeneration",
  "gfx": "Collectibles_045_YumHeart.png",
  "id": "45",
  "maxcharges": "4",
  "name": "Yum Heart",
  "type": "active"
}, {
  "cache": "luck",
  "description": "Luck up",
  "gfx": "Collectibles_046_LuckyFoot.png",
  "id": "46",
  "name": "Lucky Foot",
  "type": "passive"
}, {
  "description": "Reusable air strike",
  "gfx": "Collectibles_047_DoctorsRemote.png",
  "id": "47",
  "maxcharges": "2",
  "name": "Doctor's Remote",
  "type": "active"
}, {
  "cache": "tearflag",
  "description": "Piercing shots",
  "gfx": "Collectibles_048_CupidsArrow.png",
  "id": "48",
  "name": "Cupid's Arrow",
  "type": "passive"
}, {
  "description": "BLLLARRRRGGG!",
  "gfx": "Collectibles_049_ShoopDaWhoop.png",
  "id": "49",
  "maxcharges": "2",
  "name": "Shoop da Whoop!",
  "type": "active"
}, {
  "cache": "damage",
  "description": "DMG up",
  "gfx": "Collectibles_050_Steven.png",
  "id": "50",
  "name": "Steven",
  "type": "passive"
}, {
  "cache": "damage",
  "description": "DMG up",
  "gfx": "Collectibles_051_Pentagram.png",
  "id": "51",
  "name": "Pentagram",
  "type": "passive"
}, {
  "achievement": "11",
  "cache": "all",
  "description": "???",
  "gfx": "Collectibles_052_DrFetus.png",
  "id": "52",
  "name": "Dr. Fetus",
  "special": "true",
  "type": "passive"
}, {
  "description": "Item snatcher",
  "gfx": "Collectibles_053_Magneto.png",
  "id": "53",
  "name": "Magneto",
  "type": "passive"
}, {
  "description": "Full visible map",
  "gfx": "Collectibles_054_TreasureMap.png",
  "id": "54",
  "name": "Treasure Map",
  "type": "passive"
}, {
  "description": "Eye in the back of your head",
  "gfx": "Collectibles_055_MomsEye.png",
  "id": "55",
  "name": "Mom's Eye",
  "type": "passive"
}, {
  "description": "Oops...",
  "gfx": "Collectibles_056_LemonMishap.png",
  "id": "56",
  "maxcharges": "2",
  "name": "Lemon Mishap",
  "type": "active"
}, {
  "description": "Attack fly",
  "gfx": "Collectibles_057_DistantAdmiration.png",
  "id": "57",
  "name": "Distant Admiration",
  "type": "familiar"
}, {
  "cooldown": "300",
  "description": "Temporary invincibility",
  "gfx": "Collectibles_058_BookOfShadows.png",
  "id": "58",
  "maxcharges": "3",
  "name": "Book of Shadows",
  "type": "active"
}, {
  "cache": "tearflag",
  "description": "Building bridges",
  "gfx": "Collectibles_060_TheLadder.png",
  "id": "60",
  "name": "The Ladder",
  "type": "passive"
}, {
  "description": "Kills heal",
  "gfx": "Collectibles_062_CharmOfTheVampire.png",
  "id": "62",
  "name": "Charm of the Vampire",
  "type": "passive"
}, {
  "description": "Stores energy",
  "gfx": "Collectibles_063_TheBattery.png",
  "id": "63",
  "name": "The Battery",
  "type": "passive"
}, {
  "description": "50% off",
  "gfx": "Collectibles_064_SteamSale.png",
  "id": "64",
  "name": "Steam Sale",
  "type": "passive"
}, {
  "cooldown": "35",
  "description": "Summon bombs",
  "gfx": "Collectibles_065_AnarchistCookbook.png",
  "id": "65",
  "maxcharges": "3",
  "name": "Anarchist Cookbook",
  "type": "active"
}, {
  "cooldown": "230",
  "description": "Temporary enemy slowdown",
  "gfx": "Collectibles_066_TheHourglass.png",
  "id": "66",
  "maxcharges": "2",
  "name": "The Hourglass",
  "type": "active"
}, {
  "description": "Friends 'till the end",
  "gfx": "Collectibles_067_SisterMaggy.png",
  "id": "67",
  "name": "Sister Maggy",
  "type": "familiar"
}, {
  "cache": "all",
  "description": "Laser tears",
  "gfx": "Collectibles_068_Technology.png",
  "id": "68",
  "name": "Technology",
  "type": "passive"
}, {
  "cache": "all",
  "description": "Charge shots",
  "gfx": "Collectibles_069_ChocolateMilk.png",
  "id": "69",
  "name": "Chocolate Milk",
  "type": "passive"
}, {
  "cache": "damage speed",
  "description": "Speed + DMG up",
  "gfx": "Collectibles_070_GrowthHormones.png",
  "id": "70",
  "name": "Growth Hormones",
  "type": "passive"
}, {
  "cache": "speed range",
  "description": "Speed + range up",
  "gfx": "Collectibles_071_MiniMushroom.png",
  "id": "71",
  "name": "Mini Mush",
  "type": "passive"
}, {
  "description": "Faith up",
  "gfx": "Collectibles_072_Rosary.png",
  "id": "72",
  "name": "Rosary",
  "soulhearts": "6",
  "type": "passive"
}, {
  "achievement": "6",
  "description": "Gotta meat 'em all",
  "gfx": "Collectibles_073_CubeOfMeat.png",
  "id": "73",
  "name": "Cube of Meat",
  "type": "familiar"
}, {
  "achievement": "10",
  "coins": "25",
  "description": " +25 coins",
  "gfx": "Collectibles_074_AQuarter.png",
  "id": "74",
  "name": "A Quarter",
  "type": "passive"
}, {
  "description": "Better pills",
  "gfx": "Collectibles_075_PHD.png",
  "hearts": "4",
  "id": "75",
  "name": "PHD",
  "type": "passive"
}, {
  "description": "I've seen everything",
  "gfx": "Collectibles_076_XrayVision.png",
  "id": "76",
  "name": "X-Ray Vision",
  "type": "passive"
}, {
  "cache": "speed",
  "cooldown": "180",
  "description": "Temporary badass",
  "gfx": "Collectibles_077_MyLittleUnicorn.png",
  "id": "77",
  "maxcharges": "6",
  "name": "My Little Unicorn",
  "type": "active"
}, {
  "achievement": "7",
  "description": "Reusable soul protection",
  "gfx": "Collectibles_078_BookOfRevelations.png",
  "id": "78",
  "maxcharges": "6",
  "name": "Book of Revelations",
  "type": "active"
}, {
  "cache": "damage speed",
  "description": "DMG up",
  "gfx": "Collectibles_079_TheMark.png",
  "id": "79",
  "name": "The Mark",
  "soulhearts": "2",
  "type": "passive"
}, {
  "cache": "damage firedelay",
  "description": "DMG + tears up",
  "devilprice": "2",
  "gfx": "Collectibles_080_ThePact.png",
  "id": "80",
  "name": "The Pact",
  "soulhearts": "4",
  "type": "passive"
}, {
  "description": "9 lives",
  "gfx": "Collectibles_081_DeadCat.png",
  "id": "81",
  "name": "Dead Cat",
  "type": "familiar"
}, {
  "cache": "flying speed",
  "description": "Demon wings",
  "devilprice": "2",
  "gfx": "Collectibles_082_LordOfThePit.png",
  "id": "82",
  "name": "Lord of the Pit",
  "type": "passive"
}, {
  "achievement": "9",
  "cache": "speed damage",
  "description": "Temporary demon form",
  "devilprice": "2",
  "gfx": "Collectibles_083_TheNail.png",
  "id": "83",
  "maxcharges": "6",
  "name": "The Nail",
  "type": "active"
}, {
  "description": "Reusable level skip",
  "gfx": "Collectibles_084_WeNeedToGoDeeper.png",
  "id": "84",
  "maxcharges": "6",
  "name": "We Need To Go Deeper!",
  "type": "active"
}, {
  "description": "Reusable card generator ",
  "gfx": "Collectibles_085_DeckOfCards.png",
  "id": "85",
  "maxcharges": "6",
  "name": "Deck of Cards",
  "type": "active"
}, {
  "achievement": "13",
  "description": "Summon Monstro",
  "gfx": "Collectibles_086_MonstrosTooth.png",
  "id": "86",
  "maxcharges": "3",
  "name": "Monstro's Tooth",
  "type": "active"
}, {
  "achievement": "15",
  "description": "Cross tears",
  "gfx": "Collectibles_087_LokisHorns.png",
  "id": "87",
  "name": "Loki's Horns",
  "type": "passive"
}, {
  "achievement": "14",
  "description": "Attack buddy",
  "gfx": "Collectibles_088_LittleChubby.png",
  "id": "88",
  "name": "Little Chubby",
  "type": "familiar"
}, {
  "cache": "tearcolor tearflag",
  "description": "Slow effect",
  "gfx": "Collectibles_089_SpidersBite.png",
  "id": "89",
  "name": "Spider Bite",
  "type": "passive"
}, {
  "achievement": "12",
  "cache": "tearcolor damage speed firedelay",
  "description": "DMG up",
  "gfx": "Collectibles_090_SmallRock.png",
  "id": "90",
  "name": "The Small Rock",
  "type": "passive"
}, {
  "description": "See-through doors",
  "gfx": "Collectibles_091_SpelunkerHat.png",
  "id": "91",
  "name": "Spelunker Hat",
  "type": "passive"
}, {
  "achievement": "19",
  "description": " +2 hearts",
  "gfx": "Collectibles_092_SuperBandage.png",
  "hearts": "2",
  "id": "92",
  "maxhearts": "2",
  "name": "Super Bandage",
  "soulhearts": "4",
  "type": "passive"
}, {
  "achievement": "26",
  "cooldown": "200",
  "description": "Temporary Man-Pac",
  "gfx": "Collectibles_093_TheGameKid.png",
  "id": "93",
  "maxcharges": "6",
  "name": "The Gamekid",
  "type": "active"
}, {
  "achievement": "21",
  "description": "Gives money",
  "gfx": "Collectibles_094_SackOfPennies.png",
  "id": "94",
  "name": "Sack of Pennies",
  "type": "familiar"
}, {
  "description": "Friends 'till the bbbbzzzt",
  "gfx": "Collectibles_095_RoboBaby.png",
  "id": "95",
  "name": "Robo-Baby",
  "type": "familiar"
}, {
  "achievement": "25",
  "description": "Gives kisses",
  "gfx": "Collectibles_096_LittleChad.png",
  "id": "96",
  "name": "Little C.H.A.D.",
  "type": "familiar"
}, {
  "achievement": "22",
  "description": "Reusable item generator",
  "gfx": "Collectibles_097_BookOfSin.png",
  "id": "97",
  "maxcharges": "4",
  "name": "The Book of Sin",
  "type": "active"
}, {
  "achievement": "20",
  "description": "Soul generator",
  "gfx": "Collectibles_098_TheRelic.png",
  "id": "98",
  "name": "The Relic",
  "type": "familiar"
}, {
  "achievement": "23",
  "description": "Sticky friend",
  "gfx": "Collectibles_099_LittleGish.png",
  "id": "99",
  "name": "Little Gish",
  "type": "familiar"
}, {
  "achievement": "24",
  "description": "Psychic friend",
  "gfx": "Collectibles_100_LittleSteve.png",
  "id": "100",
  "name": "Little Steven",
  "type": "familiar"
}, {
  "achievement": "27",
  "cache": "damage firedelay range speed",
  "description": "All stats up",
  "gfx": "Collectibles_101_TheHalo.png",
  "hearts": "2",
  "id": "101",
  "maxhearts": "2",
  "name": "The Halo",
  "type": "passive"
}, {
  "description": "Reusable pill generator",
  "gfx": "Collectibles_102_MomsBottleOfPills.png",
  "id": "102",
  "maxcharges": "6",
  "name": "Mom's Bottle of Pills",
  "type": "active"
}, {
  "cache": "tearcolor tearflag",
  "description": "Poison damage",
  "gfx": "Collectibles_103_TheCommonCold.png",
  "id": "103",
  "name": "The Common Cold",
  "type": "passive"
}, {
  "achievement": "31",
  "cache": "tearcolor tearflag",
  "description": "Split shot",
  "gfx": "Collectibles_104_TheParasite.png",
  "id": "104",
  "name": "The Parasite",
  "type": "passive"
}, {
  "achievement": "29",
  "description": "Reroll your destiny ",
  "gfx": "Collectibles_105_Dice.png",
  "id": "105",
  "maxcharges": "6",
  "name": "The D6",
  "special": "true",
  "type": "active"
}, {
  "achievement": "28",
  "bombs": "5",
  "description": "Blast damage",
  "gfx": "Collectibles_106_MrMega.png",
  "id": "106",
  "name": "Mr. Mega",
  "type": "passive"
}, {
  "cache": "familiars",
  "description": "Cut and run",
  "gfx": "Collectibles_107_PinkingShears.png",
  "id": "107",
  "maxcharges": "6",
  "name": "The Pinking Shears",
  "type": "active"
}, {
  "description": "Damage resistance",
  "gfx": "Collectibles_108_TheWafer.png",
  "id": "108",
  "name": "The Wafer",
  "type": "passive"
}, {
  "cache": "damage",
  "description": "$$$ = DMG",
  "gfx": "Collectibles_109_MoneyisPower.png",
  "id": "109",
  "name": "Money = Power",
  "type": "passive"
}, {
  "achievement": "35",
  "cache": "tearcolor tearflag range",
  "description": "Freeze effect",
  "gfx": "Collectibles_110_MomsContacts.png",
  "id": "110",
  "name": "Mom's Contacts",
  "type": "passive"
}, {
  "description": "Toot on command",
  "gfx": "Collectibles_111_TheBean.png",
  "id": "111",
  "maxcharges": "1",
  "name": "The Bean",
  "type": "active"
}, {
  "achievement": "45",
  "description": "Extra protection",
  "gfx": "Collectibles_112_GuardianAngel.png",
  "id": "112",
  "name": "Guardian Angel",
  "type": "familiar"
}, {
  "achievement": "47",
  "description": "Auto-turret friend",
  "gfx": "Collectibles_113_DemonBaby.png",
  "id": "113",
  "name": "Demon Baby",
  "type": "familiar"
}, {
  "achievement": "43",
  "cache": "all",
  "description": "Stab stab stab",
  "devilprice": "2",
  "gfx": "Collectibles_114_MomsKnife.png",
  "id": "114",
  "name": "Mom's Knife",
  "special": "true",
  "type": "passive"
}, {
  "cache": "tearflag tearcolor",
  "description": "Spectral tears",
  "gfx": "Collectibles_115_OuijaBoard.png",
  "id": "115",
  "name": "Ouija Board",
  "type": "passive"
}, {
  "description": "Quicker charge",
  "gfx": "Collectibles_116_9Volt.png",
  "id": "116",
  "name": "9 Volt",
  "type": "passive"
}, {
  "cache": "familiars",
  "description": "Protective buddy",
  "gfx": "Collectibles_117_DeadBird.png",
  "id": "117",
  "name": "Dead Bird",
  "type": "passive"
}, {
  "cache": "all",
  "description": "Blood laser barrage",
  "devilprice": "2",
  "gfx": "Collectibles_118_Brimstone.png",
  "id": "118",
  "name": "Brimstone",
  "special": "true",
  "type": "passive"
}, {
  "achievement": "147",
  "cache": "speed",
  "description": "HP up",
  "gfx": "Collectibles_119_BloodBag.png",
  "hearts": "10",
  "id": "119",
  "maxhearts": "2",
  "name": "Blood Bag",
  "type": "passive"
}, {
  "cache": "damage firedelay speed",
  "description": "Fire rate up",
  "gfx": "Collectibles_120_OddMushroomThin.png",
  "id": "120",
  "name": "Odd Mushroom",
  "type": "passive"
}, {
  "cache": "damage speed range",
  "description": "DMG up",
  "gfx": "Collectibles_121_OddMushroomLarge.png",
  "id": "121",
  "maxhearts": "2",
  "name": "Odd Mushroom",
  "type": "passive"
}, {
  "cache": "damage speed",
  "description": "Curse up",
  "gfx": "Collectibles_122_WhoreOFBabylon.png",
  "id": "122",
  "name": "Whore of Babylon",
  "type": "passive"
}, {
  "description": "Temporary buddy generator",
  "gfx": "Collectibles_123_MonsterManual.png",
  "id": "123",
  "maxcharges": "3",
  "name": "Monster Manual",
  "type": "active"
}, {
  "description": "It's a mystery",
  "gfx": "Collectibles_124_DeadSeaScrolls.png",
  "id": "124",
  "maxcharges": "2",
  "name": "Dead Sea Scrolls",
  "type": "active"
}, {
  "bombs": "5",
  "description": "Homing bombs",
  "gfx": "Collectibles_125_BobbyBomb.png",
  "id": "125",
  "name": "Bobby-Bomb",
  "type": "passive"
}, {
  "achievement": "44",
  "cache": "damage",
  "description": "Feel my pain",
  "gfx": "Collectibles_126_RazorBlade.png",
  "id": "126",
  "maxcharges": "0",
  "name": "Razor Blade",
  "type": "active"
}, {
  "achievement": "48",
  "description": "I don't remember...",
  "gfx": "Collectibles_127_ForgetMeNow.png",
  "id": "127",
  "maxcharges": "0",
  "name": "Forget Me Now",
  "type": "active"
}, {
  "description": "Attack fly",
  "gfx": "Collectibles_128_ForeverAlone.png",
  "id": "128",
  "name": "Forever alone",
  "type": "familiar"
}, {
  "cache": "speed",
  "description": "HP up",
  "gfx": "Collectibles_129_BucketofLard.png",
  "hearts": "1",
  "id": "129",
  "maxhearts": "4",
  "name": "Bucket of Lard",
  "type": "passive"
}, {
  "cache": "flying speed",
  "description": "Flight + dash attack",
  "gfx": "Collectibles_130_APony.png",
  "id": "130",
  "maxcharges": "4",
  "name": "A Pony",
  "type": "active"
}, {
  "achievement": "46",
  "description": "Gives bombs",
  "gfx": "Collectibles_131_BombBag.png",
  "id": "131",
  "name": "Bomb Bag",
  "type": "familiar"
}, {
  "cache": "damage tearflag tearcolor",
  "description": "My Xmas present",
  "gfx": "Collectibles_132_ALumpOfCoal.png",
  "id": "132",
  "name": "A Lump of Coal",
  "type": "passive"
}, {
  "description": "Soul converter",
  "gfx": "Collectibles_133_GuppysPaw.png",
  "id": "133",
  "maxcharges": "0",
  "name": "Guppy's Paw",
  "type": "active"
}, {
  "description": "Cursed?",
  "gfx": "Collectibles_134_GuppysTail.png",
  "id": "134",
  "name": "Guppy's Tail",
  "type": "passive"
}, {
  "cooldown": "15",
  "description": "Portable blood bank",
  "gfx": "Collectibles_135_IVBag.png",
  "id": "135",
  "maxcharges": "0",
  "name": "IV Bag",
  "type": "active"
}, {
  "description": "Friends 'till the end",
  "gfx": "Collectibles_136_BestFriend.png",
  "id": "136",
  "maxcharges": "3",
  "name": "Best Friend",
  "type": "active"
}, {
  "bombs": "5",
  "cooldown": "2",
  "description": "Remote bomb detonation",
  "gfx": "Collectibles_137_RemoteDetonator.png",
  "id": "137",
  "maxcharges": "0",
  "name": "Remote Detonator",
  "type": "active"
}, {
  "cache": "damage",
  "description": "DMG + HP up",
  "gfx": "Collectibles_138_Stigmata.png",
  "hearts": "2",
  "id": "138",
  "maxhearts": "2",
  "name": "Stigmata",
  "type": "passive"
}, {
  "description": "More trinket room",
  "gfx": "Collectibles_139_MomsPurse.png",
  "id": "139",
  "name": "Mom's Purse",
  "type": "passive"
}, {
  "bombs": "5",
  "description": " +5 poison bombs",
  "gfx": "Collectibles_140_BobsCurse.png",
  "id": "140",
  "name": "Bob's Curse",
  "type": "passive"
}, {
  "description": "Ultimate grand supreme",
  "gfx": "Collectibles_141_PageantBoy.png",
  "id": "141",
  "name": "Pageant Boy",
  "type": "passive"
}, {
  "description": "You have been blessed",
  "gfx": "Collectibles_142_Scapular.png",
  "id": "142",
  "name": "Scapular",
  "type": "passive"
}, {
  "cache": "speed shotspeed",
  "description": "Speed + shot speed up",
  "gfx": "Collectibles_143_Speedball.png",
  "id": "143",
  "name": "Speed Ball",
  "type": "passive"
}, {
  "description": "He's greedy",
  "gfx": "Collectibles_144_BumFriend.png",
  "id": "144",
  "name": "Bum Friend",
  "type": "familiar"
}, {
  "description": "Reusable fly hive",
  "gfx": "Collectibles_145_GuppysHead.png",
  "id": "145",
  "maxcharges": "1",
  "name": "Guppy's Head",
  "type": "active"
}, {
  "description": "Reusable eternity ",
  "gfx": "Collectibles_146_PrayerCard.png",
  "id": "146",
  "maxcharges": "6",
  "name": "Prayer Card",
  "type": "active"
}, {
  "description": "Rocks don't stand a chance",
  "gfx": "Collectibles_147_NotchedAxe.png",
  "id": "147",
  "maxcharges": "3",
  "name": "Notched Axe",
  "type": "active"
}, {
  "description": "They grow inside",
  "gfx": "Collectibles_148_Infestation.png",
  "id": "148",
  "name": "Infestation",
  "type": "passive"
}, {
  "achievement": "140",
  "cache": "all",
  "description": "Explosive shots",
  "gfx": "Collectibles_149_Ipecac.png",
  "id": "149",
  "name": "Ipecac",
  "type": "passive"
}, {
  "description": "Tooth shot",
  "gfx": "Collectibles_150_ToughLove.png",
  "id": "150",
  "name": "Tough Love",
  "type": "passive"
}, {
  "cache": "tearflag",
  "description": "They grow inside",
  "gfx": "Collectibles_151_TheMulligan.png",
  "id": "151",
  "name": "The Mulligan",
  "type": "passive"
}, {
  "cache": "weapon damage",
  "description": "Laser",
  "gfx": "Collectibles_152_Technology2.png",
  "id": "152",
  "name": "Technology 2",
  "type": "passive"
}, {
  "cache": "firedelay damage",
  "description": "Quad shot",
  "gfx": "Collectibles_153_MutantSpider.png",
  "id": "153",
  "name": "Mutant Spider",
  "special": "true",
  "type": "passive"
}, {
  "cache": "damage",
  "description": "DMG up",
  "gfx": "Collectibles_154_ChemicalPeel.png",
  "id": "154",
  "name": "Chemical Peel",
  "type": "passive"
}, {
  "description": "Plop!",
  "gfx": "Collectibles_155_ThePeeper.png",
  "id": "155",
  "name": "The Peeper",
  "type": "familiar"
}, {
  "description": "Item martyr",
  "gfx": "Collectibles_156_Habit.png",
  "id": "156",
  "name": "Habit",
  "type": "passive"
}, {
  "achievement": "54",
  "cache": "damage",
  "description": "RAGE!",
  "gfx": "Collectibles_157_BloodyLust.png",
  "id": "157",
  "name": "Bloody Lust",
  "type": "passive"
}, {
  "description": "I see my future",
  "gfx": "Collectibles_158_CrystalBall.png",
  "id": "158",
  "maxcharges": "6",
  "name": "Crystal Ball",
  "type": "active"
}, {
  "cache": "flying tearflag tearcolor",
  "description": "Scary",
  "devilprice": "2",
  "gfx": "Collectibles_159_SpiritOfTheNight.png",
  "id": "159",
  "name": "Spirit of the Night",
  "type": "passive"
}, {
  "cooldown": "30",
  "description": "Holy white death",
  "gfx": "Collectibles_160_CrackTheSky.png",
  "id": "160",
  "maxcharges": "4",
  "name": "Crack the Sky",
  "type": "active"
}, {
  "description": "Eternal life?",
  "gfx": "Collectibles_161_Ankh.png",
  "id": "161",
  "name": "Ankh",
  "type": "passive"
}, {
  "achievement": "50",
  "cooldown": "200",
  "description": "You feel blessed",
  "gfx": "Collectibles_162_CelticCross.png",
  "id": "162",
  "name": "Celtic Cross",
  "type": "passive"
}, {
  "description": "Spectral buddy",
  "gfx": "Collectibles_163_GhostBaby.png",
  "id": "163",
  "name": "Ghost Baby",
  "type": "familiar"
}, {
  "achievement": "59",
  "description": "Reusable flames",
  "gfx": "Collectibles_164_BlueCandle.png",
  "id": "164",
  "maxcharges": "110",
  "name": "The Candle",
  "type": "active"
}, {
  "cache": "shotspeed damage",
  "description": "Shot speed + damage up",
  "gfx": "Collectibles_165_CatONineTails.png",
  "id": "165",
  "name": "Cat-o-nine-tails",
  "type": "passive"
}, {
  "achievement": "49",
  "description": "Reroll the basics ",
  "gfx": "Collectibles_166_D20.png",
  "id": "166",
  "maxcharges": "6",
  "name": "D20",
  "type": "active"
}, {
  "description": "Double shot buddy",
  "gfx": "Collectibles_167_HarlequinBaby.png",
  "id": "167",
  "name": "Harlequin Baby",
  "type": "familiar"
}, {
  "achievement": "62",
  "cache": "all",
  "description": "On-demand air strike",
  "gfx": "Collectibles_168_EpicFetus.png",
  "id": "168",
  "name": "Epic Fetus",
  "special": "true",
  "type": "passive"
}, {
  "cache": "damage firedelay tearflag",
  "description": "Mega tears",
  "gfx": "Collectibles_169_Polyphemus.png",
  "id": "169",
  "name": "Polyphemus",
  "special": "true",
  "type": "passive"
}, {
  "description": "Daddy's love",
  "gfx": "Collectibles_170_DaddyLonglegs.png",
  "id": "170",
  "name": "Daddy Longlegs",
  "type": "familiar"
}, {
  "cooldown": "120",
  "description": "Mass enemy slowdown + damage",
  "gfx": "Collectibles_171_SpiderButt.png",
  "id": "171",
  "maxcharges": "2",
  "name": "Spider Butt",
  "type": "active"
}, {
  "achievement": "53",
  "description": "My fate protects me",
  "gfx": "Collectibles_172_SacrificialDagger.png",
  "id": "172",
  "name": "Sacrificial Dagger",
  "type": "familiar"
}, {
  "description": "You feel blessed",
  "gfx": "Collectibles_173_Mitre.png",
  "id": "173",
  "name": "Mitre",
  "type": "passive"
}, {
  "description": "Random buddy",
  "gfx": "Collectibles_174_RainbowBaby.png",
  "id": "174",
  "name": "Rainbow Baby",
  "type": "familiar"
}, {
  "achievement": "58",
  "description": "Opens all doors...",
  "gfx": "Collectibles_175_DadsKey.png",
  "id": "175",
  "maxcharges": "2",
  "name": "Dad's Key",
  "type": "active"
}, {
  "cache": "shotspeed",
  "description": "HP up",
  "gfx": "Collectibles_176_StemCells.png",
  "hearts": "2",
  "id": "176",
  "maxhearts": "2",
  "name": "Stem Cells",
  "type": "passive"
}, {
  "cooldown": "30",
  "description": "Gamble 24/7",
  "gfx": "Collectibles_177_PortableSlot.png",
  "id": "177",
  "maxcharges": "0",
  "name": "Portable Slot",
  "type": "active"
}, {
  "description": "Splash!",
  "gfx": "Collectibles_178_HolyWater.png",
  "id": "178",
  "name": "Holy Water",
  "type": "familiar"
}, {
  "achievement": "113",
  "cache": "flying",
  "description": "Flight eternal",
  "gfx": "Collectibles_179_Fate.png",
  "id": "179",
  "name": "Fate",
  "type": "passive"
}, {
  "description": "Toot on touch",
  "gfx": "Collectibles_180_BlackBean.png",
  "id": "180",
  "name": "The Black Bean",
  "type": "passive"
}, {
  "cache": "flying speed",
  "description": "Flight + holy death",
  "gfx": "Collectibles_181_WhitePony.png",
  "id": "181",
  "maxcharges": "6",
  "name": "White Pony",
  "type": "active"
}, {
  "cache": "damage firedelay range shotspeed tearcolor tearflag",
  "description": "Homing shots + DMG up",
  "gfx": "Collectibles_182_SacredHeart.png",
  "hearts": "99",
  "id": "182",
  "maxhearts": "2",
  "name": "Sacred Heart",
  "special": "true",
  "type": "passive"
}, {
  "cache": "shotspeed firedelay",
  "description": "Tears + shot speed up",
  "gfx": "Collectibles_183_ToothPicks.png",
  "id": "183",
  "name": "Tooth Picks",
  "type": "passive"
}, {
  "cache": "flying",
  "description": "Flight + HP up",
  "gfx": "Collectibles_184_HolyGrail.png",
  "hearts": "2",
  "id": "184",
  "maxhearts": "2",
  "name": "Holy Grail",
  "type": "passive"
}, {
  "cache": "flying tearflag tearcolor",
  "description": "Flight + spectral tears",
  "gfx": "Collectibles_185_DeadDove.png",
  "id": "185",
  "name": "Dead Dove",
  "type": "passive"
}, {
  "achievement": "56",
  "description": "Mass enemy damage at a cost",
  "gfx": "Collectibles_186_BloodRights.png",
  "id": "186",
  "maxcharges": "0",
  "name": "Blood Rights",
  "type": "active"
}, {
  "achievement": "65",
  "description": "Swing it",
  "gfx": "Collectibles_187_GuppysHairball.png",
  "id": "187",
  "name": "Guppy's Hairball",
  "type": "familiar"
}, {
  "achievement": "51",
  "description": "Mirrored buddy",
  "gfx": "Collectibles_188_Abel.png",
  "id": "188",
  "name": "Abel",
  "type": "familiar"
}, {
  "achievement": "63",
  "cache": "firedelay damage speed range",
  "description": "All stats up",
  "gfx": "Collectibles_189_SMBSuperFan.png",
  "hearts": "99",
  "id": "189",
  "maxhearts": "2",
  "name": "SMB Super Fan",
  "type": "passive"
}, {
  "bombs": "99",
  "description": "99 bombs",
  "gfx": "Collectibles_190_Pyro.png",
  "id": "190",
  "name": "Pyro",
  "type": "passive"
}, {
  "description": "Rainbow tears",
  "gfx": "Collectibles_191_3DollarBill.png",
  "id": "191",
  "name": "3 Dollar Bill",
  "type": "passive"
}, {
  "cache": "tearflag tearcolor",
  "description": "Temporary psychic shot",
  "gfx": "Collectibles_192_TelepathyForDummies.png",
  "id": "192",
  "maxcharges": "2",
  "name": "Telepathy For Dummies",
  "type": "active"
}, {
  "cache": "damage",
  "description": "DMG + HP up",
  "gfx": "Collectibles_193_Meat.png",
  "hearts": "2",
  "id": "193",
  "maxhearts": "2",
  "name": "MEAT!",
  "type": "passive"
}, {
  "cache": "shotspeed",
  "description": "Shot speed up",
  "gfx": "Collectibles_194_Magic8Ball.png",
  "id": "194",
  "name": "Magic 8 Ball",
  "type": "passive"
}, {
  "description": "What's all this...?",
  "gfx": "Collectibles_195_MomsCoinPurse.png",
  "id": "195",
  "name": "Mom's Coin Purse",
  "type": "passive"
}, {
  "cache": "firedelay",
  "description": "Tears up",
  "gfx": "Collectibles_196_Squeezy.png",
  "id": "196",
  "name": "Squeezy",
  "type": "passive"
}, {
  "cache": "damage range",
  "description": "Damage + range up",
  "gfx": "Collectibles_197_JesusJuice.png",
  "id": "197",
  "name": "Jesus Juice",
  "type": "passive"
}, {
  "description": "Stuff",
  "gfx": "Collectibles_198_Box.png",
  "id": "198",
  "name": "Box",
  "type": "passive"
}, {
  "description": "Less is now more +2 keys",
  "gfx": "collectibles_199_momskey.png",
  "id": "199",
  "keys": "2",
  "name": "Mom's Key",
  "type": "passive"
}, {
  "cache": "tearcolor",
  "description": "Charm tears",
  "gfx": "collectibles_200_momseyeshadow.png",
  "id": "200",
  "name": "Mom's Eyeshadow",
  "type": "passive"
}, {
  "cache": "damage",
  "description": "Concussive tears",
  "gfx": "collectibles_201_ironbar.png",
  "id": "201",
  "name": "Iron Bar",
  "type": "passive"
}, {
  "description": "Golden touch",
  "gfx": "collectibles_202_midastouch.png",
  "id": "202",
  "name": "Midas' Touch",
  "type": "passive"
}, {
  "description": "1+1 free 4Evar",
  "gfx": "collectibles_203_humblingbundle.png",
  "id": "203",
  "name": "Humbleing Bundle",
  "type": "passive"
}, {
  "description": "Filled with goodies",
  "gfx": "collectibles_204_fannypack.png",
  "id": "204",
  "name": "Fanny Pack",
  "type": "passive"
}, {
  "description": "Charge with blood",
  "gfx": "collectibles_205_sharpplug.png",
  "id": "205",
  "name": "Sharp Plug",
  "type": "passive"
}, {
  "achievement": "107",
  "cache": "damage firedelay",
  "description": "An out-of-body experience",
  "gfx": "collectibles_206_guillotine.png",
  "id": "206",
  "name": "Guillotine",
  "type": "familiar"
}, {
  "achievement": "6",
  "description": "Gotta lick 'em all!",
  "gfx": "collectibles_207_ballofbandages.png",
  "id": "207",
  "name": "Ball of Bandages",
  "type": "familiar"
}, {
  "cache": "damage",
  "description": "DMG + Challenge up",
  "gfx": "collectibles_208_championbelt.png",
  "id": "208",
  "name": "Champion Belt",
  "type": "passive"
}, {
  "bombs": "5",
  "description": "Toxic blast +5 bombs",
  "gfx": "collectibles_209_buttbombs.png",
  "id": "209",
  "name": "Butt Bombs",
  "type": "passive"
}, {
  "description": "Unbreakable",
  "gfx": "Collectibles_210_GnawedLeaf.png",
  "id": "210",
  "name": "Gnawed Leaf",
  "type": "passive"
}, {
  "description": "Spider revenge",
  "gfx": "collectibles_211_spiderbaby.png",
  "id": "211",
  "name": "Spiderbaby",
  "type": "passive"
}, {
  "description": "Eternal life?",
  "gfx": "Collectibles_212_GuppysCollar.png",
  "id": "212",
  "name": "Guppy's Collar",
  "type": "passive"
}, {
  "cache": "shotspeed",
  "description": "Shielded tears",
  "gfx": "collectibles_213_lostcontact.png",
  "id": "213",
  "name": "Lost Contact",
  "type": "passive"
}, {
  "cache": "range",
  "description": "Toxic blood",
  "gfx": "collectibles_214_anemic.png",
  "id": "214",
  "name": "Anemic",
  "type": "passive"
}, {
  "cache": "damage",
  "description": "He accepts your offering",
  "gfx": "collectibles_215_goathead.png",
  "id": "215",
  "name": "Goat Head",
  "type": "passive"
}, {
  "blackhearts": "6",
  "cache": "damage",
  "description": "Sin up",
  "gfx": "Collectibles_216_CeremonialRobes.png",
  "id": "216",
  "name": "Ceremonial Robes",
  "type": "passive"
}, {
  "cache": "firedelay",
  "description": "You feel itchy...",
  "gfx": "collectibles_217_momswig.png",
  "hearts": "2",
  "id": "217",
  "name": "Mom's Wig",
  "type": "passive"
}, {
  "description": "Regeneration + HP up",
  "gfx": "collectibles_218_placenta.png",
  "hearts": "2",
  "id": "218",
  "maxhearts": "2",
  "name": "Placenta",
  "type": "passive"
}, {
  "description": "HP up",
  "gfx": "collectibles_219_oldbandage.png",
  "id": "219",
  "maxhearts": "2",
  "name": "Old Bandage",
  "type": "passive"
}, {
  "bombs": "5",
  "description": "Tear blasts +5 bombs",
  "gfx": "collectibles_220_sadbombs.png",
  "id": "220",
  "name": "Sad Bombs",
  "type": "passive"
}, {
  "achievement": "150",
  "cache": "tearcolor tearflag",
  "description": "Bouncing tears",
  "gfx": "collectibles_221_rubbercement.png",
  "id": "221",
  "name": "Rubber Cement",
  "type": "passive"
}, {
  "cache": "firedelay tearflag",
  "description": "Anti-gravity tears + tears up",
  "gfx": "collectibles_222_antigravity.png",
  "id": "222",
  "name": "Anti-Gravity",
  "type": "passive"
}, {
  "bombs": "5",
  "description": "It hurts so good +5 bombs",
  "gfx": "collectibles_223_pyromaniac.png",
  "id": "223",
  "name": "Pyromaniac",
  "special": "true",
  "type": "passive"
}, {
  "cache": "firedelay range tearflag",
  "description": "Splash damage + tears up",
  "gfx": "collectibles_224_cricketsbody.png",
  "id": "224",
  "name": "Cricket's Body",
  "type": "passive"
}, {
  "description": "Sweet suffering",
  "gfx": "collectibles_225_gimpy.png",
  "id": "225",
  "name": "Gimpy",
  "type": "passive"
}, {
  "blackhearts": "2",
  "description": "HP up x3",
  "gfx": "collectibles_226_blacklotus.png",
  "hearts": "2",
  "id": "226",
  "maxhearts": "2",
  "name": "Black Lotus",
  "soulhearts": "2",
  "type": "passive"
}, {
  "coins": "3",
  "description": "My life savings",
  "gfx": "collectibles_227_piggybank.png",
  "id": "227",
  "name": "Piggy Bank",
  "type": "passive"
}, {
  "cache": "firedelay tearcolor",
  "description": "Fear shot",
  "gfx": "collectibles_228_momsperfume.png",
  "id": "228",
  "name": "Mom's Perfume",
  "type": "passive"
}, {
  "cache": "all",
  "description": "Charged attack",
  "gfx": "collectibles_229_monstroslung.png",
  "id": "229",
  "name": "Monstro's Lung",
  "type": "passive"
}, {
  "achievement": "128",
  "cache": "damage speed",
  "description": "Evil + DMG up + fear shot",
  "devilprice": "2",
  "gfx": "collectibles_230_abaddon.png",
  "id": "230",
  "name": "Abaddon",
  "type": "passive"
}, {
  "cache": "tearcolor",
  "description": "Sticky feet...",
  "gfx": "collectibles_231_balloftar.png",
  "id": "231",
  "name": "Ball of Tar",
  "type": "passive"
}, {
  "achievement": "138",
  "cache": "speed",
  "description": "Let's slow this down a bit...",
  "gfx": "collectibles_232_stopwatch.png",
  "id": "232",
  "name": "Stop Watch",
  "type": "passive"
}, {
  "cache": "all",
  "description": "Orbiting tears + range up",
  "gfx": "collectibles_233_tinyplanet.png",
  "id": "233",
  "name": "Tiny Planet",
  "type": "passive"
}, {
  "description": "Infestation shot",
  "gfx": "collectibles_234_infestation2.png",
  "id": "234",
  "name": "Infestation 2",
  "type": "passive"
}, {
  "description": "Turdy touch",
  "gfx": "collectibles_236_ecoli.png",
  "id": "236",
  "name": "E. Coli",
  "type": "passive"
}, {
  "achievement": "103",
  "cache": "tearflag firedelay damage",
  "description": "Penetrative shot + DMG up",
  "devilprice": "2",
  "gfx": "collectibles_237_deathstouch.png",
  "id": "237",
  "name": "Death's Touch",
  "type": "passive"
}, {
  "description": "???",
  "gfx": "collectibles_238_keypiece1.png",
  "id": "238",
  "name": "Key Piece 1",
  "type": "familiar"
}, {
  "description": "???",
  "gfx": "collectibles_239_keypiece2.png",
  "id": "239",
  "name": "Key Piece 2",
  "type": "familiar"
}, {
  "achievement": "141",
  "cache": "all",
  "description": "All stats up... then shuffled",
  "gfx": "collectibles_240_experimentaltreatment.png",
  "id": "240",
  "name": "Experimental Treatment",
  "type": "passive"
}, {
  "description": "Wealth... but at what cost?",
  "gfx": "collectibles_241_contractfrombelow.png",
  "id": "241",
  "name": "Contract from Below",
  "type": "passive"
}, {
  "description": "Damage reduction",
  "gfx": "collectibles_242_infamy.png",
  "id": "242",
  "name": "Infamy",
  "type": "passive"
}, {
  "cache": "weapon",
  "description": "You feel guarded ",
  "gfx": "collectibles_243_trinityshield.png",
  "id": "243",
  "name": "Trinity Shield",
  "type": "passive"
}, {
  "achievement": "104",
  "description": "It's still being tested...",
  "gfx": "collectibles_244_techpointfive.png",
  "id": "244",
  "name": "Tech.5",
  "type": "passive"
}, {
  "description": "Double shot",
  "gfx": "collectibles_245_2020.png",
  "id": "245",
  "name": "20/20",
  "type": "passive"
}, {
  "achievement": "134",
  "description": "Secrets",
  "gfx": "collectibles_246_bluemap.png",
  "id": "246",
  "name": "Blue Map",
  "type": "passive"
}, {
  "description": "Your friends rule",
  "gfx": "collectibles_247_bffs.png",
  "id": "247",
  "name": "BFFS!",
  "type": "passive"
}, {
  "description": "Giant spiders and flies",
  "gfx": "collectibles_248_hivemind.png",
  "id": "248",
  "name": "Hive Mind",
  "type": "passive"
}, {
  "achievement": "135",
  "description": "More options",
  "gfx": "collectibles_249_theresoptions.png",
  "id": "249",
  "name": "There's Options",
  "type": "passive"
}, {
  "description": "1+1 BOOM!",
  "gfx": "collectibles_250_bogobombs.png",
  "id": "250",
  "name": "BOGO Bombs",
  "type": "passive"
}, {
  "description": "Extra card room",
  "gfx": "collectibles_251_starterdeck.png",
  "id": "251",
  "name": "Starter Deck",
  "type": "passive"
}, {
  "achievement": "146",
  "description": "Extra pill room",
  "gfx": "collectibles_252_littlebaggy.png",
  "id": "252",
  "name": "Little Baggy",
  "type": "passive"
}, {
  "cache": "luck",
  "description": "HP + luck up",
  "gfx": "collectibles_253_magicscab.png",
  "hearts": "2",
  "id": "253",
  "maxhearts": "2",
  "name": "Magic Scab",
  "type": "passive"
}, {
  "description": "DMG + range up",
  "gfx": "collectibles_254_bloodclot.png",
  "id": "254",
  "name": "Blood Clot",
  "type": "passive"
}, {
  "cache": "firedelay shotspeed",
  "description": "Tears + shot speed up",
  "gfx": "collectibles_255_screw.png",
  "id": "255",
  "name": "Screw",
  "type": "passive"
}, {
  "bombs": "5",
  "description": "Burning blast +5 bombs",
  "gfx": "collectibles_256_hotbombs.png",
  "id": "256",
  "name": "Hot Bombs",
  "type": "passive"
}, {
  "cache": "tearflag",
  "description": "Flaming tears",
  "gfx": "collectibles_257_firemind.png",
  "id": "257",
  "name": "Fire Mind",
  "type": "passive"
}, {
  "achievement": "105",
  "cache": "all",
  "description": "Syntax error",
  "gfx": "collectibles_258_missingno.png",
  "id": "258",
  "name": "Missing No.",
  "type": "passive"
}, {
  "cache": "damage",
  "description": "Fear shot",
  "gfx": "collectibles_259_darkmatter.png",
  "id": "259",
  "name": "Dark Matter",
  "type": "passive"
}, {
  "achievement": "136",
  "blackhearts": "2",
  "cache": "damage",
  "description": "Curse immunity + evil up",
  "gfx": "collectibles_260_blackcandle.png",
  "id": "260",
  "name": "Black Candle",
  "type": "passive"
}, {
  "cache": "tearflag damage",
  "description": "Short range mega tears",
  "gfx": "collectibles_261_proptosis.png",
  "id": "261",
  "name": "Proptosis",
  "type": "passive"
}, {
  "blackhearts": "2",
  "cache": "damage",
  "description": "Evil up. Your enemies will pay!",
  "gfx": "collectibles_262_missingpage2.png",
  "id": "262",
  "name": "Missing Page 2",
  "type": "passive"
}, {
  "description": "Revenge fly",
  "gfx": "collectibles_264_smartfly.png",
  "id": "264",
  "name": "Smart Fly",
  "type": "familiar"
}, {
  "description": "Immortal friend",
  "gfx": "collectibles_265_drybaby.png",
  "id": "265",
  "name": "Dry Baby",
  "type": "familiar"
}, {
  "description": "Sticky babies",
  "gfx": "collectibles_266_juicysack.png",
  "id": "266",
  "name": "Juicy Sack",
  "type": "familiar"
}, {
  "achievement": "102",
  "description": "We worked out all the kinks",
  "gfx": "collectibles_267_robobaby2.png",
  "id": "267",
  "name": "Robo-Baby 2.0",
  "type": "familiar"
}, {
  "description": "Infested friend",
  "gfx": "collectibles_268_rottenbaby.png",
  "id": "268",
  "name": "Rotten Baby",
  "type": "familiar"
}, {
  "description": "Bloody friend",
  "gfx": "collectibles_269_headlessbaby.png",
  "id": "269",
  "name": "Headless Baby",
  "type": "familiar"
}, {
  "description": "Blood sucker",
  "gfx": "collectibles_270_leech.png",
  "id": "270",
  "name": "Leech",
  "type": "familiar"
}, {
  "achievement": "124",
  "description": "?",
  "gfx": "collectibles_271_mysterysack.png",
  "id": "271",
  "name": "Mystery Sack",
  "type": "familiar"
}, {
  "description": "Big Beautiful Fly",
  "gfx": "collectibles_272_bff.png",
  "id": "272",
  "name": "BBF",
  "type": "familiar"
}, {
  "description": "Explosive thoughts",
  "gfx": "collectibles_273_bobsbrain.png",
  "id": "273",
  "name": "Bob's Brain",
  "type": "familiar"
}, {
  "description": "Sworn protector",
  "gfx": "collectibles_274_bestbud.png",
  "id": "274",
  "name": "Best Bud",
  "type": "familiar"
}, {
  "description": "Evil friend",
  "devilprice": "2",
  "gfx": "collectibles_275_lilbrimstone.png",
  "id": "275",
  "name": "Lil Brimstone",
  "type": "familiar"
}, {
  "achievement": "129",
  "description": "Protect it",
  "gfx": "collectibles_276_isaacsheart.png",
  "id": "276",
  "name": "Isaac's Heart",
  "type": "familiar"
}, {
  "description": "Fear him",
  "gfx": "collectibles_277_lilhaunt.png",
  "id": "277",
  "name": "Lil Haunt",
  "type": "familiar"
}, {
  "description": "He wants to take your life",
  "gfx": "collectibles_278_darkbum.png",
  "id": "278",
  "name": "Dark Bum",
  "type": "familiar"
}, {
  "description": "Fat protector",
  "gfx": "collectibles_279_bigfan.png",
  "id": "279",
  "name": "Big Fan",
  "type": "familiar"
}, {
  "description": "She loves you",
  "gfx": "collectibles_280_sissylonglegs.png",
  "id": "280",
  "name": "Sissy Longlegs",
  "type": "familiar"
}, {
  "description": "Scape goat",
  "gfx": "collectibles_281_punchingbag.png",
  "id": "281",
  "name": "Punching Bag",
  "type": "familiar"
}, {
  "cooldown": "14",
  "description": "It's time you learned how",
  "gfx": "collectibles_282_howtojump.png",
  "id": "282",
  "maxcharges": "0",
  "name": "How to Jump",
  "type": "active"
}, {
  "achievement": "133",
  "description": "REEROLLLLL!",
  "gfx": "collectibles_283_d100.png",
  "id": "283",
  "maxcharges": "6",
  "name": "D100",
  "special": "true",
  "type": "active"
}, {
  "achievement": "148",
  "description": "Reroll into something else",
  "gfx": "collectibles_284_d4.png",
  "id": "284",
  "maxcharges": "6",
  "name": "D4",
  "type": "active"
}, {
  "description": "Reroll enemies",
  "gfx": "collectibles_285_d10.png",
  "id": "285",
  "maxcharges": "1",
  "name": "D10",
  "type": "active"
}, {
  "achievement": "121",
  "description": "Card mimic",
  "gfx": "collectibles_286_blankcard.png",
  "id": "286",
  "maxcharges": "4",
  "name": "Blank Card",
  "type": "active"
}, {
  "achievement": "122",
  "description": "???",
  "gfx": "collectibles_287_bookofsecrets.png",
  "id": "287",
  "maxcharges": "6",
  "name": "Book of Secrets",
  "type": "active"
}, {
  "description": "It's a box of spiders",
  "gfx": "collectibles_288_boxofspiders.png",
  "id": "288",
  "maxcharges": "2",
  "name": "Box of Spiders",
  "type": "active"
}, {
  "achievement": "137",
  "description": "Flame on",
  "gfx": "collectibles_289_redcandle.png",
  "id": "289",
  "maxcharges": "110",
  "name": "Red Candle",
  "type": "active"
}, {
  "description": "Save your life",
  "gfx": "collectibles_290_thejar.png",
  "id": "290",
  "maxcharges": "0",
  "name": "The Jar",
  "type": "active"
}, {
  "description": "...",
  "gfx": "collectibles_291_flush.png",
  "id": "291",
  "maxcharges": "6",
  "name": "Flush!",
  "type": "active"
}, {
  "achievement": "126",
  "description": "Reusable evil",
  "devilprice": "2",
  "gfx": "collectibles_292_satanicbible.png",
  "id": "292",
  "maxcharges": "6",
  "name": "Satanic Bible",
  "type": "active"
}, {
  "achievement": "143",
  "description": "Krampus rage",
  "gfx": "collectibles_293_headofkrampus.png",
  "id": "293",
  "maxcharges": "6",
  "name": "Head of Krampus",
  "type": "active"
}, {
  "achievement": "145",
  "description": "Reusable knock-back",
  "gfx": "collectibles_294_butterbean.png",
  "id": "294",
  "maxcharges": "90",
  "name": "Butter Bean",
  "type": "active"
}, {
  "description": "Pay to play",
  "gfx": "collectibles_295_magicfingers.png",
  "id": "295",
  "maxcharges": "0",
  "name": "Magic Fingers",
  "type": "active"
}, {
  "description": "Convert your soul",
  "gfx": "collectibles_296_converter.png",
  "id": "296",
  "maxcharges": "0",
  "name": "Converter",
  "type": "active"
}, {
  "achievement": "119",
  "description": "? ?",
  "gfx": "collectibles_297_bluebox.png",
  "id": "297",
  "maxcharges": "0",
  "name": "Pandora's Box",
  "type": "active"
}, {
  "cache": "speed",
  "cooldown": "180",
  "description": "You feel stumped",
  "gfx": "collectibles_298_unicornstump.png",
  "id": "298",
  "maxcharges": "1",
  "name": "Unicorn Stump",
  "type": "active"
}, {
  "cache": "speed",
  "description": "Speed down + rage is building",
  "gfx": "collectibles_299_taurus.png",
  "id": "299",
  "name": "Taurus",
  "type": "passive"
}, {
  "cache": "speed",
  "description": "Ramming speed",
  "gfx": "collectibles_300_aries.png",
  "id": "300",
  "name": "Aries",
  "type": "passive"
}, {
  "description": "HP up + you feel protected",
  "gfx": "collectibles_301_cancer.png",
  "id": "301",
  "name": "Cancer",
  "soulhearts": "6",
  "type": "passive"
}, {
  "description": "Stompy",
  "gfx": "collectibles_302_leo.png",
  "id": "302",
  "name": "Leo",
  "type": "passive"
}, {
  "description": "You feel refreshed and protected",
  "gfx": "collectibles_303_virgo.png",
  "id": "303",
  "name": "Virgo",
  "type": "passive"
}, {
  "bombs": "6",
  "cache": "speed firedelay damage range",
  "coins": "6",
  "description": "You feel balanced",
  "gfx": "collectibles_304_libra.png",
  "id": "304",
  "keys": "6",
  "name": "Libra",
  "type": "passive"
}, {
  "cache": "tearflag",
  "description": "Poison tears",
  "gfx": "collectibles_305_scorpio.png",
  "id": "305",
  "name": "Scorpio",
  "type": "passive"
}, {
  "cache": "tearflag speed",
  "description": "Penetrative shot + speed up",
  "gfx": "collectibles_306_sagittarius.png",
  "id": "306",
  "name": "Sagittarius",
  "type": "passive"
}, {
  "bombs": "1",
  "cache": "speed firedelay damage range",
  "coins": "1",
  "description": "All stats up",
  "gfx": "collectibles_307_capricorn.png",
  "hearts": "2",
  "id": "307",
  "keys": "1",
  "maxhearts": "2",
  "name": "Capricorn",
  "type": "passive"
}, {
  "description": "Trail of tears",
  "gfx": "collectibles_308_aquarius.png",
  "id": "308",
  "name": "Aquarius",
  "type": "passive"
}, {
  "cache": "firedelay tearflag",
  "description": "Tears up + knock-back shot",
  "gfx": "collectibles_309_pisces.png",
  "id": "309",
  "name": "Pisces",
  "type": "passive"
}, {
  "achievement": "112",
  "cache": "shotspeed damage tearcolor firedelay",
  "description": "Shot speed down + DMG up",
  "gfx": "collectibles_310_evesmascara.png",
  "id": "310",
  "name": "Eve's Mascara",
  "type": "passive"
}, {
  "achievement": "108",
  "description": "Sweet revenge",
  "devilprice": "2",
  "gfx": "collectibles_311_judasshadow.png",
  "id": "311",
  "name": "Judas' Shadow",
  "type": "passive"
}, {
  "achievement": "109",
  "description": "HP up + you feel healthy",
  "gfx": "collectibles_312_maggysbow.png",
  "hearts": "2",
  "id": "312",
  "maxhearts": "2",
  "name": "Maggy's Bow",
  "type": "passive"
}, {
  "description": "Holy shield",
  "gfx": "collectibles_313_holymantle.png",
  "id": "313",
  "name": "Holy Mantle",
  "type": "passive"
}, {
  "cache": "speed",
  "description": "HP up + speed down + you feel stompy",
  "gfx": "collectibles_314_thunderthighs.png",
  "hearts": "2",
  "id": "314",
  "maxhearts": "2",
  "name": "Thunder Thighs",
  "type": "passive"
}, {
  "cache": "tearflag",
  "description": "Magnetic tears",
  "gfx": "collectibles_315_strangeattractor.png",
  "id": "315",
  "name": "Strange Attractor",
  "type": "passive"
}, {
  "cache": "all",
  "description": "Cursed charge shot",
  "gfx": "collectibles_316_cursedeye.png",
  "id": "316",
  "name": "Cursed Eye",
  "type": "passive"
}, {
  "cache": "tearflag",
  "description": "Toxic splash damage",
  "gfx": "collectibles_317_mysteriousliquid.png",
  "id": "317",
  "name": "Mysterious Liquid",
  "type": "passive"
}, {
  "description": "Conjoined friend",
  "gfx": "collectibles_318_gemini.png",
  "id": "318",
  "name": "Gemini",
  "type": "familiar"
}, {
  "achievement": "110",
  "description": "Near-sighted friend",
  "gfx": "collectibles_319_cainseye.png",
  "id": "319",
  "name": "Cain's Other Eye",
  "type": "familiar"
}, {
  "achievement": "114",
  "description": "Controlled friend",
  "gfx": "collectibles_320_bluebabysonlyfriend.png",
  "id": "320",
  "name": "???'s Only Friend",
  "type": "familiar"
}, {
  "achievement": "115",
  "description": "The ol' ball and chain",
  "gfx": "collectibles_321_samsonschains.png",
  "id": "321",
  "name": "Samson's Chains",
  "type": "familiar"
}, {
  "description": "Mongo friend",
  "gfx": "collectibles_322_mongobaby.png",
  "id": "322",
  "name": "Mongo Baby",
  "type": "familiar"
}, {
  "achievement": "106",
  "description": "Collected tears",
  "gfx": "collectibles_323_isaacstears.png",
  "id": "323",
  "maxcharges": "6",
  "name": "Isaac's Tears",
  "type": "active"
}, {
  "achievement": "125",
  "description": "Undefined",
  "gfx": "collectibles_324_Undefined.png",
  "id": "324",
  "maxcharges": "6",
  "name": "Undefined",
  "type": "active"
}, {
  "achievement": "30",
  "cache": "familiars",
  "description": "Lose your head",
  "gfx": "collectibles_325_scissors.png",
  "id": "325",
  "maxcharges": "2",
  "name": "Scissors",
  "type": "active"
}, {
  "cooldown": "31",
  "description": "Invincibility at a cost",
  "gfx": "collectibles_326_breathoflife.png",
  "id": "326",
  "maxcharges": "6",
  "name": "Breath of Life",
  "type": "active"
}, {
  "achievement": "57",
  "cooldown": "150",
  "description": "Fate chosen",
  "gfx": "collectibles_327_thepolaroid.png",
  "id": "327",
  "name": "The Polaroid",
  "type": "passive"
}, {
  "achievement": "78",
  "description": "Fate chosen",
  "gfx": "collectibles_328_thenegative.png",
  "id": "328",
  "name": "The Negative",
  "type": "passive"
}, {
  "cache": "all",
  "description": "Controlled tears",
  "gfx": "collectibles_329_theludovicotechnique.png",
  "id": "329",
  "name": "The Ludovico Technique",
  "special": "true",
  "type": "passive"
}, {
  "cache": "firedelay damage tearcolor",
  "description": "DMG down + tears way up",
  "gfx": "collectibles_330_soymilk.png",
  "id": "330",
  "name": "Soy Milk",
  "type": "passive"
}, {
  "achievement": "156",
  "cache": "tearflag shotspeed firedelay range damage",
  "description": "God tears",
  "gfx": "collectibles_331_godhead.png",
  "id": "331",
  "name": "Godhead",
  "special": "true",
  "type": "passive"
}, {
  "achievement": "116",
  "cache": "",
  "description": "Eternal life?",
  "gfx": "collectibles_332_lazarusrags.png",
  "id": "332",
  "name": "Lazarus' Rags",
  "type": "passive"
}, {
  "achievement": "130",
  "cache": "",
  "description": "I know all",
  "gfx": "collectibles_333_mind.png",
  "id": "333",
  "name": "The Mind",
  "type": "passive"
}, {
  "achievement": "131",
  "cache": "",
  "description": "I feel all",
  "gfx": "collectibles_334_body.png",
  "hearts": "6",
  "id": "334",
  "maxhearts": "6",
  "name": "The Body",
  "type": "passive"
}, {
  "achievement": "132",
  "cache": "",
  "description": "I am all",
  "gfx": "collectibles_335_soul.png",
  "id": "335",
  "name": "The Soul",
  "soulhearts": "4",
  "type": "passive"
}, {
  "cache": "tearcolor tearflag range shotspeed",
  "description": "Toxic aura tears",
  "gfx": "collectibles_336_deadonion.png",
  "id": "336",
  "name": "Dead Onion",
  "type": "passive"
}, {
  "cache": "",
  "description": "I think it's broken",
  "gfx": "collectibles_337_brokenwatch.png",
  "id": "337",
  "name": "Broken Watch",
  "type": "passive"
}, {
  "description": "It will never leave you",
  "gfx": "collectibles_338_boomerang.png",
  "id": "338",
  "maxcharges": "70",
  "name": "The Boomerang",
  "type": "active"
}, {
  "blackhearts": "2",
  "cache": "range shotspeed damage",
  "description": "Evil + range + shot speed up",
  "gfx": "collectibles_339_SafetyPin.png",
  "id": "339",
  "name": "Safety Pin",
  "type": "passive"
}, {
  "cache": "speed",
  "description": "Speed up + size down",
  "gfx": "collectibles_340_CaffeinePill.png",
  "id": "340",
  "name": "Caffeine Pill",
  "type": "passive"
}, {
  "cache": "shotspeed firedelay",
  "description": "Tears + shot speed up",
  "gfx": "collectibles_341_TornPhoto.png",
  "id": "341",
  "name": "Torn Photo",
  "type": "passive"
}, {
  "cache": "shotspeed firedelay",
  "description": "HP + tears up + shot speed down",
  "gfx": "collectibles_342_BlueCap.png",
  "hearts": "2",
  "id": "342",
  "maxhearts": "2",
  "name": "Blue Cap",
  "type": "passive"
}, {
  "cache": "luck",
  "description": "Luck up",
  "gfx": "collectibles_343_LatchKey.png",
  "id": "343",
  "name": "Latch Key",
  "soulhearts": "2",
  "type": "passive"
}, {
  "blackhearts": "2",
  "cache": "damage",
  "description": "Evil up",
  "gfx": "collectibles_344_MatchBook.png",
  "id": "344",
  "name": "Match Book",
  "type": "passive"
}, {
  "cache": "damage range",
  "description": "DMG + range up",
  "gfx": "collectibles_345_Synthoil.png",
  "id": "345",
  "name": "Synthoil",
  "type": "passive"
}, {
  "description": "HP up",
  "gfx": "collectibles_346_ASnack.png",
  "hearts": "2",
  "id": "346",
  "maxhearts": "2",
  "name": "A Snack",
  "type": "passive"
}, {
  "description": "Double item vision",
  "gfx": "Collectibles_347_Diplopia.png",
  "id": "347",
  "maxcharges": "0",
  "name": "Diplopia",
  "type": "active"
}, {
  "description": "Pill mimic",
  "gfx": "Collectibles_348_Placebo.png",
  "id": "348",
  "maxcharges": "4",
  "name": "Placebo",
  "type": "active"
}, {
  "achievement": "244",
  "description": "Flip a coin",
  "gfx": "Collectibles_349_WoodenNickel.png",
  "id": "349",
  "maxcharges": "1",
  "name": "Wooden Nickel",
  "type": "active"
}, {
  "description": "Mass poison",
  "gfx": "Collectibles_350_ToxicShock.png",
  "id": "350",
  "name": "Toxic Shock",
  "type": "passive"
}, {
  "description": "Giga fart!",
  "gfx": "Collectibles_351_MegaBean.png",
  "id": "351",
  "maxcharges": "3",
  "name": "Mega Bean",
  "type": "active"
}, {
  "description": "Be gentle...",
  "gfx": "Collectibles_352_GlassCannon.png",
  "id": "352",
  "maxcharges": "110",
  "name": "Glass Cannon",
  "type": "active"
}, {
  "bombs": "5",
  "description": "Explosive blast!",
  "gfx": "Collectibles_353_BomberBoy.png",
  "id": "353",
  "name": "Bomber Boy",
  "type": "passive"
}, {
  "description": "Don't swallow the prize!",
  "gfx": "Collectibles_354_CrackJacks.png",
  "hearts": "2",
  "id": "354",
  "maxhearts": "2",
  "name": "Crack Jacks",
  "type": "passive"
}, {
  "cache": "luck range",
  "description": "Range + luck up",
  "gfx": "Collectibles_355_MomsPearls.png",
  "id": "355",
  "name": "Mom's Pearls",
  "type": "passive"
}, {
  "description": "Double charge!",
  "gfx": "Collectibles_356_CarBattery.png",
  "id": "356",
  "name": "Car Battery",
  "type": "passive"
}, {
  "achievement": "203",
  "cache": "familiars",
  "description": "Double your friends",
  "gfx": "Collectibles_357_PandorasBox.png",
  "id": "357",
  "maxcharges": "4",
  "name": "Box of Friends",
  "type": "active"
}, {
  "cache": "tearflag",
  "description": "Double wiz shot!",
  "gfx": "Collectibles_358_TheWiz.png",
  "id": "358",
  "name": "The Wiz",
  "type": "passive"
}, {
  "cache": "damage tearflag",
  "description": "Stick it to 'em!",
  "gfx": "Collectibles_359_8InchNails.png",
  "id": "359",
  "name": "8 Inch Nails",
  "type": "passive"
}, {
  "achievement": "190",
  "description": "Dark friend",
  "devilprice": "2",
  "gfx": "Collectibles_360_Incubus.png",
  "id": "360",
  "name": "Incubus",
  "type": "familiar"
}, {
  "achievement": "183",
  "description": "Your fate beside you",
  "gfx": "Collectibles_361_FatesReward.png",
  "id": "361",
  "name": "Fate's Reward",
  "type": "familiar"
}, {
  "achievement": "192",
  "description": "What's in the box?",
  "gfx": "Collectibles_362_LilChest.png",
  "id": "362",
  "name": "Lil Chest",
  "type": "familiar"
}, {
  "achievement": "189",
  "description": "Protective friend",
  "gfx": "Collectibles_363_SwornProtector.png",
  "id": "363",
  "name": "Sworn Protector",
  "type": "familiar"
}, {
  "description": "Friendly fly",
  "gfx": "Collectibles_364_FriendZone.png",
  "id": "364",
  "name": "Friend Zone",
  "type": "familiar"
}, {
  "description": "Lost protector",
  "gfx": "Collectibles_365_LostFly.png",
  "id": "365",
  "name": "Lost Fly",
  "type": "familiar"
}, {
  "bombs": "5",
  "description": "We put bombs in your bombs!",
  "gfx": "Collectibles_366_ScatterBombs.png",
  "id": "366",
  "name": "Scatter Bombs",
  "type": "passive"
}, {
  "bombs": "5",
  "description": "Egg sack bombs!",
  "gfx": "Collectibles_367_StickyBombs.png",
  "id": "367",
  "name": "Sticky Bombs",
  "type": "passive"
}, {
  "description": "Intensifying tears",
  "gfx": "Collectibles_368_Epiphora.png",
  "id": "368",
  "name": "Epiphora",
  "type": "passive"
}, {
  "cache": "tearflag range",
  "description": "Transcendent tears",
  "gfx": "Collectibles_369_Continuum.png",
  "id": "369",
  "name": "Continuum",
  "type": "passive"
}, {
  "cache": "range firedelay",
  "description": "Range + tears up",
  "gfx": "Collectibles_370_MrDolly.png",
  "id": "370",
  "name": "Mr. Dolly",
  "type": "passive"
}, {
  "description": "You feel cursed...",
  "gfx": "Collectibles_371_CurseOfTheTower.png",
  "id": "371",
  "name": "Curse of the Tower",
  "type": "passive"
}, {
  "description": "Bbbzzzzzt! ",
  "gfx": "Collectibles_372_ChargedBaby.png",
  "id": "372",
  "name": "Charged Baby",
  "type": "familiar"
}, {
  "description": "Accuracy brings power!",
  "gfx": "Collectibles_373_DeadEye.png",
  "id": "373",
  "name": "Dead Eye",
  "type": "passive"
}, {
  "description": "Holy shot!",
  "gfx": "Collectibles_374_HolyLight.png",
  "id": "374",
  "name": "Holy Light",
  "type": "passive"
}, {
  "description": "Nice hat!",
  "gfx": "Collectibles_375_HostHat.png",
  "id": "375",
  "name": "Host Hat",
  "type": "passive"
}, {
  "description": "Never ending stores!",
  "gfx": "Collectibles_376_Restock.png",
  "id": "376",
  "name": "Restock",
  "type": "passive"
}, {
  "description": "Spider love",
  "gfx": "Collectibles_377_BurstingSack.png",
  "id": "377",
  "name": "Bursting Sack",
  "type": "passive"
}, {
  "description": "Uh oh...",
  "gfx": "Collectibles_378_NumberTwo.png",
  "id": "378",
  "name": "No. 2",
  "type": "passive"
}, {
  "cache": "tearflag",
  "description": "Wide shot",
  "gfx": "Collectibles_379_PupulaDuplex.png",
  "id": "379",
  "name": "Pupula Duplex",
  "type": "passive"
}, {
  "coins": "5",
  "description": "Money talks",
  "gfx": "Collectibles_380_PayToPlay.png",
  "id": "380",
  "name": "Pay To Play",
  "type": "passive"
}, {
  "achievement": "188",
  "cache": "firedelay",
  "description": "Your future shines brighter",
  "gfx": "Collectibles_381_EdensBlessing.png",
  "id": "381",
  "name": "Eden's Blessing",
  "type": "passive"
}, {
  "description": "Gotta fetch 'em all!",
  "gfx": "Collectibles_382_FriendlyBall.png",
  "id": "382",
  "maxcharges": "3",
  "name": "Friendly Ball",
  "type": "active"
}, {
  "description": "Remote tear detonation",
  "gfx": "Collectibles_383_TearDetonator.png",
  "id": "383",
  "maxcharges": "1",
  "name": "Tear Detonator",
  "type": "active"
}, {
  "description": "A gurd of your own!",
  "gfx": "Collectibles_384_LilGurdy.png",
  "id": "384",
  "name": "Lil Gurdy",
  "type": "familiar"
}, {
  "description": "Bumbo want coin!",
  "gfx": "Collectibles_385_Bumbo.png",
  "id": "385",
  "name": "Bumbo",
  "type": "familiar"
}, {
  "achievement": "181",
  "description": "Rerolls rocks",
  "gfx": "Collectibles_386_D12.png",
  "id": "386",
  "maxcharges": "3",
  "name": "D12",
  "type": "active"
}, {
  "achievement": "193",
  "description": "Peace be with you",
  "gfx": "Collectibles_387_Censer.png",
  "id": "387",
  "name": "Censer",
  "type": "familiar"
}, {
  "achievement": "200",
  "description": "He wants your keys!",
  "gfx": "Collectibles_388_KeyBum.png",
  "id": "388",
  "name": "Key Bum",
  "type": "familiar"
}, {
  "achievement": "218",
  "description": "Rune generator",
  "gfx": "Collectibles_389_RuneBag.png",
  "id": "389",
  "name": "Rune Bag",
  "type": "familiar"
}, {
  "description": "Sworn friend",
  "gfx": "Collectibles_390_Seraphim.png",
  "id": "390",
  "name": "Seraphim",
  "type": "familiar"
}, {
  "achievement": "182",
  "description": "Turn your enemy",
  "gfx": "Collectibles_391_Betrayal.png",
  "id": "391",
  "name": "Betrayal",
  "type": "passive"
}, {
  "achievement": "202",
  "description": "The heavens will change you",
  "gfx": "Collectibles_392_Zodiac.png",
  "id": "392",
  "name": "Zodiac",
  "type": "passive"
}, {
  "achievement": "220",
  "description": "The kiss of death",
  "gfx": "Collectibles_393_SerpentsKiss.png",
  "id": "393",
  "name": "Serpent's Kiss",
  "type": "passive"
}, {
  "cache": "firedelay range",
  "description": "Directed tears",
  "gfx": "Collectibles_394_Marked.png",
  "id": "394",
  "name": "Marked",
  "type": "passive"
}, {
  "cache": "all",
  "description": "Laser ring tears",
  "gfx": "Collectibles_395_TechX.png",
  "id": "395",
  "name": "Tech X",
  "type": "passive"
}, {
  "description": "Short cutter",
  "gfx": "Collectibles_396_VentricleRazor.png",
  "id": "396",
  "name": "Ventricle Razor",
  "type": "active"
}, {
  "cache": "firedelay tearflag range shotspeed",
  "description": "Controlled tears",
  "gfx": "Collectibles_397_TractorBeam.png",
  "id": "397",
  "name": "Tractor Beam",
  "type": "passive"
}, {
  "cache": "tearcolor",
  "description": "Shrink shot!",
  "gfx": "Collectibles_398_GodsFlesh.png",
  "id": "398",
  "name": "God's Flesh",
  "type": "passive"
}, {
  "achievement": "186",
  "cache": "tearcolor damage",
  "description": "Consume thy enemy!",
  "devilprice": "2",
  "gfx": "Collectibles_399_MawOfTheVoid.png",
  "id": "399",
  "name": "Maw Of The Void",
  "type": "passive"
}, {
  "description": "Your destiny",
  "gfx": "Collectibles_400_SpearOfDestiny.png",
  "id": "400",
  "name": "Spear Of Destiny",
  "type": "passive"
}, {
  "cache": "tearflag tearcolor",
  "description": "Sticky bomb shot!",
  "gfx": "Collectibles_401_Explosivo.png",
  "id": "401",
  "name": "Explosivo",
  "type": "passive"
}, {
  "description": "!!!",
  "gfx": "Collectibles_402_Chaos.png",
  "id": "402",
  "name": "Chaos",
  "type": "passive"
}, {
  "description": "Mod buddy!",
  "gfx": "Collectibles_403_SpiderMod.png",
  "id": "403",
  "name": "Spider Mod",
  "type": "familiar"
}, {
  "achievement": "179",
  "description": "He farts!",
  "gfx": "collectibles_404_fartbaby.png",
  "id": "404",
  "name": "Farting Baby",
  "type": "familiar"
}, {
  "achievement": "201",
  "description": "Game breaking bug, right away!",
  "gfx": "Collectibles_405_GBBug.png",
  "id": "405",
  "name": "GB Bug",
  "type": "familiar"
}, {
  "achievement": "231",
  "description": "Reroll stats",
  "gfx": "Collectibles_406_D8.png",
  "id": "406",
  "maxcharges": "4",
  "name": "D8",
  "type": "active"
}, {
  "achievement": "180",
  "cache": "damage firedelay speed range",
  "description": "Aura stat boost",
  "gfx": "Collectibles_407_Purity.png",
  "id": "407",
  "name": "Purity",
  "type": "passive"
}, {
  "achievement": "184",
  "description": "Call to the void",
  "gfx": "Collectibles_408_Athame.png",
  "id": "408",
  "name": "Athame",
  "type": "passive"
}, {
  "achievement": "187",
  "blackhearts": "4",
  "cache": "flying",
  "description": "I reward an empty vessel",
  "gfx": "Collectibles_409_EmptyVessel.png",
  "id": "409",
  "name": "Empty Vessel",
  "type": "passive"
}, {
  "achievement": "194",
  "description": "Eye shot!",
  "gfx": "Collectibles_410_EvilEye.png",
  "id": "410",
  "name": "Evil Eye",
  "type": "passive"
}, {
  "achievement": "198",
  "cache": "damage",
  "description": "Their blood brings rage!",
  "gfx": "Collectibles_411_LustyBlood.png",
  "id": "411",
  "name": "Lusty Blood",
  "type": "passive"
}, {
  "achievement": "219",
  "description": "Feed them hate",
  "gfx": "Collectibles_412_CambionConception.png",
  "id": "412",
  "name": "Cambion Conception",
  "type": "passive"
}, {
  "achievement": "222",
  "description": "Feed them love",
  "gfx": "Collectibles_413_ImmaculateConception.png",
  "id": "413",
  "name": "Immaculate Conception",
  "type": "passive"
}, {
  "description": "There are even more options!",
  "gfx": "Collectibles_414_MoreOptions.png",
  "id": "414",
  "name": "More Options",
  "type": "passive"
}, {
  "cache": "damage shotspeed range",
  "description": "The untainted gain power",
  "gfx": "Collectibles_415_CrownOfLight.png",
  "id": "415",
  "name": "Crown Of Light",
  "soulhearts": "4",
  "type": "passive"
}, {
  "achievement": "238",
  "description": "More stuff to carry!",
  "gfx": "Collectibles_416_deeppockets.png",
  "id": "416",
  "name": "Deep Pockets",
  "type": "passive"
}, {
  "achievement": "221",
  "description": "Damage booster",
  "gfx": "Collectibles_417_Succubus.png",
  "id": "417",
  "name": "Succubus",
  "type": "familiar"
}, {
  "description": "Rainbow effects!",
  "gfx": "Collectibles_418_FruitCake.png",
  "id": "418",
  "name": "Fruit Cake",
  "type": "passive"
}, {
  "description": "I-Teleport!",
  "gfx": "Collectibles_419_Teleport20.png",
  "id": "419",
  "maxcharges": "4",
  "name": "Teleport 2.0",
  "type": "active"
}, {
  "description": "Spin the black circle!",
  "gfx": "Collectibles_420_BlackPowder.png",
  "id": "420",
  "name": "Black Powder",
  "type": "passive"
}, {
  "description": "Love toots!",
  "gfx": "Collectibles_421_KidneyBean.png",
  "id": "421",
  "maxcharges": "2",
  "name": "Kidney Bean",
  "type": "active"
}, {
  "description": "Turn back time",
  "gfx": "Collectibles_422_GlowingHourGlass.png",
  "id": "422",
  "maxcharges": "2",
  "name": "Glowing Hour Glass",
  "type": "active"
}, {
  "description": "Protect me from myself",
  "gfx": "Collectibles_423_CircleOfProtection.png",
  "id": "423",
  "name": "Circle of Protection",
  "type": "passive"
}, {
  "description": "More sacks!",
  "gfx": "Collectibles_424_SackHead.png",
  "id": "424",
  "name": "Sack Head",
  "type": "passive"
}, {
  "description": "Scared of the dark?",
  "gfx": "Collectibles_425_NightLight.png",
  "id": "425",
  "name": "Night Light",
  "type": "passive"
}, {
  "description": "Follows my every move...",
  "gfx": "Collectibles_426_ObsessedFan.png",
  "id": "426",
  "name": "Obsessed Fan",
  "type": "familiar"
}, {
  "description": "Booom!",
  "gfx": "Collectibles_427_MineCrafter.png",
  "id": "427",
  "maxcharges": "1",
  "name": "Mine Crafter",
  "type": "active"
}, {
  "description": "You feel cozy",
  "gfx": "Collectibles_428_PJs.png",
  "hearts": "24",
  "id": "428",
  "name": "PJs",
  "soulhearts": "8",
  "type": "passive"
}, {
  "cache": "tearflag",
  "description": "Penny tears!",
  "gfx": "Collectibles_429_HeadOfTheKeeper.png",
  "id": "429",
  "name": "Head of the Keeper",
  "type": "passive"
}, {
  "description": "Turret follower",
  "gfx": "Collectibles_430_PapaFly.png",
  "id": "430",
  "name": "Papa Fly",
  "type": "familiar"
}, {
  "description": "ydduB Buddy",
  "gfx": "Collectibles_431_MultidimensionalBaby.png",
  "id": "431",
  "name": "Multidimensional Baby",
  "type": "familiar"
}, {
  "bombs": "5",
  "description": "Prize bombs",
  "gfx": "Collectibles_432_GlitterBombs.png",
  "id": "432",
  "name": "Glitter Bombs",
  "type": "passive"
}, {
  "achievement": "195",
  "description": "Me! And my shaaaadow!",
  "gfx": "Collectibles_433_MyShadow.png",
  "id": "433",
  "name": "My Shadow",
  "type": "passive"
}, {
  "description": "Gotta catch 'em all?",
  "gfx": "Collectibles_434_JarOfFlies.png",
  "id": "434",
  "maxcharges": "0",
  "name": "Jar of Flies",
  "type": "active"
}, {
  "description": "4-way buddy!",
  "gfx": "Collectibles_435_LilLoki.png",
  "id": "435",
  "name": "Lil Loki",
  "type": "familiar"
}, {
  "cache": "firedelay",
  "description": "Don't cry over it...",
  "gfx": "Collectibles_436_Milk.png",
  "id": "436",
  "name": "Milk!",
  "type": "familiar"
}, {
  "description": "Reroll rewards!",
  "gfx": "Collectibles_437_D7.png",
  "id": "437",
  "maxcharges": "3",
  "name": "D7",
  "type": "active"
}, {
  "cache": "firedelay",
  "description": "Memories...",
  "gfx": "Collectibles_438_Binky.png",
  "id": "438",
  "name": "Binky",
  "soulhearts": "2",
  "type": "passive"
}, {
  "cache": "all",
  "description": "What's inside?",
  "gfx": "Collectibles_439_MomsBox.png",
  "id": "439",
  "maxcharges": "4",
  "name": "Mom's Box",
  "type": "active"
}, {
  "achievement": "232",
  "cache": "range speed firedelay",
  "description": "Matt's kidney stone",
  "gfx": "Collectibles_440_KidneyStone.png",
  "id": "440",
  "name": "Kidney Stone",
  "type": "passive"
}, {
  "achievement": "276",
  "description": "Laser breath",
  "gfx": "collectibles_441_megasatansbreath.png",
  "id": "441",
  "maxcharges": "12",
  "name": "Mega Blast",
  "type": "active"
}, {
  "achievement": "290",
  "cache": "range firedelay shotspeed",
  "description": "Loss is power",
  "devilprice": "2",
  "gfx": "Collectibles_442_DarkPrincesCrown.png",
  "id": "442",
  "name": "Dark Princes Crown",
  "type": "passive"
}, {
  "cache": "firedelay",
  "description": "Trick or treat?",
  "gfx": "Collectibles_443_Apple.png",
  "id": "443",
  "name": "Apple!",
  "type": "passive"
}, {
  "description": "He's a bleeder!",
  "gfx": "Collectibles_444_LeadPencil.png",
  "id": "444",
  "name": "Lead Pencil",
  "type": "passive"
}, {
  "cache": "damage speed",
  "description": "Bark at the moon!",
  "gfx": "Collectibles_445_DogTooth.png",
  "id": "445",
  "name": "Dog Tooth",
  "type": "passive"
}, {
  "description": "Halitosis",
  "gfx": "Collectibles_446_DeadTooth.png",
  "id": "446",
  "name": "Dead Tooth",
  "type": "passive"
}, {
  "description": "Crying makes me toot",
  "gfx": "Collectibles_447_LingerBean.png",
  "id": "447",
  "name": "Linger Bean",
  "type": "passive"
}, {
  "description": "Blood and guts!",
  "gfx": "Collectibles_448_ShardOfGlass.png",
  "id": "448",
  "name": "Shard of Glass",
  "type": "passive"
}, {
  "description": "It itches...",
  "gfx": "Collectibles_449_MetalPlate.png",
  "id": "449",
  "name": "Metal Plate",
  "soulhearts": "2",
  "type": "passive"
}, {
  "achievement": "308",
  "description": "Gold tears!",
  "gfx": "Collectibles_450_EyeOfGreed.png",
  "id": "450",
  "name": "Eye of Greed",
  "type": "passive"
}, {
  "description": "I see the future",
  "gfx": "Collectibles_451_TarotCloth.png",
  "id": "451",
  "name": "Tarot Cloth",
  "type": "passive"
}, {
  "description": "I'm leaking...",
  "gfx": "Collectibles_452_VaricoseVeins.png",
  "id": "452",
  "name": "Varicose Veins",
  "type": "passive"
}, {
  "achievement": "291",
  "cache": "range tearflag",
  "description": "Bone tears!",
  "gfx": "Collectibles_453_CompoundFracture.png",
  "id": "453",
  "name": "Compound Fracture",
  "type": "passive"
}, {
  "description": "Hold me!",
  "gfx": "Collectibles_454_Polydactyly.png",
  "id": "454",
  "name": "Polydactyly",
  "type": "passive"
}, {
  "achievement": "307",
  "cache": "range",
  "description": "I remember this...",
  "gfx": "Collectibles_455_DadsLostCoin.png",
  "id": "455",
  "name": "Dad's Lost Coin",
  "type": "passive"
}, {
  "description": "Midnight snack!",
  "gfx": "Collectibles_456_MoldyBread.png",
  "hearts": "2",
  "id": "456",
  "maxhearts": "2",
  "name": "Moldy Bread",
  "type": "passive"
}, {
  "description": "Hard headed!",
  "gfx": "Collectibles_457_Conehead.png",
  "id": "457",
  "name": "Cone Head",
  "soulhearts": "2",
  "type": "passive"
}, {
  "description": "What's in there?",
  "gfx": "Collectibles_458_BellyButton.png",
  "id": "458",
  "name": "Belly Button",
  "type": "passive"
}, {
  "description": "Booger tears!",
  "gfx": "Collectibles_459_SinusInfection.png",
  "id": "459",
  "name": "Sinus Infection",
  "type": "passive"
}, {
  "description": "Blind tears!",
  "gfx": "Collectibles_460_Glaucoma.png",
  "id": "460",
  "name": "Glaucoma",
  "type": "passive"
}, {
  "cache": "range",
  "description": "Egg tears!",
  "gfx": "Collectibles_461_Parasitoid.png",
  "id": "461",
  "name": "Parasitoid",
  "type": "passive"
}, {
  "achievement": "299",
  "cache": "range tearflag",
  "description": "Possessed tears!",
  "devilprice": "2",
  "gfx": "Collectibles_462_EyeOfBelial.png",
  "id": "462",
  "name": "Eye of Belial",
  "type": "passive"
}, {
  "cache": "damage tearcolor tearflag",
  "description": "Acid tears!",
  "gfx": "Collectibles_463_SulfuricAcid.png",
  "id": "463",
  "name": "Sulfuric Acid",
  "type": "passive"
}, {
  "achievement": "297",
  "description": "A gift from above",
  "gfx": "Collectibles_464_GlyphOfBalance.png",
  "id": "464",
  "name": "Glyph of Balance",
  "soulhearts": "4",
  "type": "passive"
}, {
  "cache": "firedelay",
  "description": "360 tears!",
  "gfx": "Collectibles_465_AnalogStick.png",
  "id": "465",
  "name": "Analog Stick",
  "type": "passive"
}, {
  "description": "Outbreak!",
  "gfx": "Collectibles_466_Contagion.png",
  "id": "466",
  "name": "Contagion",
  "type": "passive"
}, {
  "description": "Watch where you point that!",
  "gfx": "Collectibles_467_Finger.png",
  "id": "467",
  "name": "Finger!",
  "type": "familiar"
}, {
  "achievement": "285",
  "description": "It follows",
  "gfx": "Collectibles_468_Shade.png",
  "id": "468",
  "name": "Shade",
  "type": "familiar"
}, {
  "description": ":(",
  "gfx": "Collectibles_469_Depression.png",
  "id": "469",
  "name": "Depression",
  "type": "familiar"
}, {
  "achievement": "315",
  "description": "Lil hush!",
  "gfx": "Collectibles_470_Hushy.png",
  "id": "470",
  "name": "Hushy",
  "type": "familiar"
}, {
  "description": "Ain't he cute?",
  "gfx": "Collectibles_471_LilMonstro.png",
  "id": "471",
  "name": "Lil Monstro",
  "type": "familiar"
}, {
  "achievement": "286",
  "description": "Lord of the dead!",
  "gfx": "Collectibles_472_KingBaby.png",
  "id": "472",
  "name": "King Baby",
  "type": "familiar"
}, {
  "description": "Chub chub",
  "gfx": "Collectibles_473_BigChubby.png",
  "id": "473",
  "name": "Big Chubby",
  "type": "familiar"
}, {
  "description": "Gross...",
  "gfx": "Collectibles_474_Tonsil.png",
  "id": "474",
  "name": "Tonsil",
  "type": "familiar"
}, {
  "achievement": "305",
  "description": "Use with caution",
  "gfx": "Collectibles_475_PlanC.png",
  "id": "475",
  "maxcharges": "0",
  "name": "Plan C",
  "type": "active"
}, {
  "achievement": "296",
  "description": "What will it be?",
  "gfx": "Collectibles_476_D1.png",
  "id": "476",
  "maxcharges": "4",
  "name": "D1",
  "type": "active"
}, {
  "achievement": "295",
  "description": "Consume",
  "gfx": "Collectibles_477_Void.png",
  "id": "477",
  "maxcharges": "6",
  "name": "Void",
  "type": "active"
}, {
  "description": "Stop!",
  "gfx": "Collectibles_478_Pause.png",
  "id": "478",
  "maxcharges": "2",
  "name": "Pause",
  "type": "active"
}, {
  "achievement": "318",
  "description": "Trinket melter!",
  "gfx": "Collectibles_479_Smelter.png",
  "id": "479",
  "maxcharges": "6",
  "name": "Smelter",
  "type": "active"
}, {
  "description": "Gain more friends!",
  "gfx": "Collectibles_480_Compost.png",
  "id": "480",
  "maxcharges": "2",
  "name": "Compost",
  "type": "active"
}, {
  "description": "109",
  "gfx": "Collectibles_481_Dataminer.png",
  "id": "481",
  "maxcharges": "4",
  "name": "Dataminer",
  "type": "active"
}, {
  "description": "Change",
  "gfx": "Collectibles_482_Clicker.png",
  "id": "482",
  "maxcharges": "6",
  "name": "Clicker",
  "type": "active"
}, {
  "description": "BOOOOOOOOOM!",
  "gfx": "Collectibles_483_MaMaMega.png",
  "id": "483",
  "name": "Mama Mega!",
  "type": "active"
}, {
  "description": "I can't believe it's not butter bean!",
  "gfx": "Collectibles_484_WaitWhat.png",
  "id": "484",
  "maxcharges": "300",
  "name": "Wait What?",
  "type": "active"
}, {
  "achievement": "294",
  "description": "50/50",
  "gfx": "collectibles_485_crookedpenny.png",
  "id": "485",
  "maxcharges": "4",
  "name": "Crooked Penny",
  "type": "active"
}, {
  "achievement": "288",
  "description": "I feel numb...",
  "gfx": "collectibles_486_dullrazor.png",
  "id": "486",
  "maxcharges": "2",
  "name": "Dull Razor",
  "type": "active"
}, {
  "description": "A pound of flesh...",
  "gfx": "collectibles_487_potatopeeler.png",
  "id": "487",
  "name": "Potato Peeler",
  "type": "active"
}, {
  "achievement": "303",
  "cache": "all",
  "description": "Waggles a finger",
  "gfx": "collectibles_488_metronome.png",
  "id": "488",
  "maxcharges": "2",
  "name": "Metronome",
  "type": "active"
}, {
  "achievement": "282",
  "description": "Reroll forever",
  "gfx": "collectibles_489_dinfinity.png",
  "id": "489",
  "maxcharges": "2",
  "name": "D infinity",
  "type": "active"
}, {
  "achievement": "289",
  "description": "...",
  "discharged": "true",
  "gfx": "collectibles_490_edenssoul.png",
  "id": "490",
  "maxcharges": "12",
  "name": "Eden's Soul",
  "type": "active"
}, {
  "description": "Pills pills pills!",
  "gfx": "collectibles_491_acidbaby.png",
  "id": "491",
  "name": "Acid Baby",
  "type": "familiar"
}, {
  "cache": "luck",
  "description": "Yo listen!",
  "gfx": "collectibles_492_yolisten.png",
  "id": "492",
  "name": "YO LISTEN!",
  "type": "familiar"
}, {
  "description": "Panic = power",
  "gfx": "collectibles_493_adderline.png",
  "id": "493",
  "name": "Adrenaline",
  "type": "passive"
}, {
  "cache": "tearflag",
  "description": "Electric tears",
  "gfx": "collectibles_494_jacobsladder.png",
  "id": "494",
  "name": "Jacob's Ladder",
  "type": "passive"
}, {
  "description": "Flame tears",
  "gfx": "collectibles_495_ghostpepper.png",
  "id": "495",
  "name": "Ghost Pepper",
  "type": "passive"
}, {
  "achievement": "292",
  "description": "Needle shot",
  "gfx": "collectibles_496_euthanasia.png",
  "id": "496",
  "name": "Euthanasia",
  "type": "passive"
}, {
  "description": "Camo kid",
  "gfx": "collectibles_497_camoundies.png",
  "id": "497",
  "name": "Camo Undies",
  "type": "passive"
}, {
  "achievement": "306",
  "description": "You feel very balanced",
  "gfx": "collectibles_498_duality.png",
  "id": "498",
  "name": "Duality",
  "type": "passive"
}, {
  "achievement": "283",
  "description": "Peace be with you",
  "gfx": "collectibles_499_eucharist.png",
  "id": "499",
  "name": "Eucharist",
  "type": "passive"
}, {
  "achievement": "298",
  "description": "Gives sacks",
  "gfx": "Collectibles_500_SackOfSacks.png",
  "id": "500",
  "name": "Sack of Sacks",
  "type": "familiar"
}, {
  "achievement": "335",
  "description": "Money = health!",
  "gfx": "Collectibles_501_GreedsGullet.png",
  "id": "501",
  "name": "Greed's Gullet",
  "type": "passive"
}, {
  "description": "Creep shots",
  "gfx": "Collectibles_502_LargeZit.png",
  "id": "502",
  "name": "Large Zit",
  "type": "passive"
}, {
  "description": "Science!",
  "gfx": "Collectibles_503_LittleHorn.png",
  "id": "503",
  "name": "Little Horn",
  "type": "passive"
}, {
  "achievement": "316",
  "cache": "familiars",
  "description": "Friendly fly",
  "gfx": "Collectibles_504_BrownNugget.png",
  "id": "504",
  "maxcharges": "250",
  "name": "Brown Nugget",
  "type": "active"
}, {
  "description": "Gotta catch em...",
  "gfx": "Collectibles_505_PokeGo.png",
  "id": "505",
  "name": "Poke Go",
  "type": "passive"
}, {
  "description": "Watch your back!",
  "gfx": "Collectibles_506_Backstabber.png",
  "id": "506",
  "name": "BackStabber",
  "type": "passive"
}, {
  "description": "More blood!",
  "gfx": "Collectibles_507_SharpStraw.png",
  "id": "507",
  "maxcharges": "300",
  "name": "Sharp Straw",
  "type": "active"
}, {
  "description": "It's sharp!",
  "gfx": "Collectibles_508_MomsRazor.png",
  "id": "508",
  "name": "Mom's Razor",
  "type": "familiar"
}, {
  "description": "Bloody friend",
  "gfx": "Collectibles_509_BloodshotEye.png",
  "id": "509",
  "name": "Bloodshot Eye",
  "type": "familiar"
}, {
  "achievement": "338",
  "description": "Unleash the power!",
  "gfx": "Collectibles_510_Delirious.png",
  "id": "510",
  "maxcharges": "12",
  "name": "Delirious",
  "type": "active"
}, {
  "achievement": "352",
  "description": "He's violent",
  "gfx": "Collectibles_511_AngryFly.png",
  "id": "511",
  "name": "Angry Fly",
  "type": "familiar"
}, {
  "achievement": "349",
  "description": "Nothing can escape",
  "gfx": "Collectibles_512_BlackHole.png",
  "id": "512",
  "maxcharges": "4",
  "name": "Black Hole",
  "type": "active"
}, {
  "achievement": "353",
  "cache": "damage",
  "description": "Party time!",
  "gfx": "Collectibles_513_Bozo.png",
  "id": "513",
  "name": "Bozo",
  "soulhearts": "2",
  "type": "passive"
}, {
  "achievement": "354",
  "description": "Lag!",
  "gfx": "Collectibles_514_BrokenModem.png",
  "id": "514",
  "name": "Broken Modem",
  "type": "passive"
}, {
  "achievement": "350",
  "description": "Wrapped up nice for you!",
  "gfx": "Collectibles_515_MysteryGift.png",
  "id": "515",
  "name": "Mystery Gift",
  "type": "active"
}, {
  "achievement": "351",
  "cache": "familiars",
  "description": "Sprinkles.",
  "gfx": "Collectibles_516_Sprinkler.png",
  "id": "516",
  "maxcharges": "4",
  "name": "Sprinkler",
  "type": "active"
}, {
  "achievement": "356",
  "bombs": "7",
  "description": "Rapid bomb drops",
  "gfx": "Collectibles_517_FastBombs.png",
  "id": "517",
  "name": "Fast Bombs",
  "type": "passive"
}, {
  "achievement": "355",
  "description": "What could it be?!",
  "gfx": "Collectibles_518_BuddyBox.png",
  "id": "518",
  "name": "Buddy in a Box",
  "type": "familiar"
}, {
  "achievement": "357",
  "description": "Delirious friend",
  "gfx": "Collectibles_519_LilDelirium.png",
  "id": "519",
  "name": "Lil Delirium",
  "type": "familiar"
}, {
  "achievement": "367",
  "description": "Bloody recharge",
  "gfx": "Collectibles_520_JumperCable.png",
  "id": "520",
  "name": "Jumper Cables",
  "type": "passive"
}, {
  "achievement": "364",
  "description": "Allow 6 weeks for delivery",
  "gfx": "Collectibles_521_CerealCutout.png",
  "id": "521",
  "maxcharges": "6",
  "name": "Coupon",
  "type": "active"
}, {
  "achievement": "365",
  "description": "Power of the mind",
  "gfx": "Collectibles_522_Telekinesis.png",
  "id": "522",
  "maxcharges": "60",
  "name": "Telekinesis",
  "type": "active"
}, {
  "achievement": "366",
  "description": "Pack and unpack",
  "gfx": "collectibles_523_movingbox.png",
  "id": "523",
  "maxcharges": "4",
  "name": "Moving Box",
  "type": "active"
}, {
  "achievement": "369",
  "cache": "tearflag",
  "description": "Static tears",
  "gfx": "Collectibles_524_TechnologyZero.png",
  "id": "524",
  "name": "Technology Zero",
  "type": "passive"
}, {
  "achievement": "368",
  "description": "You're tearing me apart!",
  "gfx": "Collectibles_525_Leprosy.png",
  "id": "525",
  "name": "Leprosy",
  "type": "familiar"
}, {
  "achievement": "372",
  "description": "Lil harbingers!",
  "devilprice": "1",
  "gfx": "Collectibles_526_7Seals.png",
  "id": "526",
  "name": "7 Seals",
  "type": "familiar"
}, {
  "achievement": "371",
  "description": "Caaan do!",
  "gfx": "Collectibles_527_Mr_Me.png",
  "id": "527",
  "maxcharges": "4",
  "name": "Mr. ME!",
  "type": "active"
}, {
  "achievement": "373",
  "description": "Eclipsed by the moon",
  "gfx": "collectibles_528_angelic prism.png",
  "id": "528",
  "name": "Angelic Prism",
  "type": "familiar"
}, {
  "achievement": "374",
  "cache": "tearflag",
  "description": "Eyeball tears",
  "gfx": "Collectibles_529_Pop.png",
  "id": "529",
  "name": "Pop!",
  "type": "passive"
}, {
  "achievement": "376",
  "description": "Just hope you're not next...",
  "gfx": "Collectibles_530_DeathsList.png",
  "id": "530",
  "name": "Death's List",
  "type": "passive"
}, {
  "achievement": "377",
  "cache": "weapon firedelay damage tearcolor",
  "description": "I'm seeing red...",
  "gfx": "Collectibles_531_Haemolacria.png",
  "id": "531",
  "name": "Haemolacria",
  "type": "passive"
}, {
  "achievement": "378",
  "description": "Feed them!",
  "gfx": "Collectibles_532_Lachryphagy.png",
  "id": "532",
  "name": "Lachryphagy",
  "type": "passive"
}, {
  "achievement": "380",
  "cache": "tearflag",
  "description": "Smite thy enemy",
  "gfx": "Collectibles_533_Trisagion.png",
  "id": "533",
  "name": "Trisagion",
  "type": "passive"
}, {
  "achievement": "379",
  "description": "Extra active item room",
  "gfx": "collectibles_534_Schoolbag.png",
  "id": "534",
  "name": "Schoolbag",
  "type": "passive"
}, {
  "achievement": "385",
  "description": "You feel safe",
  "gfx": "Collectibles_535_Blanket.png",
  "hearts": "2",
  "id": "535",
  "name": "Blanket",
  "soulhearts": "2",
  "type": "passive"
}, {
  "achievement": "383",
  "description": "He demands a sacrifice",
  "devilprice": "2",
  "gfx": "Collectibles_536_SacrificialAltar.png",
  "id": "536",
  "maxcharges": "0",
  "name": "Sacrificial Altar",
  "type": "active"
}, {
  "achievement": "384",
  "description": "Puking buddy",
  "gfx": "Collectibles_537_LilSpewer.png",
  "id": "537",
  "name": "Lil Spewer",
  "type": "familiar"
}, {
  "achievement": "386",
  "cache": "luck",
  "description": "Choking hazard",
  "gfx": "Collectibles_538_Marbles.png",
  "id": "538",
  "name": "Marbles",
  "type": "passive"
}, {
  "achievement": "387",
  "description": "Sacrificial insemination",
  "gfx": "Collectibles_539_MysteryEgg.png",
  "id": "539",
  "name": "Mystery Egg",
  "type": "familiar"
}, {
  "achievement": "382",
  "cache": "tearflag damage firedelay",
  "description": "Skipping tears",
  "gfx": "Collectibles_540_FlatStone.png",
  "id": "540",
  "name": "Flat Stone",
  "type": "passive"
}, {
  "achievement": "392",
  "description": "HP up?",
  "gfx": "Collectibles_541_Marrow.png",
  "id": "541",
  "name": "Marrow",
  "type": "passive"
}, {
  "achievement": "393",
  "description": "Projectile shield",
  "gfx": "Collectibles_542_SlippedRib.png",
  "id": "542",
  "name": "Slipped Rib",
  "type": "familiar"
}, {
  "achievement": "398",
  "description": "Portable sanctuary",
  "gfx": "Collectibles_543_HallowedGround.png",
  "id": "543",
  "name": "Hallowed Ground",
  "type": "familiar"
}, {
  "achievement": "394",
  "description": "Stabbing time",
  "gfx": "Collectibles_544_PointyRib.png",
  "id": "544",
  "name": "Pointy Rib",
  "type": "familiar"
}, {
  "achievement": "401",
  "description": "Rise from the grave",
  "gfx": "Collectibles_545_BookOfTheDead.png",
  "id": "545",
  "maxcharges": "4",
  "name": "Book of the Dead",
  "type": "active"
}, {
  "achievement": "400",
  "description": "Father's blessing",
  "gfx": "Collectibles_546_DadsRing.png",
  "id": "546",
  "name": "Dad's Ring",
  "type": "passive"
}, {
  "achievement": "397",
  "cache": "firedelay",
  "description": "Tears up + you feel empty",
  "gfx": "Collectibles_547_DivorcePapers.png",
  "id": "547",
  "name": "Divorce Papers",
  "type": "passive"
}, {
  "achievement": "395",
  "description": "Fetch!",
  "gfx": "Collectibles_548_JawBone.png",
  "id": "548",
  "name": "Jaw Bone",
  "type": "familiar"
}, {
  "achievement": "396",
  "description": "Everything hurts",
  "gfx": "Collectibles_549_BrittleBones.png",
  "id": "549",
  "name": "Brittle Bones",
  "type": "passive"
}, {
  "description": "It feels cursed",
  "gfx": "Collectibles_550_ShovelPiece1.png",
  "id": "550",
  "maxcharges": "4",
  "name": "Broken Shovel",
  "type": "active"
}, {
  "description": "It feels cursed",
  "gfx": "Collectibles_551_ShovelPiece2.png",
  "id": "551",
  "name": "Broken Shovel",
  "type": "passive"
}, {
  "description": "Lost but not forgotten",
  "gfx": "Collectibles_552_MomsShovel.png",
  "id": "552",
  "maxcharges": "4",
  "name": "Mom's Shovel",
  "type": "active"
}, {
  "achievement": "101",
  "description": "Gulp!",
  "gfx": "trinket_001_swallowedpenny.png",
  "id": "1",
  "name": "Swallowed Penny",
  "type": "trinket"
}, {
  "description": "It feels lucky?",
  "gfx": "trinket_002_petrifiedpoop.png",
  "id": "2",
  "name": "Petrified Poop",
  "type": "trinket"
}, {
  "description": "Trickle charge",
  "gfx": "trinket_003_aaabattery.png",
  "id": "3",
  "name": "AAA Battery",
  "type": "trinket"
}, {
  "description": "It's broken",
  "gfx": "trinket_004_brokenremote.png",
  "id": "4",
  "name": "Broken Remote",
  "type": "trinket"
}, {
  "description": "Challenge up",
  "gfx": "trinket_005_purpleheart.png",
  "id": "5",
  "name": "Purple Heart",
  "type": "trinket"
}, {
  "description": "It kinda works",
  "gfx": "trinket_006_brokenmagnet.png",
  "id": "6",
  "name": "Broken Magnet",
  "type": "trinket"
}, {
  "description": "Faith up",
  "gfx": "trinket_007_rosarybead.png",
  "id": "7",
  "name": "Rosary Bead",
  "type": "trinket"
}, {
  "description": "I remember these",
  "gfx": "trinket_008_cartridge.png",
  "id": "8",
  "name": "Cartridge",
  "type": "trinket"
}, {
  "cache": "tearflag",
  "description": "Wub wub!",
  "gfx": "trinket_009_pulseworm.png",
  "id": "9",
  "name": "Pulse Worm",
  "type": "trinket"
}, {
  "cache": "tearflag",
  "description": "Wiggle waggle!",
  "gfx": "trinket_010_wiggleworm.png",
  "id": "10",
  "name": "Wiggle Worm",
  "type": "trinket"
}, {
  "cache": "tearflag",
  "description": "Woop woop!",
  "gfx": "trinket_011_ringworm.png",
  "id": "11",
  "name": "Ring Worm",
  "type": "trinket"
}, {
  "cache": "tearflag",
  "description": "Blub blub!",
  "gfx": "trinket_012_flatworm.png",
  "id": "12",
  "name": "Flat Worm",
  "type": "trinket"
}, {
  "achievement": "118",
  "description": "YES!",
  "gfx": "trinket_013_storecredit.png",
  "id": "13",
  "name": "Store Credit",
  "type": "trinket"
}, {
  "description": "Your feet feel stronger",
  "gfx": "trinket_014_callus.png",
  "id": "14",
  "name": "Callus",
  "type": "trinket"
}, {
  "achievement": "85",
  "description": "There's something inside it",
  "gfx": "trinket_015_luckyrock.png",
  "id": "15",
  "name": "Lucky Rock",
  "type": "trinket"
}, {
  "description": "???",
  "gfx": "trinket_016_momstoenail.png",
  "id": "16",
  "name": "Mom's Toenail",
  "type": "trinket"
}, {
  "achievement": "111",
  "cache": "damage",
  "description": "Evil up",
  "gfx": "trinket_017_blacklipstick.png",
  "id": "17",
  "name": "Black Lipstick",
  "type": "trinket"
}, {
  "description": "Faith up",
  "gfx": "trinket_018_bibletract.png",
  "id": "18",
  "name": "Bible Tract",
  "type": "trinket"
}, {
  "description": "Master of lockpicking",
  "gfx": "trinket_019_paperclip.png",
  "id": "19",
  "name": "Paper Clip",
  "type": "trinket"
}, {
  "description": "Wish granted",
  "gfx": "trinket_020_monkeypaw.png",
  "id": "20",
  "name": "Monkey Paw",
  "type": "trinket"
}, {
  "achievement": "123",
  "description": "???",
  "gfx": "trinket_021_mysteriouspaper.png",
  "id": "21",
  "name": "Mysterious Paper",
  "type": "trinket"
}, {
  "achievement": "127",
  "cache": "damage",
  "description": "Evil up",
  "gfx": "trinket_022_daemonstail.png",
  "id": "22",
  "name": "Daemon's Tail",
  "type": "trinket"
}, {
  "achievement": "149",
  "description": "???",
  "gfx": "trinket_023_missingposter.png",
  "id": "23",
  "name": "Missing Poster",
  "type": "trinket"
}, {
  "description": "Wealth of gas",
  "gfx": "trinket_024_buttpenny.png",
  "id": "24",
  "name": "Butt Penny",
  "type": "trinket"
}, {
  "description": "Uh-oh!",
  "gfx": "trinket_025_mysteriouscandy.png",
  "id": "25",
  "name": "Mysterious Candy",
  "type": "trinket"
}, {
  "cache": "tearflag range",
  "description": "Zip zoop!",
  "gfx": "trinket_026_hookworm.png",
  "id": "26",
  "name": "Hook Worm",
  "type": "trinket"
}, {
  "cache": "shotspeed",
  "description": "Wooosh!",
  "gfx": "trinket_027_whipworm.png",
  "id": "27",
  "name": "Whip Worm",
  "type": "trinket"
}, {
  "achievement": "117",
  "description": "Eternal life?",
  "gfx": "trinket_028_brokenankh.png",
  "id": "28",
  "name": "Broken Ankh",
  "type": "trinket"
}, {
  "description": "It stinks",
  "gfx": "trinket_029_fishhead.png",
  "id": "29",
  "name": "Fish Head",
  "type": "trinket"
}, {
  "description": "Poison shots",
  "gfx": "trinket_030_pinkyeye.png",
  "id": "30",
  "name": "Pinky Eye",
  "type": "trinket"
}, {
  "description": "Piercing shots",
  "gfx": "trinket_031_pushpin.png",
  "id": "31",
  "name": "Push Pin",
  "type": "trinket"
}, {
  "description": "Touch fuzzy, get dizzy",
  "gfx": "trinket_032_libertycap.png",
  "id": "32",
  "name": "Liberty Cap",
  "type": "trinket"
}, {
  "description": "Fetal protection",
  "gfx": "trinket_033_umbilicalcord.png",
  "id": "33",
  "name": "Umbilical Cord",
  "type": "trinket"
}, {
  "description": "It calls out to its brothers",
  "gfx": "trinket_034_childsheart.png",
  "id": "34",
  "name": "Child's Heart",
  "type": "trinket"
}, {
  "achievement": "52",
  "cache": "damage",
  "description": "DMG up",
  "gfx": "trinket_035_curvedhorn.png",
  "id": "35",
  "name": "Curved Horn",
  "type": "trinket"
}, {
  "description": "It feels lucky?",
  "gfx": "trinket_036_rustedkey.png",
  "id": "36",
  "name": "Rusted Key",
  "type": "trinket"
}, {
  "cache": "speed",
  "description": "Speed up",
  "gfx": "trinket_037_goathoof.png",
  "id": "37",
  "name": "Goat Hoof",
  "type": "trinket"
}, {
  "description": "It emanates purity ",
  "gfx": "trinket_038_momspearl.png",
  "id": "38",
  "name": "Mom's Pearl",
  "type": "trinket"
}, {
  "cache": "firedelay",
  "description": "Yay, cancer!",
  "gfx": "trinket_039_cancer.png",
  "id": "39",
  "name": "Cancer",
  "type": "trinket"
}, {
  "cache": "damage",
  "description": "Your rage grows",
  "gfx": "trinket_040_redpatch.png",
  "id": "40",
  "name": "Red Patch",
  "type": "trinket"
}, {
  "description": "Tastes like burning",
  "gfx": "trinket_041_matchstick.png",
  "id": "41",
  "name": "Match Stick",
  "type": "trinket"
}, {
  "achievement": "61",
  "cache": "luck",
  "description": "Luck up!",
  "gfx": "trinket_042_luckytoe.png",
  "id": "42",
  "name": "Lucky Toe",
  "type": "trinket"
}, {
  "description": "Cursed?",
  "gfx": "trinket_043_cursedskull.png",
  "id": "43",
  "name": "Cursed Skull",
  "type": "trinket"
}, {
  "description": "Don't swallow it",
  "gfx": "trinket_044_safetycap.png",
  "id": "44",
  "name": "Safety Cap",
  "type": "trinket"
}, {
  "description": "Luck of the draw",
  "gfx": "trinket_045_aceofspades.png",
  "id": "45",
  "name": "Ace of Spades",
  "type": "trinket"
}, {
  "description": "Consume thy enemy",
  "gfx": "trinket_046_isaacsfork.png",
  "id": "46",
  "name": "Isaac's Fork",
  "type": "trinket"
}, {
  "description": "It glows with power",
  "gfx": "trinket_048_amissingpage.png",
  "id": "48",
  "name": "A Missing Page",
  "type": "trinket"
}, {
  "achievement": "55",
  "description": "Wealth of health",
  "gfx": "trinket_049_bloodypenny.png",
  "id": "49",
  "name": "Bloody Penny",
  "type": "trinket"
}, {
  "achievement": "60",
  "description": "Wealth of chaos",
  "gfx": "trinket_050_burntpenny.png",
  "id": "50",
  "name": "Burnt Penny",
  "type": "trinket"
}, {
  "description": "Wealth of answers",
  "gfx": "trinket_051_flatpenny.png",
  "id": "51",
  "name": "Flat Penny",
  "type": "trinket"
}, {
  "achievement": "64",
  "description": "Wealth of wealth",
  "gfx": "trinket_052_counterfeitpenny.png",
  "id": "52",
  "name": "Counterfeit Penny",
  "type": "trinket"
}, {
  "description": "Well, that's not coming off",
  "gfx": "trinket_053_tick.png",
  "id": "53",
  "name": "Tick",
  "type": "trinket"
}, {
  "achievement": "70",
  "cache": "familiars",
  "description": "Dead friend",
  "gfx": "trinket_054_isaacshead.png",
  "id": "54",
  "name": "Isaac's Head",
  "type": "trinket"
}, {
  "achievement": "71",
  "description": "Faith's reward",
  "gfx": "trinket_055_maggysfaith.png",
  "id": "55",
  "name": "Maggy's Faith",
  "type": "trinket"
}, {
  "achievement": "72",
  "description": "Payment received ",
  "gfx": "trinket_056_judastongue.png",
  "id": "56",
  "name": "Judas' Tongue",
  "type": "trinket"
}, {
  "achievement": "73",
  "cache": "familiars",
  "description": "Imaginary friend",
  "gfx": "trinket_057_qmarkssoul.png",
  "id": "57",
  "name": "???'s Soul",
  "type": "trinket"
}, {
  "achievement": "74",
  "cache": "damage",
  "description": "Your rage grows",
  "gfx": "trinket_058_samsonslock.png",
  "id": "58",
  "name": "Samson's Lock",
  "type": "trinket"
}, {
  "achievement": "75",
  "description": "May you see your destination",
  "gfx": "trinket_059_cainseye.png",
  "id": "59",
  "name": "Cain's Eye",
  "type": "trinket"
}, {
  "achievement": "76",
  "cache": "familiars",
  "description": "Revenge from beyond",
  "gfx": "trinket_060_evesbirdfoot.png",
  "id": "60",
  "name": "Eve's Bird Foot",
  "type": "trinket"
}, {
  "achievement": "77",
  "description": "The left-hand path reaps dark rewards",
  "gfx": "trinket_061_thelefthand.png",
  "id": "61",
  "name": "The Left Hand",
  "type": "trinket"
}, {
  "description": "It shines for its brothers",
  "gfx": "trinket_062_ShinyRock.png",
  "id": "62",
  "name": "Shiny Rock",
  "type": "trinket"
}, {
  "description": "Fuse cutter",
  "gfx": "trinket_063_SafetyScissors.png",
  "id": "63",
  "name": "Safety Scissors",
  "type": "trinket"
}, {
  "cache": "range shotspeed tearflag firedelay",
  "description": "Bleep bloop blop",
  "gfx": "trinket_064_RainbowWorm.png",
  "id": "64",
  "name": "Rainbow Worm",
  "type": "trinket"
}, {
  "cache": "range",
  "description": "Floooooooooop!",
  "gfx": "trinket_065_TapeWorm.png",
  "id": "65",
  "name": "Tape Worm",
  "type": "trinket"
}, {
  "cache": "range shotspeed",
  "description": "Pft",
  "gfx": "trinket_066_LazyWorm.png",
  "id": "66",
  "name": "Lazy Worm",
  "type": "trinket"
}, {
  "achievement": "196",
  "description": "You feel cursed... kinda.",
  "gfx": "trinket_067_CrackedDice.png",
  "id": "67",
  "name": "Cracked Dice",
  "type": "trinket"
}, {
  "description": "It pulls",
  "gfx": "trinket_068_SuperMagnet.png",
  "id": "68",
  "name": "Super Magnet",
  "type": "trinket"
}, {
  "description": "You feel faded",
  "gfx": "trinket_069_FadedPolaroid.png",
  "id": "69",
  "name": "Faded Polaroid",
  "type": "trinket"
}, {
  "description": "Itchy, tasty...",
  "gfx": "trinket_070_Louse.png",
  "id": "70",
  "name": "Louse",
  "type": "trinket"
}, {
  "description": "Creepy bombs",
  "gfx": "trinket_071_BobsBladder.png",
  "id": "71",
  "name": "Bob's Bladder",
  "type": "trinket"
}, {
  "description": "Lil charge",
  "gfx": "trinket_072_WatchBattery.png",
  "id": "72",
  "name": "Watch Battery",
  "type": "trinket"
}, {
  "description": "Pop! Pop!",
  "gfx": "trinket_073_BlastingCap.png",
  "id": "73",
  "name": "Blasting Cap",
  "type": "trinket"
}, {
  "achievement": "230",
  "description": "The ground below feels hollow...",
  "gfx": "trinket_074_StudFinder.png",
  "id": "74",
  "name": "Stud Finder",
  "type": "trinket"
}, {
  "cache": "all",
  "description": "Effect not found?",
  "gfx": "trinket_075_Error.png",
  "id": "75",
  "name": "Error",
  "type": "trinket"
}, {
  "achievement": "229",
  "description": "It's double down time!",
  "gfx": "trinket_076_PokerChip.png",
  "id": "76",
  "name": "Poker Chip",
  "type": "trinket"
}, {
  "cache": "tearflag",
  "description": "Bounce back!",
  "gfx": "trinket_077_Blister.png",
  "id": "77",
  "name": "Blister",
  "type": "trinket"
}, {
  "description": "Extended stat effect time!",
  "gfx": "trinket_078_SecondHand.png",
  "id": "78",
  "name": "Second Hand",
  "type": "trinket"
}, {
  "description": "I'm stuck in a loop...",
  "gfx": "trinket_079_EndlessNameless.png",
  "id": "79",
  "name": "Endless Nameless",
  "type": "trinket"
}, {
  "achievement": "197",
  "cache": "damage",
  "description": "With darkness comes power",
  "gfx": "trinket_080_BlackFeather.png",
  "id": "80",
  "name": "Black Feather",
  "type": "trinket"
}, {
  "achievement": "185",
  "description": "Blind to damage",
  "gfx": "trinket_081_BlindRage.png",
  "id": "81",
  "name": "Blind Rage",
  "type": "trinket"
}, {
  "description": "Feel lucky?",
  "gfx": "trinket_082_GoldenHorseShoe.png",
  "id": "82",
  "name": "Golden Horse Shoe",
  "type": "trinket"
}, {
  "achievement": "249",
  "description": "Stores are open",
  "gfx": "trinket_083_storekey.png",
  "id": "83",
  "name": "Store Key",
  "type": "trinket"
}, {
  "achievement": "204",
  "description": "Feels greedy",
  "gfx": "trinket_084_ribofgreed.png",
  "id": "84",
  "name": "Rib of Greed",
  "type": "trinket"
}, {
  "achievement": "239",
  "description": "Karma up",
  "gfx": "trinket_085_karma.png",
  "id": "85",
  "name": "Karma",
  "type": "trinket"
}, {
  "description": "The poop is moving...",
  "gfx": "Trinket_086_LilLarva.png",
  "id": "86",
  "name": "Lil Larva",
  "type": "trinket"
}, {
  "description": "You feel her love",
  "gfx": "Trinket_087_MomsLocket.png",
  "id": "87",
  "name": "Mom's Locket",
  "type": "trinket"
}, {
  "description": "Never again!",
  "gfx": "Trinket_088_NO.png",
  "id": "88",
  "name": "NO!",
  "type": "trinket"
}, {
  "description": "Keep your friends close...",
  "gfx": "Trinket_089_ChildLeash.png",
  "id": "89",
  "name": "Child Leash",
  "type": "trinket"
}, {
  "description": "Fartoom!",
  "gfx": "Trinket_090_BrownCap.png",
  "id": "90",
  "name": "Brown Cap",
  "type": "trinket"
}, {
  "achievement": "300",
  "description": "Eww",
  "gfx": "Trinket_091_Meconium.png",
  "id": "91",
  "name": "Meconium",
  "type": "trinket"
}, {
  "achievement": "336",
  "cache": "all",
  "description": "Stat booster",
  "gfx": "Trinket_092_CrackedCrown.png",
  "id": "92",
  "name": "Cracked Crown",
  "type": "trinket"
}, {
  "description": "You stink",
  "gfx": "Trinket_093_UsedDiaper.png",
  "id": "93",
  "name": "Used Diaper",
  "type": "trinket"
}, {
  "description": "It also stinks!",
  "gfx": "Trinket_094_FishTail.png",
  "id": "94",
  "name": "Fish Tail",
  "type": "trinket"
}, {
  "description": "It looks dead",
  "gfx": "Trinket_095_BlackTooth.png",
  "id": "95",
  "name": "Black Tooth",
  "type": "trinket"
}, {
  "cache": "tearflag range",
  "description": "Foop foop!",
  "gfx": "Trinket_096_OuroborosWorm.png",
  "id": "96",
  "name": "Ouroboros Worm",
  "type": "trinket"
}, {
  "description": "Sick...",
  "gfx": "Trinket_097_Tonsil.png",
  "id": "97",
  "name": "Tonsil",
  "type": "trinket"
}, {
  "description": "Seems magic...",
  "gfx": "Trinket_098_NoseGoblin.png",
  "id": "98",
  "name": "Nose Goblin",
  "type": "trinket"
}, {
  "description": "Boing!",
  "gfx": "Trinket_099_SuperBall.png",
  "id": "99",
  "name": "Super Ball",
  "type": "trinket"
}, {
  "cache": "all",
  "description": "It needs power",
  "gfx": "Trinket_100_VibrantBulb.png",
  "id": "100",
  "name": "Vibrant Bulb",
  "type": "trinket"
}, {
  "cache": "all",
  "description": "I think it's broken",
  "gfx": "Trinket_101_DimBulb.png",
  "id": "101",
  "name": "Dim Bulb",
  "type": "trinket"
}, {
  "description": "Double moon",
  "gfx": "Trinket_102_FragmentedCard.png",
  "id": "102",
  "name": "Fragmented Card",
  "type": "trinket"
}, {
  "description": "=",
  "gfx": "Trinket_103_Equality.png",
  "id": "103",
  "name": "Equality!",
  "type": "trinket"
}, {
  "description": "Make a wish",
  "gfx": "trinket_104_wishbone.png",
  "id": "104",
  "name": "Wish Bone",
  "type": "trinket"
}, {
  "description": "I wonder what it is",
  "gfx": "trinket_105_baglunch.png",
  "id": "105",
  "name": "Bag Lunch",
  "type": "trinket"
}, {
  "description": "Uncorked",
  "gfx": "trinket_106_lostcork.png",
  "id": "106",
  "name": "Lost Cork",
  "type": "trinket"
}, {
  "achievement": "302",
  "description": "Drain me",
  "gfx": "trinket_107_crowheart.png",
  "id": "107",
  "name": "Crow Heart",
  "type": "trinket"
}, {
  "description": "That's a hard nut to crack!",
  "gfx": "trinket_108_walnut.png",
  "id": "108",
  "name": "Walnut",
  "type": "trinket"
}, {
  "description": "Stuck!",
  "gfx": "trinket_109_ducttape.png",
  "id": "109",
  "name": "Duct Tape",
  "type": "trinket"
}, {
  "achievement": "284",
  "description": "Feels lucky...",
  "gfx": "trinket_110_silverdollar.png",
  "id": "110",
  "name": "Silver Dollar",
  "type": "trinket"
}, {
  "achievement": "287",
  "description": "Drips with blood...",
  "gfx": "trinket_111_bloodycrown.png",
  "id": "111",
  "name": "Bloody Crown",
  "type": "trinket"
}, {
  "description": "...",
  "gfx": "trinket_112_paytowin.png",
  "id": "112",
  "name": "Pay To Win",
  "type": "trinket"
}, {
  "achievement": "310",
  "description": "I bring War",
  "gfx": "trinket_113_LocustOfWrath.png",
  "id": "113",
  "name": "Locust of War",
  "type": "trinket"
}, {
  "achievement": "311",
  "description": "I bring Pestilence",
  "gfx": "trinket_114_LocustOfPestilence.png",
  "id": "114",
  "name": "Locust of Pestilence",
  "type": "trinket"
}, {
  "achievement": "312",
  "description": "I bring Famine",
  "gfx": "trinket_115_LocustOfFamine.png",
  "id": "115",
  "name": "Locust of Famine",
  "type": "trinket"
}, {
  "achievement": "313",
  "description": "I bring Death",
  "gfx": "trinket_116_LocustOfDeath.png",
  "id": "116",
  "name": "Locust of Death",
  "type": "trinket"
}, {
  "achievement": "314",
  "description": "I bring Conquest",
  "gfx": "trinket_117_LocustOfConquest.png",
  "id": "117",
  "name": "Locust of Conquest",
  "type": "trinket"
}, {
  "achievement": "304",
  "cache": "flying",
  "description": "They are growing...",
  "gfx": "trinket_118_BatWing.png",
  "id": "118",
  "name": "Bat Wing",
  "type": "trinket"
}, {
  "achievement": "301",
  "description": "Regen!",
  "gfx": "trinket_119_StemCell.png",
  "id": "119",
  "name": "Stem Cell",
  "type": "trinket"
}, {
  "achievement": "358",
  "description": "Danger charge",
  "gfx": "trinket_120_Hairpin.png",
  "id": "120",
  "name": "Hairpin",
  "type": "trinket"
}, {
  "achievement": "359",
  "description": "My faith protects me",
  "gfx": "trinket_121_WoodenCross.png",
  "id": "121",
  "name": "Wooden Cross",
  "type": "trinket"
}, {
  "achievement": "360",
  "description": "Can't hold it!",
  "gfx": "trinket_122_Butter.png",
  "id": "122",
  "name": "Butter!",
  "type": "trinket"
}, {
  "achievement": "370",
  "description": "Angelic spoils",
  "gfx": "Trinket_123_FiligreeFeather.png",
  "id": "123",
  "name": "Filigree Feather",
  "type": "trinket"
}, {
  "achievement": "375",
  "description": "Hold the door",
  "gfx": "trinket_124_woodendoorstop.png",
  "id": "124",
  "name": "Door Stop",
  "type": "trinket"
}, {
  "achievement": "381",
  "description": "Charged friends",
  "gfx": "trinket_125_Extensioncord.png",
  "id": "125",
  "name": "Extension Cord",
  "type": "trinket"
}, {
  "achievement": "388",
  "description": "Wealth of flies",
  "gfx": "trinket_126_RottenPenny.png",
  "id": "126",
  "name": "Rotten Penny",
  "type": "trinket"
}, {
  "achievement": "389",
  "description": "Feed them magic!",
  "gfx": "trinket_127_BabyBender.png",
  "id": "127",
  "name": "Baby-Bender",
  "type": "trinket"
}, {
  "achievement": "399",
  "description": "It looks brittle",
  "gfx": "trinket_128_FingerBone.png",
  "id": "128",
  "name": "Finger Bone",
  "type": "trinket"
}];
},{}],"../json/rooms.json":[function(require,module,exports) {
module.exports = ["Cathedral", "Sheol", "The Chest", "The Dark Room", "The Void"];
},{}],"../js/app.js":[function(require,module,exports) {
"use strict";

var _random = require("./random");

var _adjectives = _interopRequireDefault(require("../json/adjectives.json"));

var _characters = _interopRequireDefault(require("../json/characters.json"));

var _colours = _interopRequireDefault(require("../json/colours.json"));

var _items = _interopRequireDefault(require("../json/items.json"));

var _rooms = _interopRequireDefault(require("../json/rooms.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var today = new Date(); // Get today's midnight.

today.setUTCHours(0, 0, 0, 0);
var seed = today.getTime();
var alertDiv = document.getElementById("alert-box");
alertDiv.style.visibility = "hidden";
var url = new URL(document.location);
var urlSeed = url.searchParams.get("seed");

if (urlSeed !== null) {
  seed = urlSeed;
}

var _getRandomWithSeed = (0, _random.getRandomWithSeed)(_characters.default, seed),
    _getRandomWithSeed2 = _slicedToArray(_getRandomWithSeed, 1),
    playableCharacter = _getRandomWithSeed2[0];

var _getRandomWithSeed3 = (0, _random.getRandomWithSeed)(_rooms.default, seed),
    _getRandomWithSeed4 = _slicedToArray(_getRandomWithSeed3, 1),
    endingRoom = _getRandomWithSeed4[0];

var _getRandomWithSeed5 = (0, _random.getRandomWithSeed)(_colours.default, seed),
    _getRandomWithSeed6 = _slicedToArray(_getRandomWithSeed5, 1),
    colour = _getRandomWithSeed6[0];

document.getElementById("title-adjective").textContent = (0, _random.getRandomWithSeed)(_adjectives.default, seed);
var titleColourElement = document.getElementById("title-colour");
titleColourElement.style.color = colour.hex;
titleColourElement.textContent = colour.name;
document.getElementById("title-character").textContent = playableCharacter;
document.getElementById("seed").textContent = seed;
document.getElementById("character").textContent = playableCharacter;
document.getElementById("starting-items").textContent = (0, _random.getRandomWithSeed)(_items.default, seed, 3).map(function (items) {
  return "C".concat(items.id, " ").concat(items.name);
}).join(", ");
document.getElementById("end-room").textContent = endingRoom;
document.getElementById("generate-seed").addEventListener("click", function () {
  window.location = "?seed=".concat(generateRandomSeed());
});
document.getElementById("share").addEventListener("click", function () {
  copyToClipboard();
});

function generateRandomSeed() {
  var r = Math.random().toString(36).substring(7);
  var rand = Math.floor(999 * Math.random());
  return "".concat(r).concat(rand);
}

function copyToClipboard() {
  // create new element to append url to so we can copy the text to clipboard
  var newElement = document.createElement("input");
  var text = window.location.href;
  document.body.appendChild(newElement);
  newElement.value = text;
  newElement.select();
  document.execCommand("copy"); // tear down

  document.body.removeChild(newElement); // show the alert for 3 seconds

  alertDiv.style.visibility = "visible";
  setTimeout(function () {
    alertDiv.style.visibility = "hidden";
  }, 3000);
}
},{"./random":"../js/random.js","../json/adjectives.json":"../json/adjectives.json","../json/characters.json":"../json/characters.json","../json/colours.json":"../json/colours.json","../json/items.json":"../json/items.json","../json/rooms.json":"../json/rooms.json"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58505" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../js/app.js"], null)
//# sourceMappingURL=/app.5a203f7e.js.map