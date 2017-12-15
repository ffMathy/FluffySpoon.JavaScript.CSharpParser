export interface Scope {
    prefix: string;
    content: string;
    suffix: string;
    offset: number;
    length: number;
}
export declare class ScopeHelper {
    getCurlyScopes(content: string): Scope[];
    getGenericTypeScopes(content: string): Scope[];
    enumerateRelevantCodeCharacterRegions(content: string, enumerator?: (stringSoFar: string, character: string) => void): string;
    private getScopes(content, entry, exit);
    private stringEndsWith(content, search);
}
