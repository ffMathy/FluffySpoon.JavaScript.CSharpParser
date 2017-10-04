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

	private getTypeNameFromGenericScopePrefix(prefix: string) {
		if (!prefix)
			return null;

		var result = prefix;
		if (result.lastIndexOf("<") > -1) {
			result = result.substr(0, result.length - 1);
		}
	    result = result.trim();
		if (result.indexOf(",") == 0) {
			result = result
				.substr(1)
				.trim();
		}
        
		return result;
	}

	private prepareTypeForGenericParameters(type: CSharpType, content: string) {
		if (!content)
			return;

		type.genericParameters = this.parseTypesFromGenericParameters(content);
		if (type.genericParameters) {
			type.name += "<";
			for (var i = 1; i < type.genericParameters.length; i++) {
				type.name += ",";
			}
			type.name += ">";
		}
	}

	parseTypesFromGenericParameters(content: string): CSharpType[] {
		var result = new Array<CSharpType>();
		if (!content)
			return null;

		var scopes = this.scopeHelper.getGenericTypeScopes(content);
		for (var scope of scopes) {
			if (scope.prefix.trim() === ",")
				continue;

			var typeRegions = scope.prefix.split(",");
			for (var typeRegion of typeRegions) {
				var type = <CSharpType>{};
				type.name = this.getTypeNameFromGenericScopePrefix(typeRegion);

				if (!type.name)
					continue;

				this.prepareTypeForGenericParameters(
					type,
					scope.content);

				result.push(type);
			}
		}

		return result.length === 0 ? null : result;
	}

	parseType(typeString: string): CSharpType {
		var matches = this.regexHelper.getMatches(
			typeString,
			/(\w+)(?:\s*<\s*(.+)\s*>)?(\?)?/g);
		var match = matches[0];
		if (!match)
			return null;

		var isOptional = !!match[2];
		var type = <CSharpType>{
			name: match[0] + (isOptional ? "?" : ""),
			isOptional
		};

		this.prepareTypeForGenericParameters(
			type,
			match[1]);

		console.log("Detected type", type);

		return type;
	}
}