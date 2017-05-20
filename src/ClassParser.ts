import {
    CSharpNamespace,
    CSharpClass
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { MethodParser } from './MethodParser';
import { EnumParser } from './EnumParser';
import { PropertyParser } from './PropertyParser';

export class ClassParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();
    private methodParser = new MethodParser();
    private enumParser = new EnumParser();
    private propertyParser = new PropertyParser();

    constructor() {

    }

    public parseClasses(content: string) {
        var classes = new Array<CSharpClass>();
        var scopes = this.scopeHelper.getScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix,
                /class\s+(\w+?)\s*{/g);
            for (var match of matches) {
                var classObject = new CSharpClass(match[0]);
                classObject.innerScopeText = scope.content;

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

                var methods = this.methodParser.parseMethods(scope.content);
                for (var method of methods) {
                    method.parent = classObject;
                    classObject.methods.push(method);
                }

                var subClasses = this.parseClasses(scope.content);
                for (var subClass of subClasses) {
                    subClass.parent = classObject;
                    classObject.classes.push(subClass);
                }

				classes.push(classObject);

				console.log("Detected class", classObject.name);
            }
        }

        return classes;
    }
}