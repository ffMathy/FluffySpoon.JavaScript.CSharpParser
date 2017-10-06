"use strict";
var Models_1 = require("./Models");
var RegExHelper_1 = require("./RegExHelper");
var AttributeParser = (function () {
    function AttributeParser() {
        this.regexHelper = new RegExHelper_1.RegExHelper();
    }
    AttributeParser.prototype.parseAttributes = function (content) {
        var attributes = new Array();
        if (content) {
            var matches = this.regexHelper.getMatches(content, /(\w+)\s*(?:\((?:.|\s)+?\))?/g);
            for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                var match = matches_1[_i];
                var attribute = new Models_1.CSharpAttribute(match[0]);
                attributes.push(attribute);
            }
        }
        return attributes;
    };
    return AttributeParser;
}());
exports.AttributeParser = AttributeParser;
//# sourceMappingURL=AttributeParser.js.map