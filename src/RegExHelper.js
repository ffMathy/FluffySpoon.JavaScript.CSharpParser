"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegExHelper = /** @class */ (function () {
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
    return RegExHelper;
}());
exports.RegExHelper = RegExHelper;
//# sourceMappingURL=RegExHelper.js.map