import { FileParser } from '../src/FileParser';

var fs = require('fs');

function useCSharp(file: string, callback: (parser: FileParser) => void) {
    return (done: Function) => {
        fs.readFile('./spec/csharp/' + file, 'utf8', function (err, data) {
            callback(new FileParser(data));
            done();
        });
    };
}

describe("FileParser", function () {

    describe("usings", function () {
        
        it("should be able to fetch file containing only usings and no scopes", useCSharp('Usings.cs', (parser) => {
            var file = parser.parseFile();
            expect(file.usings.length).toEqual(2);

            expect(file.usings[0].alias).toEqual('foo');
            expect(file.usings[0].namespace.fullName).toEqual('buz.bar');

            expect(file.usings[1].alias).toBeUndefined();
            expect(file.usings[1].namespace.fullName).toEqual('blah.lol.omg');
        }));

        it("should be able to fetch file containing scoped usings", useCSharp('UsingsAndNamespaces.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.usings.length).toEqual(2);

            expect(file.usings[0].alias).toEqual('foo');
            expect(file.usings[0].namespace.fullName).toEqual('buz.bar');

            expect(file.usings[1].alias).toBeUndefined();
            expect(file.usings[1].namespace.fullName).toEqual('blah');

            expect(file.namespaces[0].usings[0].namespace.name).toEqual('blah.lol.omg');
            expect(file.namespaces[0].usings[0].parent.name).toEqual('mynamespace');
        }));

    });

    describe("namespaces", function () {

        it("should be able to fetch file containing scoped namespaces", useCSharp('NamespacesNested.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.namespaces.length).toEqual(2);

            expect(file.namespaces[0].name).toEqual('my.stuff');
            expect(file.namespaces[1].name).toEqual('omg');

            expect(file.namespaces[0].namespaces.length).toEqual(1);

            expect(file.namespaces[0].namespaces[0].name).toEqual('blah');
            expect(file.namespaces[0].namespaces[0].fullName).toEqual('my.stuff.blah');
        }));

    });

    describe("methods", function () {

        it("should be able to fetch methods inside classes and their parameters", useCSharp('MethodInsideClass.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.classes.length).toEqual(1);
            expect(file.classes[0].methods.length).toEqual(2);

            expect(file.classes[0].methods[0].parameters.length).toEqual(0);
            expect(file.classes[0].methods[1].parameters.length).toEqual(2);

            expect(file.classes[0].methods[0].returnType.name).toEqual('string');
            expect(file.classes[0].methods[0].name).toEqual('MyFunction');

            expect(file.classes[0].methods[1].returnType.name).toEqual('void');
            expect(file.classes[0].methods[1].name).toEqual('SomeOtherFunction');

            expect(file.classes[0].methods[1].parameters[0].name).toEqual('parameter1');
            expect(file.classes[0].methods[1].parameters[0].type.name).toEqual('string');

            expect(file.classes[0].methods[1].parameters[1].name).toEqual('parameter2');
            expect(file.classes[0].methods[1].parameters[1].type.name).toEqual('bool');
            expect(file.classes[0].methods[1].parameters[1].defaultValue).toEqual('false');
        }));

    });

    describe("enums", function () {

        it("should be able to fetch enums and the appropriate values", useCSharp('Enum.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.enums.length).toEqual(1);
            expect(file.enums[0].options.length).toEqual(5);

            expect(file.classes.length).toEqual(1);
            expect(file.classes[0].enums.length).toEqual(2);

            expect(file.enums[0].options[0].name).toEqual('FirstValue');
            expect(file.enums[0].options[0].value).toEqual(0);

            expect(file.enums[0].options[1].name).toEqual('SecondValue');
            expect(file.enums[0].options[1].value).toEqual(-4);

            expect(file.enums[0].options[2].name).toEqual('ThirdValue');
            expect(file.enums[0].options[2].value).toEqual(-3);

            expect(file.enums[0].options[3].name).toEqual('FourthValue');
            expect(file.enums[0].options[3].value).toEqual(6);

            expect(file.enums[0].options[4].name).toEqual('FifthValue');
            expect(file.enums[0].options[4].value).toEqual(7);
        }));

    });

});
