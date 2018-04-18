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
			var statements = this.scopeHelper.getStatements(scope.prefix);
			for(var statement of statements) {
				if(statement.indexOf('=>') > -1)
					statement = statement.substr(0, statement.indexOf('=>') + 2);

				var matches = this.regexHelper.getMatches(
					statement,
					new RegExp("^" + this.regexHelper.getPropertyRegex(false, true, true, true, true, true) + "$", "g"));
				for (var match of matches) {
					try {
						var attributes = match[0];
						var modifiers = match[1] || "";
						var type = match[2];
						var name = match[3];
						var openingType = match[4];

						var property = new CSharpProperty(name);
						property.attributes = this.attributeParser.parseAttributes(attributes);
						property.type = this.typeParser.parseType(type);

						property.isVirtual = modifiers.indexOf("virtual") > -1;
						property.isPublic = modifiers.indexOf("public") > -1;

						if(openingType === "{") {
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
						} else if(openingType === "=>") {
							var component = new CSharpPropertyComponent();
							component.type = "get";

							property.components.push(component);
						}

						if(property.components.length === 0 || property.components.length > 2)
							continue;

						properties.push(property);
                    } catch(ex) {
                        console.error("Skipping property due to parsing error.", statement, ex);
                    }
				}
			}
		}

		return properties;
	}
}