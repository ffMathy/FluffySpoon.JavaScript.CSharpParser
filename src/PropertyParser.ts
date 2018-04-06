import {
	CSharpProperty,
	CSharpPropertyComponent,
	CSharpType
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { TypeParser } from './TypeParser';
import { AttributeParser } from './AttributeParser';

export class PropertyParser {
	private scopeHelper = new ScopeHelper();
	private regexHelper = new RegExHelper();

	private typeParser = new TypeParser();
	private attributeParser = new AttributeParser();

	constructor() {

	}

	parseProperties(content: string) {
		var properties = new Array<CSharpProperty>();
		var scopes = this.scopeHelper.getCurlyScopes(content);

		for (var scope of scopes) {
			var matchCandidate = scope.prefix;
			var matches = this.regexHelper.getMatches(
				matchCandidate,
				new RegExp(this.regexHelper.getPropertyRegex(false, true, true, true, true), "g"));

			for (var match of matches) {
				var attributes = match[0];
				var modifiers = match[1] || "";
				var type = match[2];
				var name = match[3];

				var property = new CSharpProperty(name);
				property.attributes = this.attributeParser.parseAttributes(attributes);
				property.type = this.typeParser.parseType(type);

				property.isVirtual = modifiers.indexOf("virtual") > -1;
				property.isPublic = modifiers.indexOf("public") > -1;

				var subScopes = this.scopeHelper.getCurlyScopes(scope.content);
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

				if(property.components.length === 0 || property.components.length > 2)
					continue;

				properties.push(property);
			}
		}

		return properties;
	}
}