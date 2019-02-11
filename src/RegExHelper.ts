export class RegExHelper {
	//many of the rules here come from the C# standard: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-334.pdf

	public getLiteralNumberHexadecimalRegex(capture: boolean) {
		return this.wrapInGroup(false, true, "0x" + this.wrapInGroup(capture, false, "[\\dA-F]+"));
	}

	public getSignRegex(capture: boolean) {
		return this.wrapInGroup(capture, true, "[\\+\\-]");
	}

	public getLiteralNumberIntegerRegex(capture: boolean) {
		var integerRegex = this.wrapInGroup(capture, false, 
			this.getSignRegex(false) + "??" +
			this.wrapInGroup(false, true, "\\d+?")) + 
			"[uUlL]*?";
		return this.wrapInGroup(false, true, integerRegex + "|" + this.getLiteralNumberHexadecimalRegex(false));
	}
	
	public getLiteralNumberDecimalRegex(capture: boolean) {
		var decimalDigits = "\\d+?";
		var exponentPart = this.wrapInGroup(false, false, "[eE]" + (this.getSignRegex(false) + "??") + decimalDigits);
		var realTypeSuffix = this.wrapInGroup(false, false, "[fFdDmM]");

		var realLiteral = 
			this.wrapInGroup(false, false, decimalDigits + "\\." + decimalDigits + (exponentPart + "??") + (realTypeSuffix + "??")) + "|" +
			this.wrapInGroup(false, false, "\\." + decimalDigits + (exponentPart + "??") + (realTypeSuffix + "??")) + "|" +
			this.wrapInGroup(false, false, decimalDigits + exponentPart + (realTypeSuffix + "??")) + "|" +
			this.wrapInGroup(false, false, decimalDigits + realTypeSuffix);

		return this.wrapInGroup(false, true, 
			this.getSignRegex(false) + "??" +
			this.wrapInGroup(false, true, realLiteral));
	}

	public getLiteralNumberRegex(capture: boolean) {
		return this.wrapInGroup(capture, true, 
			this.getLiteralNumberDecimalRegex(false) + "|" +
			this.getLiteralNumberIntegerRegex(false) + "{1}?");
	}

	public getLiteralStringRegex(capture: boolean) {
		return this.wrapInGroup(capture, false, "\".+\"");
	}

	public getLiteralCharacterRegex(capture: boolean) {
		return this.wrapInGroup(capture, false, "'" + this.wrapInGroup(false, false, "\\\\?.") + "'");
	}

	public getLiteralRegex(capture: boolean) {
		return this.wrapInGroup(capture, true, 
			this.getLiteralNumberRegex(false) + "{1}?|" +
			this.getLiteralStringRegex(false) + "|" +
			this.getLiteralCharacterRegex(false) + "|" +
			this.getNameRegex(false));
	}

	public getMethodParameterRegex(
		capture: boolean, 
		captureAttributes: boolean, 
		captureModifiers: boolean, 
		captureType: boolean,
		captureName: boolean,
		captureDefaultValue: boolean) 
	{
		var result = "";

		result += this.getAttributesRegex(captureAttributes);
		result += this.getModifierRegex(captureModifiers) + "??";
		result += this.getGenericTypeNameRegex(captureType, false, false, false, false);
		result += this.getNameRegex(captureName);
		result += this.wrapInGroup(false, true, 
			this.wrapInGroup(false, true, "=") +
			this.getLiteralRegex(captureDefaultValue)) +
			"??";
		
		return this.wrapInGroup(capture, true, result);
	}

	public getMethodParametersWrapperRegex(capture: boolean, captureContents: boolean) {
		return this.wrapInGroup(capture, true, 
			"\\(" + this.getWildcardGroup(captureContents) + "\\)");
	}

	public getEnumOptionRegex(capture: boolean, captureAttributes: boolean, captureName: boolean, captureValue: boolean) {
		var result = "";

		result += this.getAttributesRegex(captureAttributes);
		result += this.getNameRegex(captureName);
		result += this.wrapInGroup(false, true, 
			this.wrapInGroup(false, true, "=") +
			this.getLiteralNumberIntegerRegex(captureValue)) +
			"??";

		return this.wrapInGroup(capture, true, result);
	}

	public getEnumRegex(capture: boolean, captureAttributes: boolean, captureModifiers: boolean, captureName: boolean, captureInheritance: boolean) {
		var result = "";

		result += this.getAttributesRegex(captureAttributes);
		result += this.getModifiersRegex(captureModifiers);
		result += this.wrapInGroup(false, true, "enum");
		result += this.getNameRegex(captureName);
		result += this.wrapInGroup(false, true, 
			this.wrapInGroup(false, true, ":") +
			this.getNameRegex(captureInheritance)) +
			"??";
		
		result += this.wrapInGroup(false, true, "{");

		return result;
	}

	public getMethodRegex(
		capture: boolean,
		captureAttributes: boolean,
		captureModifiers: boolean,
		captureReturnType: boolean,
		captureName: boolean,
		captureGenericParameters: boolean,
		captureParameters: boolean,
		captureOpeningMethod: boolean) 
	{
		var result = "";

		result += this.getAttributesRegex(captureAttributes);
		result += this.getModifiersRegex(captureModifiers);
		result += this.getGenericTypeNameRegex(captureReturnType, false, false, false, false) + "??";
		result += this.getGenericNameRegex(false, captureName, captureGenericParameters);
		result += this.getMethodParametersWrapperRegex(false, captureParameters);
		result += this.wrapInGroup(false, false, 
			this.wrapInGroup(false, true, "where") +
			this.getGenericNameRegex(false, false, false) +
			this.wrapInGroup(false, true, ":")) + 
			"*?";
		result += this.wrapInGroup(captureOpeningMethod, true, 
			this.wrapInGroup(false, false, "{") + "|" + 
			this.wrapInGroup(false, false, ";") + "|" +
			this.wrapInGroup(false, false, this.wrapInGroup(false, false, "=>")));

		return this.wrapInGroup(capture, false, result);
	}

	private getWildcardGroup(capture: boolean) {
		return this.wrapInGroup(capture, false, "(?:\\s|.)*");
	}

	public getNamespaceRegex(capture: boolean, captureFullName: boolean) {
		return this.wrapInGroup(capture, true,
			this.wrapInGroup(false, true, "namespace") +  
			this.getNameRegex(captureFullName))
	}

	public getFieldRegex(
		capture: boolean,
		captureAttributes: boolean,
		captureModifiers: boolean,
		captureReturnType: boolean,
		captureName: boolean,
		captureInitialValue: boolean) 
	{
		var result = "";

		result += this.getAttributesRegex(captureAttributes);
		result += this.getModifiersRegex(captureModifiers);
		result += this.getGenericTypeNameRegex(captureReturnType, false, false, false, false);
		result += this.getNameRegex(captureName);
		result += this.getInitialValueRegex(captureInitialValue);
		result += this.wrapInGroup(false, true, ";");

		return this.wrapInGroup(capture, false, result);
	}

	public getPropertyRegex(
		capture: boolean,
		captureAttributes: boolean,
		captureModifiers: boolean,
		captureReturnType: boolean,
		captureName: boolean,
		captureOpeningMethod: boolean) 
	{
		var result = "";

		result += this.getAttributesRegex(captureAttributes);
		result += this.getModifiersRegex(captureModifiers);
		result += this.getGenericTypeNameRegex(captureReturnType, false, false, false, false);
		result += this.getNameRegex(captureName);
		result += this.wrapInGroup(captureOpeningMethod, true, 
			this.wrapInGroup(false, false, "{") + "|" + 
			this.wrapInGroup(false, false, this.wrapInGroup(false, false, "=>")));

		return this.wrapInGroup(capture, false, result);
	}
	
	public getPropertyInitialValueRegex(capture: boolean) {
		var result = "";
		
		result += this.wrapInGroup(false, true, "}");
		result += this.wrapInGroup(false, false, "=");
		result += this.wrapInGroup(capture, true, "[^;]+?");
		result += this.wrapInGroup(false, false, ";");

		return this.wrapInGroup(false, false, result);
	}

	public getKeywordRegex(capture: boolean) {
		var validKeywords = [
			this.getModifierRegex(false),
			"as",
			"base",
			"break",
			"case",
			"catch",
			"checked",
			"class",
			"const",
			"continue",
			"default",
			"delegate",
			"do",
			"else",
			"enum",
			"explicit",
			"finally",
			"fixed",
			"for",
			"foreach",
			"goto",
			"if",
			"implicit",
			"in",
			"interface",
			"is",
			"lock",
			"namespace",
			"new",
			"operator",
			"out",
			"override",
			"return",
			"sealed",
			"sizeof",
			"stackalloc",
			"switch",
			"this",
			"throw",
			"try",
			"typeof",
			"unchecked",
			"unsafe",
			"using",
			"while"
		];
		return this.wrapInGroup(capture, false, validKeywords.join('|'));
	}

	public getModifierRegex(capture: boolean) {
		var validModifiers = [
			"public",
			"private",
			"internal",
			"protected",
			"abstract",
			"async",
			"const",
			"event",
			"extern",
			"new",
			"override",
			"partial",
			"readonly",
			"sealed",
			"static",
			"unsafe",
			"virtual",
			"volatile",
			"ref",
			"params"
		];
		return this.wrapInGroup(capture, false, validModifiers.join('|'));
	}

	public getModifiersRegex(capture: boolean) {
		return this.wrapInGroup(capture, false, this.repeatGroups("\\s*", () => this.getModifierRegex(false)) + "*?");
	}

	public getAttributeParameterRegex(capture: boolean, captureName: boolean, captureValue: boolean) {
		var result = "";

		result += this.wrapInGroup(false, true, this.getNameRegex(captureName) + "=") + "??";
		result += this.getLiteralRegex(captureValue);

		return this.wrapInGroup(capture, true, result);
	}

	public getAttributeParametersRegex(capture: boolean, captureContents: boolean) {
		return this.wrapInGroup(capture, true, "\\(" + this.wrapInGroup(captureContents, true, this.repeatGroups(",", () => this.getAttributeParameterRegex(false, false, false))) + "\\)");
	}

	public getAttributeRegex(capture: boolean, captureAttributeName: boolean, captureParameters: boolean) {
		return this.wrapInGroup(capture, true, this.getNameRegex(captureAttributeName) + this.getAttributeParametersRegex(false, captureParameters) + "??");
	}

	public getAttributesRegex(capture: boolean) {
		return this.wrapInGroup(capture, false, this.wrapInGroup(false, true, "\\[" + this.repeatGroups(",", () => this.getAttributeRegex(false, false, false)) + "\\]") + "*?");
	}

	public getNameRegex(capture: boolean) {
		return this.wrapInGroup(capture, true, "[\\w.]+");
	}

	public getGenericTypeWrapperRegex(capture: boolean, captureContents: boolean) {
		return this.wrapInGroup(capture, true, "<" + this.wrapInGroup(captureContents, true, "[^=]+") + ">") + "??";
	}

	public getTypeConstraintRegex(capture: boolean) {
		return this.wrapInGroup(capture, true, this.getGenericNameRegex(false, false, false) + "|new\\s*\\(\\s*\\)|class|struct");
	}

	public getGenericNameRegex(capture: boolean, captureTypeName: boolean, captureGenericsContent: boolean) {
		return this.wrapInGroup(capture, true, 
			this.getNameRegex(captureTypeName) + 
			this.getGenericTypeWrapperRegex(false, captureGenericsContent));
	}

	public getUsingRegex(capture: boolean, captureAlias: boolean, captureNamespace: boolean) {
		var result = "";

		result += this.wrapInGroup(false, true, "using");
		result += this.wrapInGroup(false, true, 
			this.getNameRegex(captureAlias) + 
			this.wrapInGroup(false, true, "=")) +
			"??";
		result += this.getNameRegex(captureNamespace);
		result += this.wrapInGroup(false, true, ";");

		return result;
	}

	public getGenericTypeNameRegex(capture: boolean, captureTypeName: boolean, captureGenericsContent: boolean, captureTupleContent: boolean, captureSuffix: boolean) {
		return this.wrapInGroup(capture, true, 
			this.wrapInGroup(false, false, 
				this.getGenericNameRegex(false, captureTypeName, captureGenericsContent) + "|" +
				this.wrapInGroup(false, false, "\\(" + this.wrapInGroup(captureTupleContent, true, ".+?") + "\\)")) + 
			this.wrapInGroup(captureSuffix, true, "\\?|" + this.wrapInGroup(false, true, "\\[\\s*\\]") + "+") + "??");
	}

	private wrapInGroup(capture: boolean, wrapInSpaces: boolean, input: string) {
		input = (capture ? "(" : "(?:") + input + ")";
		if(wrapInSpaces)
			input = "(?:\\s*?" + input + "\\s*?)";

		return input;
	}

	private wrapInNegatedGroup(capture: boolean, wrapInSpaces: boolean, input: string) {
		return this.wrapInGroup(capture, wrapInSpaces, "(?!" + input + ")");
	}

	private repeatGroups(separator: string, groupRegexFunction: () => string) {
		return this.wrapInGroup(false, false, groupRegexFunction() + separator) + "*?" + groupRegexFunction();
	}

	public getStructRegex() 
	{
		var result = "";

		result += this.getAttributesRegex(true);
		result += this.getModifiersRegex(true);
		result += this.wrapInGroup(false, true, "struct");

		//struct name
		result += this.getGenericNameRegex(false, true, true);

		//inheritance.
		var whereSection = "";
		whereSection += this.wrapInGroup(false, true, "where");
		whereSection += this.getNameRegex(false);
		whereSection += this.wrapInGroup(false, true, ":");
		whereSection += this.getTypeConstraintRegex(false);

		result += this.wrapInGroup(false, true, whereSection) + "*?";

		result += "{";
		
		return this.wrapInGroup(false, false, result);
	}

	private getClassOrInterfaceRegex(keyword: "class" | "interface") {
		var result = "";

		result += this.getAttributesRegex(true);
		result += this.getModifiersRegex(true);
		result += this.wrapInGroup(false, true, keyword);

		//class name.
		result += this.getGenericNameRegex(false, true, true);

		//inheritance.
		var whereSection = "";
		whereSection += this.wrapInGroup(false, true, "where");
		whereSection += this.getNameRegex(false);
		whereSection += this.wrapInGroup(false, true, ":");
		whereSection += this.getTypeConstraintRegex(false);

		var inheritanceSection = "";
		inheritanceSection += this.wrapInGroup(false, true, ":");
		inheritanceSection += this.wrapInGroup(true, true, this.repeatGroups(",", () => this.getGenericNameRegex(false, false, false)));

		result += this.wrapInGroup(false, true, inheritanceSection) + "??";
		result += this.wrapInGroup(false, true, whereSection) + "*?";

		result += "{";
		
		return this.wrapInGroup(false, false, result);
	}

	public getClassRegex() {
		return this.getClassOrInterfaceRegex("class");
	}

	public getInterfaceRegex() {
		return this.getClassOrInterfaceRegex("interface");
	}

	public getInitialValueRegex(capture: boolean) {
		var result = this.wrapInGroup(false, true, "=");
		result += this.wrapInGroup(capture, true, "[^;]+?");

		return this.wrapInGroup(false, false, result) + "??";
	}

	public getMatches(input: string, regex: RegExp) {
		if(!input)
			return [];

		var final = [];

		var groups;
		while (groups = regex.exec(input)) {
			if(!groups[0])
				continue;
			
			final.push(groups
				.slice(1)
				.map(x => x || "")
				.map(x => x.trim()));
		}

		return final;
	}
}