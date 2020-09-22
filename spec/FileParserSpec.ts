import { FileParser } from '../src/FileParser';
import { CSharpNamedToken } from '../src/Index';

var fs = require('fs');

function useCSharp(file: string, callback: (parser: FileParser) => void) {
    return (done: Function) => {
        fs.readFile('./spec/csharp/' + file, 'utf8', function (err: any, data: any) {
            console.log("\n\n" + file);
            callback(new FileParser(data));
            done();
        });
    };
}

describe("FileParser", function () {

    it("should be able to fetch properties inside classes", useCSharp('PropertyInsideClass.cs', (parser) => {
        var file = parser.parseFile();

        expect(file.classes.length).toBe(1, "classes length");
        expect(file.classes[0].properties.length).toBe(8, "class properties length");
        expect(file.classes[0].properties[0].components.length).toBe(2, "class property 0 components length");
        expect(file.classes[0].properties[1].components.length).toBe(1, "class property 1 components length");
        expect(file.classes[0].properties[1].attributes.length).toBe(0, "class property 1 attributes length");
        expect(file.classes[0].properties[2].components.length).toBe(2, "class property 2 components length");
        expect(file.classes[0].properties[2].attributes.length).toBe(1, "class property 2 attributes length");
        expect(file.classes[0].properties[4].components.length).toBe(1, "class property 3 components length");

        expect(file.classes[0].properties[0].name).toBe("MyProperty");
        expect(file.classes[0].properties[0].isReadOnly).toBe(false);
        expect(file.classes[0].properties[0].isVirtual).toBe(false);
        expect(file.classes[0].properties[0].type.name).toBe("string");
        expect(file.classes[0].properties[0].initialValue).toBe(undefined);

        expect(file.classes[0].properties[1].name).toBe("ReadOnlyProperty");
        expect(file.classes[0].properties[1].isReadOnly).toBe(true);
        expect(file.classes[0].properties[1].components[0].type).toBe("get");
        expect(file.classes[0].properties[1].type.name).toBe("string");
        expect(file.classes[0].properties[1].initialValue).toBe(undefined);

        expect(file.classes[0].properties[2].name).toBe("GetSetProperty");
        expect(file.classes[0].properties[2].isReadOnly).toBe(false);
        expect(file.classes[0].properties[2].type.name).toBe("string");
        expect(file.classes[0].properties[2].initialValue).toBe(undefined);

        expect(file.classes[0].properties[3].name).toBe("MyPublicVirtualProperty");
        expect(file.classes[0].properties[3].isReadOnly).toBe(false);
        expect(file.classes[0].properties[3].isVirtual).toBe(true);
        expect(file.classes[0].properties[3].type.name).toBe("string");
        expect(file.classes[0].properties[3].initialValue).toBe('"barfoo"');

        expect(file.classes[0].properties[4].name).toBe("ReadOnlyShortProperty");
        expect(file.classes[0].properties[4].isReadOnly).toBe(true);
        expect(file.classes[0].properties[4].components[0].type).toBe("get");
        expect(file.classes[0].properties[4].type.name).toBe("string");
        expect(file.classes[0].properties[4].initialValue).toBe(undefined);

        expect(file.classes[0].properties[5].name).toBe("TupleReturningProperty");
        expect(file.classes[0].properties[5].type.name).toBe("ValueTuple<,>");
        expect(file.classes[0].properties[5].initialValue).toBe(undefined);

        expect(file.classes[0].properties[5].type.genericParameters[1].name).toBe("Func<,>");
        expect(file.classes[0].properties[5].type.genericParameters[1].genericParameters[0].name).toBe("int");
        expect(file.classes[0].properties[5].type.genericParameters[1].genericParameters[1].name).toBe("string");

        expect(file.classes[0].properties[6].name).toBe("NamedTupleReturningProperty");
        expect(file.classes[0].properties[6].type.name).toBe("ValueTuple<,>");
        expect(file.classes[0].properties[6].type.genericParameters[1].name).toBe("Func<,>");
        expect(file.classes[0].properties[6].type.genericParameters[1].genericParameters[0].name).toBe("int");
        expect(file.classes[0].properties[6].type.genericParameters[1].genericParameters[1].name).toBe("string");
        expect(file.classes[0].properties[6].initialValue).toBe(undefined);

        expect(file.classes[0].properties[7].name).toBe("List");
        expect(file.classes[0].properties[7].type.name).toBe("IList<>");
        expect(file.classes[0].properties[7].type.genericParameters[0].name).toBe("string");
        expect(file.classes[0].properties[7].initialValue).toBe(undefined);
    }));

    describe("comments:", function () {

        it("should be able to remove comments from output", useCSharp('Comments.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.classes.length).toBe(1, "classes length");
            expect(file.classes[0].fields.length).toBe(1, "class fields length");
            expect(file.classes[0].properties.length).toBe(1, "class properties length");
            expect(file.classes[0].methods.length).toBe(3, "class methods length");

            expect(file.classes[0].methods[0].returnType.name).toBe("void");

            expect(file.classes[0].methods[1].parameters[0].defaultValue).toBe(false);
            expect(file.classes[0].methods[1].parameters[0].type.name).toBe("bool");
            expect(file.classes[0].methods[1].parameters[0].name).toBe("parameter2");
        }));

    });

    describe("usings:", function () {

        it("should be able to fetch file containing only usings and no scopes", useCSharp('Usings.cs', (parser) => {
            var file = parser.parseFile();
            expect(file.usings.length).toBe(2);

            expect(file.usings[0].alias).toBe('foo');
            expect(file.usings[0].namespace.fullName).toBe('buz.bar');

            expect(file.usings[1].alias).toBeNull();
            expect(file.usings[1].namespace.fullName).toBe('blah.lol.omg');
        }));

        it("should be able to fetch file containing scoped usings", useCSharp('UsingsAndNamespaces.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.usings.length).toBe(2);

            expect(file.usings[0].alias).toBe('foo');
            expect(file.usings[0].namespace.fullName).toBe('buz.bar');

            expect(file.usings[1].alias).toBeNull();
            expect(file.usings[1].namespace.fullName).toBe('blah');

            expect(file.namespaces[0].usings[0].namespace.name).toBe('blah.lol.omg');
            expect(file.namespaces[0].usings[0].parent.name).toBe('mynamespace');

            expect(file.namespaces[1].name).toBe('blah');
            expect(file.namespaces[1].fullName).toBe('blah');

            expect(file.namespaces[1].namespaces[0].name).toBe('foo');
            expect(file.namespaces[1].namespaces[0].fullName).toBe('blah.foo');
        }));

    });

	describe("classes:", function () {

		it("should be able to fetch classes inside namespaces", useCSharp('ClassInsideNamespace.cs', (parser) => {
            var file = parser.parseFile();

			expect(file.namespaces.length).toBe(1, "namespaces length");
			expect(file.namespaces[0].classes.length).toBe(1, "namespace classes length");
			expect(file.namespaces[0].classes[0].properties.length).toBe(2, "namespace class properties length");
			expect(file.namespaces[0].classes[0].attributes.length).toBe(2, "namespace class attributes length");
			expect(file.namespaces[0].classes[0].fields.length).toBe(2, "namespace class fields length");
			expect(file.namespaces[0].classes[0].methods.length).toBe(0, "namespace class methods length");
			expect(file.namespaces[0].classes[0].constructors.length).toBe(1, "namespace class constructors length");
			expect(file.namespaces[0].classes[0].genericParameters.length).toBe(1, "namespace class generic parameters length");

			expect(file.namespaces[0].classes[0].name).toBe("MyPoco", "namespace class name");

			expect(file.namespaces[0].classes[0].genericParameters[0].name).toBe("WithGenerics", "namespace class generic parameter name");

			expect(file.namespaces[0].classes[0].properties[0].name).toBe("Name", "namespace class property name");
			expect(file.namespaces[0].classes[0].properties[0].type.name).toBe("Array<>", "namespace class property type name");
			expect(file.namespaces[0].classes[0].properties[0].type.genericParameters[0].name).toBe("string", "namespace class property type generic parameter name");

            expect(file.namespaces[0].classes[0].properties[1].name).toBe("EscapedName", "namespace class escaped property name");
            expect(file.namespaces[0].classes[0].properties[1].type.name).toBe("bool", "namespace class escaped property type name");

			expect(file.namespaces[0].classes[0].fields[0].name).toBe("someField", "namespace class field name");
			expect(file.namespaces[0].classes[0].fields[0].isPublic).toBe(true, "namespace class field public");
			expect(file.namespaces[0].classes[0].fields[0].type.name).toBe("int", "namespace class field type name");
			expect(file.namespaces[0].classes[0].fields[0].type.isNullable).toBe(true, "namespace class field type nullable");

            expect(file.namespaces[0].classes[0].fields[1].type.genericParameters[0].name).toBe("string", "namespace class field generic parameter name");
            expect(file.namespaces[0].classes[0].fields[1].initialValue).toBe("new List<string>()", "namespace class field initial value");

			expect(file.namespaces[0].classes[0].constructors[0].name).toBe("MyPoco", "namespace class constructor name");
			expect(file.namespaces[0].classes[0].constructors[0].isConstructor).toBe(true, "namespace class constructor is constructor");
			expect(file.namespaces[0].classes[0].constructors[0].isPublic).toBe(true, "namespace class constructor is public");

			expect(file.namespaces[0].classes[0].attributes[1].name).toBe("SomeAttributeWithParameters", "namespace class attribute name");
			expect(file.namespaces[0].classes[0].attributes[1].parameters[0].name).toBe("MyName", "namespace class attribute parameter 0 name");
			expect(file.namespaces[0].classes[0].attributes[1].parameters[0].value).toBe("Foo", "namespace class attribute parameter 0 value");
			expect(file.namespaces[0].classes[0].attributes[1].parameters[1].name).toBe(null, "namespace class attribute parameter 1 name");
			expect(file.namespaces[0].classes[0].attributes[1].parameters[1].value).toBe(28, "namespace class attribute parameter 1 value");
			expect(file.namespaces[0].classes[0].attributes[1].parameters[2].name).toBe(null, "namespace class attribute parameter 2 name");
            expect((file.namespaces[0].classes[0].attributes[1].parameters[2].value as CSharpNamedToken).name).toBe("Framework.Blah", "namespace class attribute parameter 2 value");
		}));

		it("should be able to fetch interfaces that implement something", useCSharp('ImplementedInterface.cs', (parser) => {
			var file = parser.parseFile();

			expect(file.interfaces.length).toBe(1);
			expect(file.interfaces[0].implements.length).toBe(2);

			expect(file.interfaces[0].implements[0]).not.toBeUndefined();
			expect(file.interfaces[0].implements[0].name).toBe("IMyInterface1<>");

			expect(file.interfaces[0].implements[1]).not.toBeUndefined();
			expect(file.interfaces[0].implements[1].name).toBe("IMyInterface2<,>");
		}));

		it("should be able to fetch classes that inherit from something", useCSharp('InheritedClass.cs', (parser) => {
			var file = parser.parseFile();

			expect(file.classes.length).toBe(1);
			expect(file.classes[0].inheritsFrom.length).toBe(2);

			expect(file.classes[0].inheritsFrom[0]).not.toBeUndefined();
			expect(file.classes[0].inheritsFrom[0].name).toBe("IMyInterface1<>");

			expect(file.classes[0].inheritsFrom[1]).not.toBeUndefined();
			expect(file.classes[0].inheritsFrom[1].name).toBe("IMyInterface2<,>");
		}));

	});

    describe("generics:", function () {

        it("should be able to handle generics", useCSharp('Generics.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.classes.length).toBe(1, "classes length");
            expect(file.classes[0].properties.length).toBe(2, "class properties length");
            expect(file.classes[0].methods.length).toBe(1, "class methods length");

            expect(file.classes[0].properties[0].name).toBe('Name', "class property 0 name");
            expect(file.classes[0].properties[0].type.name).toBe('SomeFoo<,>', "class property 0 type name");
            expect(file.classes[0].properties[0].type.genericParameters[0].name).toBe('SomeBar');
            expect(file.classes[0].properties[0].type.genericParameters[1].name).toBe('SomeThing');

            expect(file.classes[0].properties[1].name).toBe('Foo');
            expect(file.classes[0].properties[1].type.name).toBe('SomeFoo<,>', "class property 1 type name");
            expect(file.classes[0].properties[1].type.genericParameters[0].name).toBe('SomeBar<>');
            expect(file.classes[0].properties[1].type.genericParameters[1].name).toBe('SomeThing<>');

            expect(file.classes[0].methods[0].name).toBe('Bar');
            expect(file.classes[0].methods[0].returnType.name).toBe('SomeFoo<>', "class method 0 type name");
            expect(file.classes[0].methods[0].returnType.genericParameters[0].name).toBe('SomeBar');
        }));

    });

    describe("enums:", function () {

        it("should be able to fetch enums and the appropriate values", useCSharp('Enum.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.enums.length).toBe(1, "enums length");
            expect(file.enums[0].options.length).toBe(5, "enum options length");
            expect(file.enums[0].attributes.length).toBe(1, "enum attributes length");

            expect(file.classes.length).toBe(1, "classes length");
            expect(file.classes[0].enums.length).toBe(2, "classes enums length");
            expect(file.namespaces[0].enums.length).toBe(1, "namespace enums length");

            expect(file.enums[0].options[1].attributes.length).toBe(2, "enum option 1 attributes length");
            expect(file.enums[0].options[2].attributes.length).toBe(1, "enum option 2 attributes length");
            expect(file.enums[0].options[3].attributes.length).toBe(3, "enum option 3 attributes length");

            expect(file.enums[0].options[0].name).toBe('FirstValue');
            expect(file.enums[0].options[0].value).toBe(0);

            expect(file.enums[0].options[1].name).toBe('SecondValue');
            expect(file.enums[0].options[1].value).toBe(-4);
            expect(file.enums[0].options[1].attributes[0].name).toBe('SomeStuff');
            expect(file.enums[0].options[1].attributes[1].name).toBe('SomeAttribute');

            expect(file.enums[0].options[2].name).toBe('ThirdValue');
            expect(file.enums[0].options[2].value).toBe(-3);
            expect(file.enums[0].options[2].attributes[0].name).toBe('SomeAttribute');

            expect(file.enums[0].options[3].name).toBe('FourthValue');
            expect(file.enums[0].options[3].value).toBe(6);
            expect(file.enums[0].options[3].attributes[0].name).toBe('SomeAttribute');
            expect(file.enums[0].options[3].attributes[1].name).toBe('FooAttribute');
            expect(file.enums[0].options[3].attributes[2].name).toBe('BlahAttribute');

            expect(file.enums[0].options[4].name).toBe('FifthValue');
            expect(file.enums[0].options[4].value).toBe(7);
        }));

	});

    describe("methods:", function () {

        it("should be able to fetch methods inside classes and their parameters", useCSharp('MethodInsideClass.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.classes.length).toBe(1);
            expect(file.classes[0].methods.length).toBe(6);

			expect(file.classes[0].methods[0].attributes.length).toBe(0);
            expect(file.classes[0].methods[0].parameters.length).toBe(0);
			expect(file.classes[0].methods[1].attributes.length).toBe(1);
			expect(file.classes[0].methods[1].parameters.length).toBe(5, "class methods 1 parameters length");
			expect(file.classes[0].methods[1].parameters[2].type.genericParameters.length).toBe(1);
			expect(file.classes[0].methods[1].parameters[2].type.genericParameters[0].genericParameters.length).toBe(2);
			expect(file.classes[0].methods[1].parameters[3].attributes.length).toBe(4);
			expect(file.classes[0].methods[2].parameters.length).toBe(2);
			expect(file.classes[0].methods[2].parameters[0].attributes.length).toBe(1);
			expect(file.classes[0].methods[2].parameters[1].attributes.length).toBe(1);

			expect(file.classes[0].methods[0].returnType.name).toBe('string');
			expect(file.classes[0].methods[0].isVirtual).toBe(true);
            expect(file.classes[0].methods[0].name).toBe('MyFunction');

			expect(file.classes[0].methods[1].returnType.name).toBe('void');
			expect(file.classes[0].methods[1].isVirtual).toBe(false);
            expect(file.classes[0].methods[1].name).toBe('SomeOtherFunction');

            expect(file.classes[0].methods[1].parameters[0].name).toBe('parameter1');
            expect(file.classes[0].methods[1].parameters[0].type.name).toBe('string');
			expect(file.classes[0].methods[1].parameters[0].isVariadicContainer).toBe(false);

            expect(file.classes[0].methods[1].parameters[1].name).toBe('parameter2');
            expect(file.classes[0].methods[1].parameters[1].type.name).toBe('bool');
			expect(file.classes[0].methods[1].parameters[1].defaultValue).toBe(false);

			expect(file.classes[0].methods[1].parameters[2].name).toBe('foo');
			expect(file.classes[0].methods[1].parameters[2].type.name).toBe('List<>');
			expect(file.classes[0].methods[1].parameters[2].type.genericParameters[0].name).toBe('Dictionary<,>');
			expect(file.classes[0].methods[1].parameters[2].type.genericParameters[0].genericParameters[0].name).toBe('string');
			expect(file.classes[0].methods[1].parameters[2].type.genericParameters[0].genericParameters[1].name).toBe('int');
			expect(file.classes[0].methods[1].parameters[2].defaultValue).toBe('bar');

            expect(file.classes[0].methods[1].parameters[3].name).toBe('foo2');
            expect(file.classes[0].methods[1].parameters[3].type.name).toBe('string');
			expect(file.classes[0].methods[1].parameters[3].attributes[0].name).toBe('Hello');
			expect(file.classes[0].methods[1].parameters[3].attributes[1].name).toBe('Blah');
			expect(file.classes[0].methods[1].parameters[3].attributes[2].name).toBe('Foo');
			expect(file.classes[0].methods[1].parameters[3].attributes[3].name).toBe('Bar');

            expect(file.classes[0].methods[1].parameters[4].name).toBe('someArray');
            expect(file.classes[0].methods[1].parameters[4].type.name).toBe('Array<>');
            expect(file.classes[0].methods[1].parameters[4].isVariadicContainer).toBe(true);

            expect(file.classes[0].methods[2].parameters[0].name).toBe('baz');
            expect(file.classes[0].methods[2].parameters[0].type.name).toBe('string');
			expect(file.classes[0].methods[2].parameters[0].attributes[0].name).toBe('Annotation1');

            expect(file.classes[0].methods[2].parameters[1].name).toBe('buz');
            expect(file.classes[0].methods[2].parameters[1].type.name).toBe('int');
			expect(file.classes[0].methods[2].parameters[1].attributes[0].name).toBe('Annotation2');

            var defaultValue = file.classes[0].methods[5].parameters[0].defaultValue as CSharpNamedToken;
            expect(file.classes[0].methods[5].parameters[0].name).toBe('foo');
            expect(file.classes[0].methods[5].parameters[0].type.name).toBe('string');
            expect(defaultValue.name).toBe('null');
        }));

    });

    describe("namespaces:", function () {

        it("should be able to fetch file containing scoped namespaces", useCSharp('NamespacesNested.cs', (parser) => {
            var file = parser.parseFile();

            expect(file.namespaces.length).toBe(2);
            expect(file.namespaces[0].namespaces.length).toBe(1);
            expect(file.namespaces[0].namespaces[0].namespaces.length).toBe(1);

            expect(file.namespaces[0].name).toBe('my');

            expect(file.namespaces[0].namespaces[0].name).toBe('stuff');
            expect(file.namespaces[0].namespaces[0].fullName).toBe('my.stuff');

            expect(file.namespaces[0].namespaces[0].namespaces[0].name).toBe('blah');
            expect(file.namespaces[0].namespaces[0].namespaces[0].fullName).toBe('my.stuff.blah');

            expect(file.namespaces[1].name).toBe('omg');
        }));

    });

    describe("interfaces:", function() {

		it("should be able to fetch interfaces inside namespaces", useCSharp('InterfaceInsideNamespace.cs', (parser) => {
			var file = parser.parseFile();

			expect(file.namespaces.length).toBe(1);
			expect(file.namespaces[0].interfaces.length).toBe(1);
			expect(file.namespaces[0].interfaces[0].properties.length).toBe(2);
			expect(file.namespaces[0].interfaces[0].methods.length).toBe(1);
			expect(file.namespaces[0].interfaces[0].attributes.length).toBe(1);

			expect(file.namespaces[0].interfaces[0].name).toBe("MyPoco");

			expect(file.namespaces[0].interfaces[0].properties[0].name).toBe("Name");
			expect(file.namespaces[0].interfaces[0].properties[0].type.name).toBe("Array<>");
			expect(file.namespaces[0].interfaces[0].properties[0].type.genericParameters[0].name).toBe("string");

            expect(file.namespaces[0].interfaces[0].properties[1].name).toBe("EscapedName");
            expect(file.namespaces[0].interfaces[0].properties[1].type.name).toBe("bool");

			expect(file.namespaces[0].interfaces[0].methods[0].name).toBe("SomeMethod");
			expect(file.namespaces[0].interfaces[0].methods[0].returnType.name).toBe("Int32");
			expect(file.namespaces[0].interfaces[0].methods[0].returnType.fullName).toBe("System.Int32");
		}));

    });

    describe("structs:", function () {

        it("should be able to detect structs", useCSharp('Struct.cs', (parser) => {
            var file = parser.parseFile();

			expect(file.structs.length).toBe(1);
			expect(file.structs[0].attributes.length).toBe(1);

			expect(file.structs[0].isPublic).toBe(true);
			expect(file.structs[0].name).toBe("MyStruct");
		}));

    });

    describe("statics:", function () {

        it("should be able to detect statics", useCSharp('Static.cs', (parser) => {
            var file = parser.parseFile();

			expect(file.classes[0].isPublic).toBe(true);
			expect(file.classes[0].isStatic).toBe(true);
			expect(file.classes[0].properties[0].isStatic).toBe(true);
			expect(file.classes[0].fields[0].isPublic).toBe(false);
			expect(file.classes[0].fields[0].isStatic).toBe(true);
			expect(file.classes[0].fields[1].isPublic).toBe(true);
			expect(file.classes[0].fields[1].isStatic).toBe(false);
            expect(file.classes[0].methods[0].isStatic).toBe(true);
            expect(file.classes[0].constructors[0].isPublic).toBe(true);
            expect(file.classes[0].constructors[0].isStatic).toBe(true);
            expect(file.classes[0].constructors[0].parameters[0].name).toBe("str");
            expect(file.classes[0].constructors[0].parameters[0].type.name).toBe("string");
		}));

    });

});
