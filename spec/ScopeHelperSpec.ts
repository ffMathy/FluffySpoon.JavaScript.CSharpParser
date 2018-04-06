import { ScopeHelper } from '../src/ScopeHelper';

describe("ScopeHelper", function () {

    var scopeHelper = new ScopeHelper();

    it("should be able to handle curly scopes with content", () => {
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

    it("should be able to handle nested single line comment scopes with newlines around", () => {
        var content = "\n\t}  //other foo\n bar baz";
        var trimmed = scopeHelper.enumerateRelevantCodeCharacterRegions(content);

        expect(trimmed).toEqual("\n\t}  \n bar baz");
    });

    it("should be able to handle lists", () => {
        var content = "foo { bar { sub bar } other bar<generics, foo<stuff<lala>>, lol> }, other<blah, lol>, foo";
        var scopes = scopeHelper.getScopedList(",", content);

        expect(scopes.length).toEqual(3);

        expect(scopes[0]).toEqual("foo { bar { sub bar } other bar<generics, foo<stuff<lala>>, lol> }");
        expect(scopes[1]).toEqual("other<blah, lol>");
        expect(scopes[2]).toEqual("foo");
    });

});
