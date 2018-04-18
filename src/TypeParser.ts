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
			
		var typeRegions = this.scopeHelper.getScopedList(",", content);
		for (var typeRegion of typeRegions) {
			var scope = this.scopeHelper.getGenericTypeScopes(typeRegion).pop();

			var type = new CSharpType(this.getTypeNameFromGenericScopePrefix(scope.prefix));
			var arrowTrimmedName = type.name
				.replace(/</g, "")
				.replace(/>/g, "")
				.trim();
			if (!arrowTrimmedName)
				continue;

			if(scope.content) {
				this.prepareTypeForGenericParameters(
					type,
					scope.content);
			}

			result.push(type);
		}

		return result;
	}

	parseType(typeString: string): CSharpType {
		if(!typeString) 
			return null;

		const regex = this.regexHelper.getGenericTypeNameRegex(false, true, true, true, true);
		var matches = this.regexHelper.getMatches(
			typeString,
			new RegExp("^" + regex + "$", "g"));

		var match = matches[0];
		if (!match)
			return null;

		var name = match[0];
		var genericParameters = match[1];
		var tupleContent = match[2];
		var suffix = match[3];

		if(tupleContent) {
			name = "System.ValueTuple";
			genericParameters = this.prepareGenericParametersStringFromTupleContent(tupleContent);
		}

		var isNullable = suffix === "?";
		var isArray = suffix === "[]";

		if(isArray) {
			genericParameters = name + (genericParameters ? "<" + genericParameters + ">" : "");
			name = "System.Array";
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

	private prepareGenericParametersStringFromTupleContent(content: string) {
		var scopes = this.scopeHelper.getScopedList(",", content);
		return scopes
			.map(x => {
				var regions = this.scopeHelper
					.getScopedList(" ", x)
					.filter(x => !!x);
				return regions[0];
			})
			.join(", ");
	}
}
