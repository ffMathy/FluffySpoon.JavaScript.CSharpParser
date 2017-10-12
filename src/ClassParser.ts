import {
    CSharpNamespace,
	CSharpClass,
    CSharpType
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { MethodParser } from './MethodParser';
import { EnumParser } from './EnumParser';
import { PropertyParser } from './PropertyParser';
import { FieldParser } from './FieldParser';
import { InterfaceParser } from './InterfaceParser';
import { TypeParser } from './TypeParser';
import { AttributeParser } from './AttributeParser';

export class ClassParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();

    private propertyParser = new PropertyParser();
    private attributeParser = new AttributeParser();

    private methodParser: MethodParser;
	private interfaceParser: InterfaceParser;

    constructor(
        private typeParser: TypeParser,
        private enumParser: EnumParser,
        private fieldParser: FieldParser) {

        this.interfaceParser = new InterfaceParser(typeParser);
        this.methodParser = new MethodParser(typeParser);
    }

    parseClasses(content: string) {
        var classes = new Array<CSharpClass>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix,
                /\s*((?:\[.*\]\s*?)*)?\s*((?:\w+\s)*)class\s+(\w+?)(?:\s*<\s*([<>.\w,\s]+)\s*>)?\s*(?:\:\s*(\w+?(?:\s*<\s*(([<>.\w,\s]+)+)\s*>)?))?(?:\s*where\s*(\w+?)\s*(?:<\s*(([<>.\w,\s]+)+)\s*>)?\s*\:\s*([\w()]+?(?:\s*<\s*(([<>.\w,\s]+)+)\s*>)?))?\s*{/g);
            for (var match of matches) {
				var classObject = new CSharpClass(match[2]);
				classObject.isPublic = (match[1] || "").indexOf("public") > -1;
                classObject.attributes = this.attributeParser.parseAttributes(match[0]);
				classObject.innerScopeText = scope.content;
                classObject.genericParameters = this.typeParser.parseTypesFromGenericParameters(match[3]);
                classObject.inheritsFrom = this.typeParser.parseType(match[4]);

				var fields = this.fieldParser.parseFields(scope.content);
				for (var field of fields) {
					field.parent = classObject;
					classObject.fields.push(field);
				}

                var properties = this.propertyParser.parseProperties(scope.content);
                for (var property of properties) {
                    property.parent = classObject;
                    classObject.properties.push(property);
                }

                var enums = this.enumParser.parseEnums(scope.content);
                for (var enumObject of enums) {
                    enumObject.parent = classObject;
                    classObject.enums.push(enumObject);
                }

                var methods = this.methodParser.parseMethods(scope.content, classObject);
                for (var method of methods) {
                    method.parent = classObject;
                    classObject.methods.push(method);
                }

                var subClasses = this.parseClasses(scope.content);
                for (var subClass of subClasses) {
                    subClass.parent = classObject;
                    classObject.classes.push(subClass);
                }

                var interfaces = this.interfaceParser.parseInterfaces(scope.content);
                for (var interfaceObject of interfaces) {
                    classObject.interfaces.push(interfaceObject);
                }

                classObject.constructors = classObject
                    .methods
                    .filter(x => x.isConstructor);

                classObject.methods = classObject
                    .methods
                    .filter(x => !x.isConstructor);

				classes.push(classObject);

				console.log("Detected class", classObject);
            }
        }

        return classes;
    }
}