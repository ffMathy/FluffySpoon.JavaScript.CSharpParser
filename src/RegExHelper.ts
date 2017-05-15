export class RegExHelper {
    public static getMatches(input: string, regex: RegExp) {
        var matches = regex.exec(input)
        if (!matches) return [];

        return matches.slice(1);
    }
}