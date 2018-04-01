export declare class RegExHelper {
    static readonly REGEX_GENERIC_TYPES_WRAPPED: string;
    static readonly REGEX_MODIFIERS: string;
    static readonly REGEX_TYPE_NAME: string;
    static readonly REGEX_TYPE: string;
    static readonly REGEX_ATTRIBUTE: string;
    static readonly REGEX_CLASS: string;
    static readonly REGEX_INTERFACE: string;
    static readonly REGEX_METHOD: string;
    static readonly REGEX_METHOD_PARAMETER: string;
    private static getClassOrInterfaceRegex(keyword);
    getMatches(input: string, regex: RegExp): string[][];
}
