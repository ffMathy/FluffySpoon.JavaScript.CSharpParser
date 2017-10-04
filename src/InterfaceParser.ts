import {
	CSharpInterface,
    CSharpType
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { MethodParser } from './MethodParser';
import { PropertyParser } from './PropertyParser';

export class InterfaceParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();
    private methodParser = new MethodParser();
    private propertyParser = new PropertyParser();

    constructor() {

    }

    parseInterfaces(content: string) {
        var interfaces = new Array<CSharpInterface>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix,
                /interface\s+(\w+?)\s*(?:\:\s*(\w+?)\s*)?{/g);
            for (var match of matches) {
				var interfaceObject = new CSharpInterface(match[0]);
				interfaceObject.innerScopeText = scope.content;

				if (match[1]) {
					interfaceObject.inheritsFrom = new CSharpType(match[1]);
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