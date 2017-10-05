import {
	CSharpInterface,
    CSharpType
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { MethodParser } from './MethodParser';
import { PropertyParser } from './PropertyParser';
import { TypeParser } from './TypeParser';

export class InterfaceParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();
    private propertyParser = new PropertyParser();
    
    private methodParser: MethodParser;

    constructor(
        private typeParser: TypeParser) {

        this.methodParser = new MethodParser(typeParser);
    }

    parseInterfaces(content: string) {
        var interfaces = new Array<CSharpInterface>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix,
                /interface\s+(\w+?)\s*(?:<\s*(.+)\s*>)?\s*(?:\:\s*(\w+?\s*(?:<\s*(.+)\s*>)?))?\s*{/g);
            for (var match of matches) {
				var interfaceObject = new CSharpInterface(match[0]);
				interfaceObject.innerScopeText = scope.content;
                interfaceObject.genericParameters = this.typeParser.parseTypesFromGenericParameters(match[1]);

				if (match[2]) {
					interfaceObject.inheritsFrom = this.typeParser.parseType(match[2]);
				}

                var properties = this.propertyParser.parseProperties(scope.content);
                for (var property of properties) {
                    property.parent = interfaceObject;
                    interfaceObject.properties.push(property);
                }

                var methods = this.methodParser.parseMethods(scope.content, interfaceObject);
                for (var method of methods) {
                    method.parent = interfaceObject;
                    interfaceObject.methods.push(method);
                }

				interfaces.push(interfaceObject);

				console.log("Detected interface", interfaceObject);
            }
        }

        return interfaces;
    }
}