import {
	CSharpProperty,
	CSharpPropertyComponent,
	CSharpType
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { TypeParser } from './TypeParser';

export class PropertyParser {
	private scopeHelper = new ScopeHelper();
	private regexHelper = new RegExHelper();
	private typeParser = new TypeParser();

	constructor() {

	}

	parseProperties(content: string) {
		var properties = new Array<CSharpProperty>();
		var scopes = this.scopeHelper.getCurlyScopes(content);

		for (var scope of scopes) {
			var subScopes = this.scopeHelper
				.getCurlyScopes(scope.content);
			var subScopeContent = subScopes
				.map(x => x.prefix)
				.join('');

			var matchCandidate = scope.prefix + subScopeContent;
			var matches = this.regexHelper.getMatches(
				matchCandidate,
				/((?:\w+\s)*)([^\s]+?(?:<.+>)?)\s+(\w+?)\s*{\s*(?:(?:\w+\s*)?(?:get|set){1}\s*(?:;|\{)\s*){1,2}/g);
			for (var match of matches) {
				var property = new CSharpProperty(match[2]);
				property.type = this.typeParser.parseType(match[1]);

				var modifiers = match[0] || "";
				property.isVirtual = modifiers.indexOf("virtual") > -1;
				property.isPublic = modifiers.indexOf("public") > -1;

				for (var subScope of subScopes) {
					var componentTypeMatches = this.regexHelper.getMatches(
						subScope.prefix,
						/(get|set)\s*[{;]/g);
					for (var componentTypeMatch of componentTypeMatches) {
						var component = new CSharpPropertyComponent();
						component.type = <"get"|"set">componentTypeMatch[0];

						property.components.push(component);
					}
				}

				properties.push(property);
			}

		}

		return properties;
	}
}