export class RegExHelper {
	public static readonly REGEX_GENERIC_TYPES_WRAPPED = "<\\s*([<>.\\w,\\s]+)\\s*>";
	public static readonly REGEX_MODIFIERS = "((?:\\w+\\s)*)";
	public static readonly REGEX_TYPE_NAME = "([\\w.]+)";
	public static readonly REGEX_TYPE = RegExHelper.REGEX_TYPE_NAME + "(?:\\s*" + RegExHelper.REGEX_GENERIC_TYPES_WRAPPED + ")?(\\?|(?:\\[\\]))?";
	public static readonly REGEX_ATTRIBUTE = "((?:\\[.*\\]\\s*?)*)?";
	public static readonly REGEX_CLASS = RegExHelper.getClassOrInterfaceRegex("class");
	public static readonly REGEX_INTERFACE = RegExHelper.getClassOrInterfaceRegex("interface");

	private static getClassOrInterfaceRegex(keyword: "class" | "interface") {
		return "\\s*" + RegExHelper.REGEX_ATTRIBUTE + "\\s*" + RegExHelper.REGEX_MODIFIERS + keyword + "\\s+" + RegExHelper.REGEX_TYPE_NAME + "(?:\\s*" + RegExHelper.REGEX_GENERIC_TYPES_WRAPPED + ")?\\s*(?:\\:\\s*(\\w+?(?:\\s*" + RegExHelper.REGEX_GENERIC_TYPES_WRAPPED + ")?))?(?:\\s*where\\s*(\\w+?)\\s*(?:" + RegExHelper.REGEX_GENERIC_TYPES_WRAPPED + ")?\\s*\\:\\s*([\\w()]+?(?:\\s*" + RegExHelper.REGEX_GENERIC_TYPES_WRAPPED + ")?))?\\s*{";
	}

	public getMatches(input: string, regex: RegExp) {
		var final = [];

		var groups;
		while (groups = regex.exec(input)) {
			final.push(groups.slice(1));
		}

		return final;
	}
}