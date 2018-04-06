import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { CSharpToken, CSharpNamedToken } from './Models';

export class LiteralParser {
	private scopeHelper = new ScopeHelper();
	private regexHelper = new RegExHelper();

	constructor() {

	}

	parseLiteral(valueInput: string) {
		if(!valueInput)
			return null;

		valueInput = valueInput.trim();

		var valueOutput = <CSharpToken>null;
		if ((valueInput.charAt(0) === "\"" || valueInput.charAt(0) === "'") && valueInput.charAt(valueInput.length - 1) === valueInput.charAt(0)) {
			valueOutput = valueInput.substr(1, valueInput.length - 2);
		} else if (!isNaN(parseFloat(valueInput))) {
			valueOutput = parseFloat(valueInput);
		} else if (valueInput === "false" || valueInput === "true") {
			valueOutput = valueInput === "true";
		} else {
			var token = new CSharpNamedToken();
			token.name = valueInput.trim();

			valueOutput = token;
		}
		
		return valueOutput;
	}
}
