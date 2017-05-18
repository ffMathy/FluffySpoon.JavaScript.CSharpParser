export interface Scope {
    prefix: string;
    content: string;
    suffix: string;
}
export declare class ScopeHelper {
    getScopes(content: string): Scope[];
}
