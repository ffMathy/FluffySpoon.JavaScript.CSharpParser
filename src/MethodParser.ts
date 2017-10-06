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

export class MethodParser {
	private scopeHelper = new ScopeHelper();
	private regexHelper = new RegExHelper();

	private attributeParser = new AttributeParser();

	constructor(
		private typeParser: TypeParser) {

	}

    parseMethods(content: string, parent: CSharpClass | CSharpInterface | CSharpMethod | CSharpStruct) {
		var methods = new Array<CSharpMethod>();
		var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
			var matches = this.regexHelper.getMatches(
				scope.prefix,
				/\s*((?:\[.*\]\s*?)*)?\s*((?:\w+\s)*)((?:[\w.]+\s*<\s*.+\s*>)|[\w.]+)\s+(\w+?)\s*\(((?:.|\s)*?)\)\s*({|;)/g);
			for (var match of matches) {
				var method = new CSharpMethod(match[3]);
            	method.attributes = this.attributeParser.parseAttributes(match[0]);
				method.innerScopeText = scope.content;
				method.parent = parent;

				method.returnType = this.typeParser.parseType(match[2] || "void");

				var modifiers = match[1] || "";
				if (parent instanceof CSharpClass && parent.name === method.name) {
					method.isConstructor = true;
					method.isVirtual = false;

					modifiers = match[2];
				} else {
					method.isVirtual = modifiers.indexOf("virtual") > -1;
					method.isConstructor = false;
				}

				method.isPublic = modifiers.indexOf("public") > -1;
				method.isBodyless = match[5] === ";";

				var parameters = this.parseMethodParameters(match[4]);
				for (var parameter of parameters) {
					method.parameters.push(parameter);
				}

				var subMethods = this.parseMethods(scope.content, method);
				for (var subMethod of subMethods) {
					subMethod.parent = method;
					method.methods.push(subMethod);
				}

				methods.push(method);

				console.log("Detected method", method);
			}
		}

		return methods;
	}

	parseMethodParameters(content: string): CSharpMethodParameter[] {
		var result = new Array<CSharpMethodParameter>();

		var matches = this.regexHelper.getMatches(
			content,
			/((?:\w+\s*<\s*.+\s*>)|(?:\w+))\s+(\w+)(?:\s*=\s*(.+?))?\s*(?:,|$)/g);
		for (var match of matches) {
			result.push(this.parseMethodParameter(match));
		}

		return result;
	}

	private parseMethodParameter(match: string[]) {
		var valueInput = match[2];

		var defaultValue = <CSharpToken>null;
		if (valueInput) {
			if ((valueInput.charAt(0) === "\"" || valueInput.charAt(0) === "'") && valueInput.charAt(valueInput.length - 1) === valueInput.charAt(0)) {
				defaultValue = valueInput.substr(1, valueInput.length - 2);
			} else if (!isNaN(parseFloat(valueInput))) {
				defaultValue = parseFloat(valueInput);
			} else if (valueInput === "false" || valueInput === "true") {
				defaultValue = valueInput === "true";
			} else {
				defaultValue = <CSharpNamedToken>{
					name: valueInput
				};
			}
		}

		return <CSharpMethodParameter>{
			type: this.typeParser.parseType(match[0]),
			name: match[1],
			defaultValue
		}
	}
}