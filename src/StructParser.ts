import {
    CSharpNamespace,
	CSharpClass,
	CSharpType,
	CSharpStruct
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { MethodParser } from './MethodParser';
import { EnumParser } from './EnumParser';
import { PropertyParser } from './PropertyParser';
import { FieldParser } from './FieldParser';

export class StructParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();
    private methodParser = new MethodParser();
    private propertyParser = new PropertyParser();
	private fieldParser = new FieldParser();

    constructor() {

    }

    parseStructs(content: string) {
        var structs = new Array<CSharpStruct>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix,
                /struct\s+(\w+?)\s*(?:\:\s*(\w+?)\s*)?{/g);
            for (var match of matches) {
				var struct = new CSharpStruct(match[0]);
				struct.innerScopeText = scope.content;

				var fields = this.fieldParser.parseFields(scope.content);
				for (var field of fields) {
					field.parent = struct;
					struct.fields.push(field);
				}

                var properties = this.propertyParser.parseProperties(scope.content);
                for (var property of properties) {
                    property.parent = struct;
                    struct.properties.push(property);
                }

                var methods = this.methodParser.parseMethods(scope.content, struct);
                for (var method of methods) {
                    method.parent = struct;
                    struct.methods.push(method);
                }

				structs.push(struct);

				console.log("Detected struct", struct);
            }
        }

        return structs;
    }
}