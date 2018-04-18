import {
    CSharpEnum,
    CSharpEnumOption
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { AttributeParser } from './AttributeParser';
import { TypeParser } from './TypeParser';

export class EnumParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();
    private attributeParser = new AttributeParser();

    constructor(
        private typeParser: TypeParser) {

    }

    parseEnums(content: string) {
        var enums = new Array<CSharpEnum>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
            var statements = this.scopeHelper.getStatements(scope.prefix);
            for(var statement of statements) {
                var matches = this.regexHelper.getMatches(
                    statement,
                    new RegExp("^" + this.regexHelper.getEnumRegex(false, true, true, true, true) + "$", "g"));
                for (var match of matches) {
                    try {
                        var attributes = match[0];
                        var modifiers = match[1] || "";
                        var name = match[2];
                        var inheritance = match[3];

                        var enumObject = new CSharpEnum(name);
                        enumObject.isPublic = modifiers.indexOf("public") > -1;
                        enumObject.attributes = this.attributeParser.parseAttributes(attributes);
                        enumObject.options = this.parseEnumOptions(scope.content);
                        enumObject.inheritsFrom = this.typeParser.parseType(inheritance);

                        enums.push(enumObject);
                    } catch(ex) {
                        console.error("Skipping enum due to parsing error.", statement, ex);
						debugger;
                    }
                }
            }
        }

        return enums;
    }

    parseEnumOptions(content: string) {
        var result = new Array<CSharpEnumOption>();

        var nextValue = 0;
        var optionSplits = this.scopeHelper.getScopedList(",", content);
        for(var optionSplit of optionSplits) {
            var matches = this.regexHelper.getMatches(
                optionSplit,
                new RegExp("^" + this.regexHelper.getEnumOptionRegex(false, true, true, true) + "$", "g"));
            
            for (var match of matches) {
                var attributes = match[0];
                var name = match[1];
                var value = match[2];

                var option = new CSharpEnumOption(name);
                option.attributes = this.attributeParser.parseAttributes(attributes);

                if (value) {
                    option.value = parseInt(value);
                    nextValue = option.value + 1;
                } else {
                    option.value = nextValue;
                    nextValue++;
                }

                result.push(option);
            }
        }

        return result;
    }
}