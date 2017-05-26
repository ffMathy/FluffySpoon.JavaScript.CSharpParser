import {
	CSharpMethod,
	CSharpType,
	CSharpMethodParameter,
	CSharpToken,
	CSharpNamedToken
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { TypeParser } from './TypeParser';

export class MethodParser {
	private scopeHelper = new ScopeHelper();
	private regexHelper = new RegExHelper();
	private typeParser = new TypeParser();

	constructor() {

	}

	parseMethods(content: string) {
		var methods = new Array<CSharpMethod>();
		var scopes = this.scopeHelper.getCurlyScopes(content);
		for (var scope of scopes) {
			var matches = this.regexHelper.getMatches(
				scope.prefix,
				/((?:\w+\s)*)((?:\w+\s*<\s*.+\s*>)|\w+)\s+(\w+?)\s*\((.*?)\)\s*{/g);
			for (var match of matches) {
				var method = new CSharpMethod(match[2]);
				method.innerScopeText = scope.content;

				method.returnType = this.typeParser.parseType(match[1] || "void");

				var modifiers = match[0];
				method.isVirtual = modifiers && modifiers.indexOf("virtual") > -1;

				var parameters = this.parseMethodParameters(match[3]);
				for (var parameter of parameters) {
					method.parameters.push(parameter);
				}

				var subMethods = this.parseMethods(scope.content);
				for (var subMethod of subMethods) {
					subMethod.parent = method;
					method.methods.push(subMethod);
				}

				methods.push(method);

				console.log("Detected method " + method.name);
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