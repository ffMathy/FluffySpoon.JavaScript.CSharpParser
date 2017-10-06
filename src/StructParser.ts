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
import { TypeParser } from './TypeParser';
import { AttributeParser } from './AttributeParser';

export class StructParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();

    private propertyParser = new PropertyParser();
    private attributeParser = new AttributeParser();

    private methodParser: MethodParser;
	private fieldParser: FieldParser;

    constructor(
        private typeParser: TypeParser) {

        this.methodParser = new MethodParser(typeParser);
        this.fieldParser = new FieldParser(typeParser);
    }

    parseStructs(content: string) {
        var structs = new Array<CSharpStruct>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix,
                /\s*((?:\[.*\]\s*?)*)?\s*((?:\w+\s)*)struct\s+(\w+?)\s*(?:\:\s*(\w+?)\s*)?{/g);
            for (var match of matches) {
				var struct = new CSharpStruct(match[2]);
                struct.attributes = this.attributeParser.parseAttributes(match[0]);
				struct.innerScopeText = scope.content;
				struct.isPublic = (match[1] || "").indexOf("public") > -1;

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