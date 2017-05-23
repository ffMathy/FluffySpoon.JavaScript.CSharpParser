import {
	CSharpType
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';

export class TypeParser {
	private scopeHelper = new ScopeHelper();
	private regexHelper = new RegExHelper();

	constructor() {

	}

	parseTypesFromGenericParameters(content: string): CSharpType[] {
		var result = new Array<CSharpType>();
		var scope = this.scopeHelper.getGenericTypeScopes(match[1])[0];
	}

	parseType(typeString: string): CSharpType {
		var matches = this.regexHelper.getMatches(
			typeString,
			/(\w+(?:\s*<\s*(.+)\s*>)?)/g);
		var match = matches[0];
		if (!match)
			return null;

		var type = <CSharpType>{
			name: match[0]
		};

		if (match[1]) {
			type.genericParameters = [];

			var scope = this.scopeHelper.getGenericTypeScopes(match[1])[0];
			type.name = scope
				.prefix
				.substr(0, scope.prefix.length - 1)
				.trim();
            
			//type.genericParameters.push(
			//	this.parseType(scope.content));
		}

		return type;
	}
}