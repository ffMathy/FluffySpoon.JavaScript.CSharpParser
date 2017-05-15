"use strict";
var FileParser_1 = require("../src/FileParser");
describe("FileParser", function () {
    describe("usings", function () {
        it("should be able to fetch file containing only usings and no scopes", function () {
            var parser = new FileParser_1.FileParser("using foo=buz.bar;\nusing blah.lol.omg;");
            var file = parser.parseFile();
            expect(file.usings.length).toEqual(2);
            expect(file.usings[0].alias).toEqual('foo');
            expect(file.usings[0].namespace.fullName).toEqual('buz.bar');
            expect(file.usings[1].alias).toBeUndefined();
            expect(file.usings[1].namespace.fullName).toEqual('blah.lol.omg');
        });
        it("should be able to fetch file containing scoped usings", function () {
            var parser = new FileParser_1.FileParser("using foo=buz.bar;\namespace mynamespace {\nusing blah.lol.omg;\n}\nusing blah;");
            var file = parser.parseFile();
            expect(file.usings.length).toEqual(2);
            expect(file.usings[0].alias).toEqual('foo');
            expect(file.usings[0].namespace.fullName).toEqual('buz.bar');
            expect(file.usings[1].alias).toBeUndefined();
            expect(file.usings[1].namespace.fullName).toEqual('blah');
        });
    });
    describe("namespaces", function () {
        it("should be able to fetch file containing scoped namespaces", function () {
            var parser = new FileParser_1.FileParser("namespace my.namespace {\nnamespace blah {\n}\n}\nnamespace omg {\n}");
            var file = parser.parseFile();
            expect(file.namespaces.length).toEqual(2);
            expect(file.namespaces[0].name).toEqual('my.namespace');
            expect(file.namespaces[1].name).toEqual('omg');
        });
    });
});
