import { FileParser } from '../src/FileParser';

var fs = require('fs');

function useCSharp(file: string, callback: (parser: FileParser) => void) {
    return (done: Function) => {
        fs.readFile('./spec/csharp/' + file, 'utf8', function (err: any, data: any) {
            callback(new FileParser(data));
            done();
        });
    };
}

describe("FileParser", function () {

    describe("usings:", function () {
        
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

            expect(file.namespaces[1].name).toEqual('blah');
            expect(file.namespaces[1].fullName).toEqual('blah');

            expect(file.namespaces[1].namespaces[0].name).toEqual('foo');
            expect(file.namespaces[1].namespaces[0].fullName).toEqual('blah.foo');
        }));

    });

    describe("generics:", function () {

        it("should be able to handle generics", useCSharp('Generics.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.classes.length).toEqual(1);
            expect(file.classes[0].properties.length).toEqual(2);

            expect(file.classes[0].properties[0].name).toEqual('Name');
            expect(file.classes[0].properties[0].type.name).toEqual('SomeFoo<,>');
            expect(file.classes[0].properties[0].type.genericParameters[0].name).toEqual('SomeBar');
            expect(file.classes[0].properties[0].type.genericParameters[1].name).toEqual('SomeThing');

            expect(file.classes[0].properties[1].name).toEqual('Foo');
            expect(file.classes[0].properties[1].type.name).toEqual('SomeFoo<,>');
            expect(file.classes[0].properties[1].type.genericParameters[0].name).toEqual('SomeBar<>');
            expect(file.classes[0].properties[1].type.genericParameters[1].name).toEqual('SomeThing<>');
        }));

    });

    describe("namespaces:", function () {

        it("should be able to fetch file containing scoped namespaces", useCSharp('NamespacesNested.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.namespaces.length).toEqual(2);
            expect(file.namespaces[0].namespaces.length).toEqual(1);
            expect(file.namespaces[0].namespaces[0].namespaces.length).toEqual(1);

            expect(file.namespaces[0].name).toEqual('my');

            expect(file.namespaces[0].namespaces[0].name).toEqual('stuff');
            expect(file.namespaces[0].namespaces[0].fullName).toEqual('my.stuff');

            expect(file.namespaces[0].namespaces[0].namespaces[0].name).toEqual('blah');
            expect(file.namespaces[0].namespaces[0].namespaces[0].fullName).toEqual('my.stuff.blah');

            expect(file.namespaces[1].name).toEqual('omg');
        }));

    });

    describe("methods:", function () {

        it("should be able to fetch methods inside classes and their parameters", useCSharp('MethodInsideClass.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.classes.length).toEqual(1);
			expect(file.classes[0].methods.length).toEqual(3);
            
			expect(file.classes[0].methods[0].attributes.length).toEqual(0);
            expect(file.classes[0].methods[0].parameters.length).toEqual(0);
			expect(file.classes[0].methods[1].attributes.length).toEqual(1);
			expect(file.classes[0].methods[1].parameters.length).toEqual(3);
			expect(file.classes[0].methods[1].parameters[2].type.genericParameters.length).toEqual(1);
			expect(file.classes[0].methods[1].parameters[2].type.genericParameters[0].genericParameters.length).toEqual(2);

			expect(file.classes[0].methods[0].returnType.name).toEqual('string');
			expect(file.classes[0].methods[0].isVirtual).toBe(true);
            expect(file.classes[0].methods[0].name).toEqual('MyFunction');

			expect(file.classes[0].methods[1].returnType.name).toEqual('void');
			expect(file.classes[0].methods[1].isVirtual).toBe(false);
            expect(file.classes[0].methods[1].name).toEqual('SomeOtherFunction');

            expect(file.classes[0].methods[1].parameters[0].name).toEqual('parameter1');
            expect(file.classes[0].methods[1].parameters[0].type.name).toEqual('string');

            expect(file.classes[0].methods[1].parameters[1].name).toEqual('parameter2');
            expect(file.classes[0].methods[1].parameters[1].type.name).toEqual('bool');
			expect(file.classes[0].methods[1].parameters[1].defaultValue).toEqual(false);

			expect(file.classes[0].methods[1].parameters[2].name).toEqual('foo');
			expect(file.classes[0].methods[1].parameters[2].type.name).toEqual('List<>');
			expect(file.classes[0].methods[1].parameters[2].type.genericParameters[0].name).toEqual('Dictionary<,>');
			expect(file.classes[0].methods[1].parameters[2].type.genericParameters[0].genericParameters[0].name).toEqual('string');
			expect(file.classes[0].methods[1].parameters[2].type.genericParameters[0].genericParameters[1].name).toEqual('int');
			expect(file.classes[0].methods[1].parameters[2].defaultValue).toEqual('bar');
        }));

    });

    describe("enums:", function () {

        it("should be able to fetch enums and the appropriate values", useCSharp('Enum.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.enums.length).toEqual(1);
            expect(file.enums[0].options.length).toEqual(5);
            expect(file.enums[0].attributes.length).toEqual(1);

            expect(file.classes.length).toEqual(1);
            expect(file.classes[0].enums.length).toEqual(2);
            expect(file.namespaces[0].enums.length).toEqual(1);

            expect(file.enums[0].options[1].attributes.length).toEqual(2);
            expect(file.enums[0].options[2].attributes.length).toEqual(1);
            expect(file.enums[0].options[3].attributes.length).toEqual(3);

            expect(file.enums[0].options[0].name).toEqual('FirstValue');
            expect(file.enums[0].options[0].value).toEqual(0);

            expect(file.enums[0].options[1].name).toEqual('SecondValue');
            expect(file.enums[0].options[1].value).toEqual(-4);
            expect(file.enums[0].options[1].attributes[0].name).toEqual('SomeStuff');
            expect(file.enums[0].options[1].attributes[1].name).toEqual('SomeAttribute');

            expect(file.enums[0].options[2].name).toEqual('ThirdValue');
            expect(file.enums[0].options[2].value).toEqual(-3);
            expect(file.enums[0].options[2].attributes[0].name).toEqual('SomeAttribute');

            expect(file.enums[0].options[3].name).toEqual('FourthValue');
            expect(file.enums[0].options[3].value).toEqual(6);
            expect(file.enums[0].options[3].attributes[0].name).toEqual('SomeAttribute');
            expect(file.enums[0].options[3].attributes[1].name).toEqual('FooAttribute');
            expect(file.enums[0].options[3].attributes[2].name).toEqual('BlahAttribute');

            expect(file.enums[0].options[4].name).toEqual('FifthValue');
            expect(file.enums[0].options[4].value).toEqual(7);
        }));

	});

    describe("interfaces:", function() {

		it("should be able to fetch interfaces inside namespaces", useCSharp('InterfaceInsideNamespace.cs', (parser) => {
			var file = parser.parseFile();

			expect(file.namespaces.length).toEqual(1);
			expect(file.namespaces[0].interfaces.length).toEqual(1);
			expect(file.namespaces[0].interfaces[0].properties.length).toEqual(1);
			expect(file.namespaces[0].interfaces[0].methods.length).toEqual(1);
			expect(file.namespaces[0].interfaces[0].attributes.length).toEqual(1);

			expect(file.namespaces[0].interfaces[0].name).toEqual("MyPoco");

			expect(file.namespaces[0].interfaces[0].properties[0].name).toEqual("Name");
			expect(file.namespaces[0].interfaces[0].properties[0].type.name).toEqual("Array<>");
			expect(file.namespaces[0].interfaces[0].properties[0].type.genericParameters[0].name).toEqual("string");

			expect(file.namespaces[0].interfaces[0].methods[0].name).toEqual("SomeMethod");
			expect(file.namespaces[0].interfaces[0].methods[0].returnType.name).toEqual("Int32");
			expect(file.namespaces[0].interfaces[0].methods[0].returnType.fullName).toEqual("System.Int32");
		}));

    });

	describe("classes:", function () {

		it("should be able to fetch properties inside classes", useCSharp('PropertyInsideClass.cs', (parser) => {
			var file = parser.parseFile();

			expect(file.classes.length).toEqual(1);
			expect(file.classes[0].properties.length).toEqual(4);
			expect(file.classes[0].properties[0].components.length).toEqual(2);
			expect(file.classes[0].properties[1].components.length).toEqual(1);
			expect(file.classes[0].properties[1].attributes.length).toEqual(0);
			expect(file.classes[0].properties[2].components.length).toEqual(2);
			expect(file.classes[0].properties[2].attributes.length).toEqual(1);
			expect(file.classes[0].properties[3].components.length).toEqual(2);

			expect(file.classes[0].properties[0].name).toEqual("MyProperty");
			expect(file.classes[0].properties[0].isReadOnly).toBe(false);
			expect(file.classes[0].properties[0].isVirtual).toBe(false);
			expect(file.classes[0].properties[0].type.name).toEqual("string");

			expect(file.classes[0].properties[1].name).toEqual("ReadOnlyProperty");
			expect(file.classes[0].properties[1].isReadOnly).toBe(true);
			expect(file.classes[0].properties[1].components[0].type).toEqual("get");
			expect(file.classes[0].properties[1].type.name).toEqual("string");

			expect(file.classes[0].properties[2].name).toEqual("GetSetProperty");
			expect(file.classes[0].properties[2].isReadOnly).toBe(false);
			expect(file.classes[0].properties[2].type.name).toEqual("string");

			expect(file.classes[0].properties[3].name).toEqual("MyPublicVirtualProperty");
			expect(file.classes[0].properties[3].isReadOnly).toBe(false);
			expect(file.classes[0].properties[3].isVirtual).toBe(true);
			expect(file.classes[0].properties[3].type.name).toEqual("string");
		}));

		it("should be able to fetch classes inside namespaces", useCSharp('ClassInsideNamespace.cs', (parser) => {
			var file = parser.parseFile();

			expect(file.namespaces.length).toEqual(1);
			expect(file.namespaces[0].classes.length).toEqual(1);
			expect(file.namespaces[0].classes[0].properties.length).toEqual(1);
			expect(file.namespaces[0].classes[0].attributes.length).toEqual(1);
			expect(file.namespaces[0].classes[0].fields.length).toEqual(1);
			expect(file.namespaces[0].classes[0].methods.length).toEqual(0);
			expect(file.namespaces[0].classes[0].constructors.length).toEqual(1);
			expect(file.namespaces[0].classes[0].genericParameters.length).toEqual(1);

			expect(file.namespaces[0].classes[0].name).toEqual("MyPoco");
            
			expect(file.namespaces[0].classes[0].genericParameters[0].name).toEqual("WithGenerics");

			expect(file.namespaces[0].classes[0].properties[0].name).toEqual("Name");
			expect(file.namespaces[0].classes[0].properties[0].type.name).toEqual("Array<>");
			expect(file.namespaces[0].classes[0].properties[0].type.genericParameters[0].name).toEqual("string");

			expect(file.namespaces[0].classes[0].fields[0].name).toEqual("someField");
			expect(file.namespaces[0].classes[0].fields[0].isPublic).toBe(true);
			expect(file.namespaces[0].classes[0].fields[0].type.name).toBe("int");
			expect(file.namespaces[0].classes[0].fields[0].type.isNullable).toBe(true);

			expect(file.namespaces[0].classes[0].constructors[0].name).toEqual("MyPoco");
			expect(file.namespaces[0].classes[0].constructors[0].isConstructor).toBe(true);
		}));

		it("should be able to fetch classes that inherit from something", useCSharp('InheritedClass.cs', (parser) => {
			var file = parser.parseFile();

			expect(file.classes.length).toEqual(1);

			expect(file.classes[0].inheritsFrom).not.toBeUndefined();
			expect(file.classes[0].inheritsFrom.name).toEqual("IMyInterface<>");
		}));

	});

    describe("structs:", function () {

        it("should be able to detect structs", useCSharp('Struct.cs', (parser) => {
            var file = parser.parseFile();

			expect(file.structs.length).toEqual(1);
			expect(file.structs[0].attributes.length).toEqual(1);

			expect(file.structs[0].isPublic).toEqual(true);
			expect(file.structs[0].name).toEqual("MyStruct");
		}));

    });

    describe("comments:", function () {

        it("should be able to remove comments from output", useCSharp('Comments.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.classes.length).toEqual(1);
            expect(file.classes[0].fields.length).toEqual(1);
            expect(file.classes[0].properties.length).toEqual(1);
            expect(file.classes[0].methods.length).toEqual(3);

            expect(file.classes[0].methods[0].returnType.name).toEqual("void");

            expect(file.classes[0].methods[1].parameters[0].defaultValue).toEqual(false);
            expect(file.classes[0].methods[1].parameters[0].type.name).toEqual("bool");
            expect(file.classes[0].methods[1].parameters[0].name).toEqual("parameter2");
        }));

    });

});
