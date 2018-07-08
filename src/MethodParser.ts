import {
	CSharpMethod,
    CSharpClass,
	CSharpType,
	CSharpMethodParameter,
	CSharpToken,
	CSharpNamedToken,
    CSharpStruct,
	CSharpInterface
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { TypeParser } from './TypeParser';
import { AttributeParser } from './AttributeParser';
import { LiteralParser } from './LiteralParser';

export class MethodParser {
	private scopeHelper = new ScopeHelper();
	private regexHelper = new RegExHelper();

	private attributeParser = new AttributeParser();
	private literalParser = new LiteralParser();

	constructor(
		private typeParser: TypeParser) {

	}

    parseMethods(content: string, parent: CSharpClass | CSharpInterface | CSharpMethod | CSharpStruct) {
		var methods = new Array<CSharpMethod>();
		var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
			var statements = this.scopeHelper.getStatements(scope.prefix);
			for(var statement of statements) {
				var matches = this.regexHelper.getMatches(
					statement,
					new RegExp("^" + this.regexHelper.getMethodRegex(false, true, true, true, true, true, true, true) + "$", "g"));
				for (var match of matches) {
					try {
						var attributes = match[0];
						var modifiers = match[1] || "";
						var returnType = match[2];
						var name = match[3];
						var genericParameters = match[4];
						var parameters = match[5];
						var openingType = match[6];

						var method = new CSharpMethod(name);
						method.attributes = this.attributeParser.parseAttributes(attributes);
						method.genericParameters = this.typeParser.parseTypesFromGenericParameters(genericParameters);
						method.returnType = this.typeParser.parseType(returnType);
						method.parameters = this.parseMethodParameters(parameters);

						method.innerScopeText = scope.content;
						method.parent = parent;

						if (parent instanceof CSharpClass && parent.name === method.name) {
							method.isConstructor = true;
							method.isVirtual = false;
						} else {
							method.isVirtual = modifiers.indexOf("virtual") > -1;
							method.isConstructor = false;
						}

						method.isPublic = modifiers.indexOf("public") > -1;
						method.isStatic = modifiers.indexOf("static") > -1;
						method.isBodyless = openingType === ";";

						methods.push(method);
                    } catch(ex) {
                        console.error("Skipping method due to parsing error.", statement, ex);
						debugger;
                    }
				}
			}
		}

		return methods;
	}

	parseMethodParameters(content: string): CSharpMethodParameter[] {
		var result = new Array<CSharpMethodParameter>();

		var attributeSplits = this.scopeHelper.getScopedList(",", content);
		for(var attributeSplit of attributeSplits) {
			var matches = this.regexHelper.getMatches(
				attributeSplit,
				new RegExp("^" + this.regexHelper.getMethodParameterRegex(false, true, true, true, true, true) + "$", "g"));
			if(matches.length > 1) {
				throw new Error("Method parameter split failed.");
			}

			try {
				result.push(this.parseMethodParameter(matches[0]));
			} catch(ex) {
				console.error("Skipping method parameter due to parsing error.", matches[0], ex);
				debugger;
			}
		}

		return result;
	}

	private parseMethodParameter(match: string[]) {
		return <CSharpMethodParameter>{
			type: this.typeParser.parseType(match[2]),
			name: match[3],
			isVariadicContainer: !!match[1],
			attributes: this.attributeParser.parseAttributes(match[0]),
			defaultValue: this.literalParser.parseLiteral(match[4])
		}
	}
}
