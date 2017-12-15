"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScopeHelper_1 = require("../src/ScopeHelper");
describe("ScopeHelper", function () {
    var scopeHelper = new ScopeHelper_1.ScopeHelper();
    it("should be able to handle curly scopes with content", function () {
        var content = "foo { bar { sub bar } other bar } other foo";
        var scopes = scopeHelper.getCurlyScopes(content);
        expect(scopes.length).toEqual(2);
        expect(scopes[0].prefix).toEqual("foo {");
        expect(scopes[0].content).toEqual(" bar { sub bar } other bar ");
        expect(scopes[0].suffix).toEqual("} other foo");
        expect(scopes[0].offset).toEqual(4);
        expect(scopes[0].length).toEqual(29);
        expect(scopes[1].prefix).toEqual("} other foo");
        expect(scopes[1].content).toEqual("");
        expect(scopes[1].suffix).toEqual("");
    });
    it("should be able to handle nested single line comment scopes with newlines around", function () {
        var content = "\n\t}  //other foo\n bar baz";
        var trimmed = scopeHelper.enumerateRelevantCodeCharacterRegions(content);
        expect(trimmed).toEqual("\n\t}  \n bar baz");
    });
});
//# sourceMappingURL=ScopeHelperSpec.js.map