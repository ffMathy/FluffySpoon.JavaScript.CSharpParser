"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegExHelper = /** @class */ (function () {
    function RegExHelper() {
    }
    RegExHelper.getClassOrInterfaceRegex = function (keyword) {
        return "\\s*" + RegExHelper.REGEX_ATTRIBUTE + "\\s*" + RegExHelper.REGEX_MODIFIERS + keyword + "\\s+(" + RegExHelper.REGEX_TYPE_NAME + ")(?:\\s*" + RegExHelper.REGEX_GENERIC_TYPES_WRAPPED + ")?\\s*(?:\\:\\s*(" + RegExHelper.REGEX_TYPE_NAME + "(?:\\s*" + RegExHelper.REGEX_GENERIC_TYPES_WRAPPED + ")?))?(?:\\s*where\\s*" + RegExHelper.REGEX_TYPE_NAME + "\\s*(?:" + RegExHelper.REGEX_GENERIC_TYPES_WRAPPED + ")?\\s*\\:\\s*([\\w()]+?(?:\\s*" + RegExHelper.REGEX_GENERIC_TYPES_WRAPPED + ")?))?\\s*{";
    };
    RegExHelper.prototype.getMatches = function (input, regex) {
        var final = [];
        var groups;
        while (groups = regex.exec(input)) {
            final.push(groups.slice(1));
        }
        return final;
    };
    RegExHelper.REGEX_GENERIC_TYPES_WRAPPED = "<\\s*([<>.\\w,\\s]+)\\s*>";
    RegExHelper.REGEX_MODIFIERS = "((?:\\w+\\s)*)";
    RegExHelper.REGEX_TYPE_NAME = "[\\w.]+";
    RegExHelper.REGEX_TYPE = "(" + RegExHelper.REGEX_TYPE_NAME + ")(?:\\s*" + RegExHelper.REGEX_GENERIC_TYPES_WRAPPED + ")?(\\?|(?:\\[\\]))?";
    RegExHelper.REGEX_ATTRIBUTE = "((?:\\[.*\\]\\s*?)*)?";
    RegExHelper.REGEX_CLASS = RegExHelper.getClassOrInterfaceRegex("class");
    RegExHelper.REGEX_INTERFACE = RegExHelper.getClassOrInterfaceRegex("interface");
    RegExHelper.REGEX_METHOD = "\\s*" + RegExHelper.REGEX_ATTRIBUTE + "\\s*((?:\\w+\\s)*)((?:[\\w.]+\\s*<\\s*.+\\s*>)|[\\w.]+)\\s+(\\w+?)\\s*\\(((?:.|\\s)*?)\\)\\s*({|;)";
    RegExHelper.REGEX_METHOD_PARAMETER = RegExHelper.REGEX_ATTRIBUTE + "(?:(params)\\s*)?([\\w.\\[\\]]+\\s*(?:<\\s*.+\\s*>)?)\\s+(\\w+)(?:\\s*=\\s*(.+?))?\\s*(?:,|$)";
    return RegExHelper;
}());
exports.RegExHelper = RegExHelper;
//# sourceMappingURL=RegExHelper.js.map