import {
	CSharpMethod,
	CSharpType,
	CSharpMethodParameter
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
				/((?:\w+\s*<\s*.+\s*>)|\w+)\s+(\w+?)\s*\((.*?)\)\s*{/g);
			for (var match of matches) {
                var method = new CSharpMethod(match[1]);
				method.innerScopeText = scope.content;

				method.returnType = this.typeParser.parseType(match[0] || "void");
				method.isExplicitImplementation = method.name.indexOf('.') > -1;

				var parameters = this.parseMethodParameters(match[2]);
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

	public parseMethodParameters(content: string): CSharpMethodParameter[] {
		var result = new Array<CSharpMethodParameter>();

		var matches = this.regexHelper.getMatches(
			content,
			/((?:\w+\s*<\s*.+\s*>)|\w+)\s+(\w+)(?:\s*=\s*(.+?))?\s*(?:,|$)/g);
		for (var match of matches) {
			result.push({
				type: this.typeParser.parseType(match[0]),
				name: match[1],
				defaultValue: match[2]
			});
		}

		return result;
	}
}