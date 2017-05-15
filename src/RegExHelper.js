"use strict";
var RegExHelper = (function () {
    function RegExHelper() {
    }
    RegExHelper.getMatches = function (input, regex) {
        var matches = regex.exec(input);
        if (!matches)
            return [];
        return matches.slice(1);
    };
    return RegExHelper;
}());
exports.RegExHelper = RegExHelper;
