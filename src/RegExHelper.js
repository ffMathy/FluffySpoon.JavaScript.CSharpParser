"use strict";
var RegExHelper = (function () {
    function RegExHelper() {
    }
    RegExHelper.prototype.getMatches = function (input, regex) {
        var final = [];
        var groups;
        while (groups = regex.exec(input)) {
            final.push(groups.slice(1));
        }
        return final;
    };
    RegExHelper.prototype.escape = function (input) {
        return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    return RegExHelper;
}());
exports.RegExHelper = RegExHelper;
//# sourceMappingURL=RegExHelper.js.map