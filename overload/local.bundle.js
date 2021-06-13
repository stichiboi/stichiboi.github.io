/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/local/index.ts":
/*!****************************!*\
  !*** ./src/local/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nvar utils_1 = __webpack_require__(/*! ./utils */ \"./src/local/utils.ts\");\r\nvar settings_1 = __webpack_require__(/*! ../settings */ \"./src/settings.ts\");\r\nvar directory = \"src/assets\";\r\nvar fileName = \"words_dictionary.json\";\r\nvar letterWidths = {\r\n    \"A\": 11.5625,\r\n    \"B\": 10.671875,\r\n    \"C\": 10.671875,\r\n    \"D\": 11.5625,\r\n    \"E\": 9.78125,\r\n    \"F\": 8.90625,\r\n    \"G\": 11.5625,\r\n    \"H\": 11.5625,\r\n    \"I\": 5.328125,\r\n    \"J\": 6.234375,\r\n    \"K\": 11.5625,\r\n    \"L\": 9.78125,\r\n    \"M\": 14.234375,\r\n    \"N\": 11.5625,\r\n    \"O\": 11.5625,\r\n    \"P\": 8.90625,\r\n    \"Q\": 11.5625,\r\n    \"R\": 10.671875,\r\n    \"S\": 8.90625,\r\n    \"T\": 9.78125,\r\n    \"U\": 11.5625,\r\n    \"V\": 11.5625,\r\n    \"W\": 15.109375,\r\n    \"X\": 11.5625,\r\n    \"Y\": 11.5625,\r\n    \"Z\": 9.78125,\r\n    \"-\": 5.328125\r\n};\r\nvar minWordCount = 5;\r\nvar shiftWidth = Object.values(letterWidths).reduce(function (prev, curr) { return Math.min(prev, curr); }, Infinity);\r\nutils_1.readJSON(directory + \"/\" + fileName).then(function (json) {\r\n    var words = Object.keys(json);\r\n    //Since the input JSON is sorted, words with similar roots are all next to each other\r\n    shuffle(words);\r\n    var wordsLength = words.map(function (word) {\r\n        var w = word.toUpperCase();\r\n        return {\r\n            w: w, l: calculateWidth(w, letterWidths)\r\n        };\r\n    });\r\n    wordsLength.sort(function (a, b) {\r\n        return a.l > b.l ? 1 : -1;\r\n    });\r\n    var groups = [];\r\n    wordsLength.forEach(function (c) {\r\n        var gId = Math.floor((c.l - shiftWidth) / settings_1.rangeWidth);\r\n        groups[gId] || (groups[gId] = []);\r\n        groups[gId].push(c.w);\r\n    });\r\n    var filtered = groups.filter(function (arr) { return arr.length >= minWordCount; });\r\n    utils_1.saveData(directory + \"/\" + settings_1.groupsFilename, filtered);\r\n});\r\nfunction calculateWidth(word, widths) {\r\n    var tot = 0;\r\n    for (var _i = 0, word_1 = word; _i < word_1.length; _i++) {\r\n        var l = word_1[_i];\r\n        tot += widths[l] || 0;\r\n    }\r\n    return tot;\r\n}\r\nfunction shuffle(array) {\r\n    var _a;\r\n    var currentIndex = array.length, randomIndex;\r\n    // While there remain elements to shuffle...\r\n    while (0 !== currentIndex) {\r\n        // Pick a remaining element...\r\n        randomIndex = Math.floor(Math.random() * currentIndex);\r\n        currentIndex--;\r\n        // And swap it with the current element.\r\n        _a = [\r\n            array[randomIndex], array[currentIndex]\r\n        ], array[currentIndex] = _a[0], array[randomIndex] = _a[1];\r\n    }\r\n    return array;\r\n}\r\n\n\n//# sourceURL=webpack://stichiclock/./src/local/index.ts?");

/***/ }),

/***/ "./src/local/utils.ts":
/*!****************************!*\
  !*** ./src/local/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.saveData = exports.readJSON = void 0;\r\nvar fs = __webpack_require__(/*! fs */ \"fs\");\r\nvar path = __webpack_require__(/*! path */ \"path\");\r\nfunction readJSON(filePath, absolute) {\r\n    return new Promise(function (resolve, reject) {\r\n        var fullPath = absolute ? filePath : path.resolve(__dirname, filePath);\r\n        fs.readFile(fullPath, (function (err, data) {\r\n            if (err) {\r\n                reject(err);\r\n            }\r\n            else {\r\n                // @ts-ignore\r\n                resolve(JSON.parse(data));\r\n            }\r\n        }));\r\n    });\r\n}\r\nexports.readJSON = readJSON;\r\nfunction saveData(filePath, data) {\r\n    var fullPath = path.resolve(__dirname, filePath);\r\n    var dir = path.dirname(fullPath);\r\n    fs.mkdir(dir, { recursive: true }, function (err) {\r\n        if (err) {\r\n            console.error(err);\r\n        }\r\n        else {\r\n            fs.writeFile(fullPath, (typeof data === 'string') ? data : JSON.stringify(data), function (err) {\r\n                if (err) {\r\n                    console.error(err);\r\n                }\r\n                else {\r\n                    console.log('Saved ' + filePath);\r\n                }\r\n            });\r\n        }\r\n    });\r\n}\r\nexports.saveData = saveData;\r\n\n\n//# sourceURL=webpack://stichiclock/./src/local/utils.ts?");

/***/ }),

/***/ "./src/settings.ts":
/*!*************************!*\
  !*** ./src/settings.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.rangeWidth = exports.groupsFilename = void 0;\r\nexports.groupsFilename = 'groups_filtered.json';\r\nexports.rangeWidth = 5;\r\n\n\n//# sourceURL=webpack://stichiclock/./src/settings.ts?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");;

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/local/index.ts");
/******/ 	
/******/ })()
;