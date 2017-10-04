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

export class ClassParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();
    private methodParser = new MethodParser();
    private enumParser = new EnumParser();
    private propertyParser = new PropertyParser();
	private fieldParser = new FieldParser();
	private interfaceParser = new InterfaceParser();
    private typeParser = new TypeParser();

    constructor() {

    }

    parseClasses(content: string) {
        var classes = new Array<CSharpClass>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix,
                /class\s+(\w+?)\s*(?:<\s*(.+)\s*>)?(?:\:\s*(\w+?)\s*)?\s*{/g);
            for (var match of matches) {
				var classObject = new CSharpClass(match[0]);
				classObject.innerScopeText = scope.content;
                classObject.genericParameters = this.typeParser.parseTypesFromGenericParameters(match[1]);

				if (match[2]) {
					classObject.inheritsFrom = new CSharpType(match[2]);
				}

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

				classes.push(classObject);

				console.log("Detected class", classObject);
            }
        }

        return classes;
    }
}