import {
    CSharpAttribute, CSharpAttributeParameter
} from './Models';

import { RegExHelper } from './RegExHelper';
import { LiteralParser } from './LiteralParser';
import { ScopeHelper } from './Index';

export class AttributeParser {
    private regexHelper = new RegExHelper();
    private scopeHelper = new ScopeHelper();

    private literalParser = new LiteralParser();

    constructor() {

    }

    parseAttributes(content: string) {
        var attributes = new Array<CSharpAttribute>();
        if(!content)
            return attributes;

        var attributeSplits = this.scopeHelper.getScopedList("", content);
        for(var attributeSplit of attributeSplits) {
            var attributeSplitContents = attributeSplit.substr(1, attributeSplit.length-2);
            var innerAttributeSplits = this.scopeHelper.getScopedList(",", attributeSplitContents);
            for(var innerAttributeSplit of innerAttributeSplits) {
                var matches = this.regexHelper.getMatches(
                    innerAttributeSplit,
                    new RegExp("^" + this.regexHelper.getAttributeRegex(false, true, true) + "$", "g"));
                for (var match of matches) {
                    var name = match[0];
                    var parameters = match[1];

                    var attribute = new CSharpAttribute(name);
                    attribute.parameters = this.parseAttributeParameters(parameters);

                    attributes.push(attribute);
                }
            }
        }

        return attributes;
    }

    parseAttributeParameters(content: string) {
        var result = new Array<CSharpAttributeParameter>();
        
		var matches = this.regexHelper.getMatches(
			content,
			new RegExp(this.regexHelper.getAttributeParameterRegex(false, true, true), "g"));
		for (var match of matches) {
            var parameter = new CSharpAttributeParameter();
            parameter.name = match[0] || null;
            parameter.value = this.literalParser.parseLiteral(match[1]);

			result.push(parameter);
		}

		return result;
    }
}