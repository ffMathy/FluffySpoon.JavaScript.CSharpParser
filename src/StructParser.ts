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
            var statements = this.scopeHelper.getStatements(scope.prefix);
            for(var statement of statements) {
                var matches = this.regexHelper.getMatches(
                    statement,
                    new RegExp("^" + this.regexHelper.getStructRegex() + "$", "g"));
                for (var match of matches) {
                    try {
                        var attributes = match[0];
                        var modifiers = match[1] || "";
                        var name = match[2];
                        var genericParameters = match[3];

                        var struct = new CSharpStruct(name);
                        struct.attributes = this.attributeParser.parseAttributes(attributes);
                        struct.genericParameters = this.typeParser.parseTypesFromGenericParameters(genericParameters);
                        struct.innerScopeText = scope.content;
                        struct.isPublic = modifiers.indexOf("public") > -1;

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
                    } catch(ex) {
                        console.error("Skipping struct due to parsing error.", statement, ex);
                    }
                }
            }
        }

        return structs;
    }
}
