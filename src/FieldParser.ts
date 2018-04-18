import {
    CSharpField,
    CSharpType
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { TypeParser } from './TypeParser';
import { AttributeParser } from './AttributeParser';

export class FieldParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();
    
    private attributeParser = new AttributeParser();

    constructor(
        private typeParser: TypeParser) {

    }

    parseFields(content: string) {
		var fields = new Array<CSharpField>();
		var scopes = this.scopeHelper.getCurlyScopes(content);
        
		for (var scope of scopes) {
            var statements = this.scopeHelper.getStatements(scope.prefix);
            for(var statement of statements) {
                var matches = this.regexHelper.getMatches(
                    statement,
                    new RegExp("^" + this.regexHelper.getFieldRegex(false, true, true, true, true) + "$", "g"));
                for (var match of matches) {
                    try {
                        var attributes = match[0];
                        var modifiers = match[1] || "";
                        var returnType = match[2];
                        var name = match[3];

                        var field = new CSharpField(name);
                        field.attributes = this.attributeParser.parseAttributes(attributes);
                        field.type = this.typeParser.parseType(returnType);

                        field.isPublic = modifiers.indexOf("public") > -1;
                        field.isReadOnly = modifiers.indexOf("readonly") > -1;

                        fields.push(field);
                    } catch(ex) {
                        console.error("Skipping field due to parsing error.", statement, ex);
						debugger;
                    }
                }
            }

        }

        return fields;
    }
}
