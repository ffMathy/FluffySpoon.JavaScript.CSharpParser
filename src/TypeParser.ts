import {
	CSharpType
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { NamespaceParser } from './NamespaceParser';

export class TypeParser {
	private scopeHelper = new ScopeHelper();
	private regexHelper = new RegExHelper();

	constructor() {

	}

	private getTypeNameFromGenericScopePrefix(prefix: string) {
		if (!prefix)
			return null;

		var result = prefix.trim();
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
		if (type.isGeneric) {
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
			return result;
			
		var scopes = this.scopeHelper.getGenericTypeScopes(content);
		for (var scope of scopes) {
			var trimmedPrefix = scope.prefix.trim();
			if (trimmedPrefix === ",")
				continue;

			var typeRegions = trimmedPrefix.split(",");
			for (var typeRegion of typeRegions) {
				var type = new CSharpType(this.getTypeNameFromGenericScopePrefix(typeRegion));

				var arrowTrimmedName = type.name
					.replace(/</g, "")
					.replace(/>/g, "")
					.trim();
				if (!arrowTrimmedName)
					continue;

				this.prepareTypeForGenericParameters(
					type,
					scope.content);

				result.push(type);
			}
		}

		return result;
	}

	parseType(typeString: string): CSharpType {
		if(!typeString) 
			return null;

		var matches = this.regexHelper.getMatches(
			typeString,
			new RegExp(this.regexHelper.getGenericTypeNameRegex(false, true, true, true), "g"));
		var match = matches[0];
		if (!match)
			return null;

		var isNullable = match[2] === "?";
		var isArray = match[2] === "[]";

		var genericParameters = match[1];

		var name = match[0];
		if(isArray) {
			genericParameters = name + (genericParameters ? "<" + genericParameters + ">" : "");
			name = "Array";
		}

		var subNames = name.split(".");

		var type = new CSharpType(subNames[subNames.length-1]);
		type.isNullable = isNullable;
		type.namespace = NamespaceParser
			.parseNamespaceFromName(subNames
			.slice(0, subNames.length-1)
			.join("."));

		this.prepareTypeForGenericParameters(
			type,
			genericParameters);

		return type;
	}
}
