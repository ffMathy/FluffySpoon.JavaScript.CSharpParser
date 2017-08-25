export interface Scope {
    prefix: string;
    content: string;
    suffix: string;
    offset: number;
    length: number;
}

export class ScopeHelper {
    getCurlyScopes(content: string) {
        return this.getScopes(content, "{", "}");
    }

    getGenericTypeScopes(content: string) {
        var scopes = this.getScopes(content, "<", ">");
        if (scopes.length > 0 && scopes[scopes.length - 1].prefix.trim() === ">") {
            scopes = scopes.slice(0, scopes.length - 1);
        }

        return scopes;
    }

    enumerateRelevantCodeCharacterRegions(content: string, enumerator?: (stringSoFar: string, character: string) => void) {
        var insideString = false;
        var stringEntry = "";
        var insideStringEscapeCharacter = false;

        var insideSingleLineComment = false;
        var multiLineCommentScope = 0;
        var isEnteringCommentScope = false;

        var totalStringSoFar = "";
        var stringSoFar = "";

        for (var character of content) {
            totalStringSoFar += character;

            var insideComment = () => insideSingleLineComment || multiLineCommentScope > 0;
            if (insideComment()) {
                if (insideSingleLineComment && character === "\n") {
                    insideSingleLineComment = false;
                } else if (multiLineCommentScope > 0 && this.stringEndsWith(totalStringSoFar, "*/")) {
                    multiLineCommentScope--;
                }
            }

            if (!insideString) {
                if (this.stringEndsWith(totalStringSoFar, "//")) {
                    insideSingleLineComment = true;
                } else if (this.stringEndsWith(totalStringSoFar, "/*")) {
                    multiLineCommentScope++;
                }
            }

            if (insideComment()) {
                isEnteringCommentScope = false;
                continue;
            }

            if (!insideString && character === "/") {
                isEnteringCommentScope = true;
                continue;
            }

            stringSoFar += character;

            if (insideString && character === '\\') {
                insideStringEscapeCharacter = true;
            } else if (insideString)
                insideStringEscapeCharacter = false;

            var isEnteringString = (character === '"' || character === "'") && !insideString;
            var isExitingString = insideString && character === stringEntry;
            if (!insideStringEscapeCharacter && (isEnteringString || isExitingString)) {
                insideString = !insideString;
                stringEntry = character;
            }

            if (enumerator) {
                if (isEnteringCommentScope) {
                    enumerator(
                        stringSoFar.substr(0, stringSoFar.length - 1),
                        stringSoFar.charAt(stringSoFar.length - 2));
                }
                enumerator(stringSoFar, character);
            }

            isEnteringCommentScope = false;
        }

        return stringSoFar;
    }

    private getScopes(content: string, entry: string, exit: string): Scope[] {
        var scopes = new Array<Scope>();
        if (!content)
            return scopes;

        var results = ['', '', ''];

        var scope = 0;
        var area = 0;

        var pushScope = () => {
            var lastScope = scopes[scopes.length - 1];
            var lastOffset = lastScope ? lastScope.offset : 0;
            var offset = content.indexOf(entry, lastOffset);

            var scopeObject = {
                prefix: results[0].substring(0, results[0].length - (results[1] === "" ? 0 : (entry.length - 1))),
                content: results[1],
                suffix: results[2],
                offset: offset,
                length: entry.length + results[1].length + exit.length
            };

            scopes.push(scopeObject);

            results[0] = results[2] || '';
            results[1] = '';
            results[2] = '';
        };

        var popCharacters = (count: number) => {
            for (var i = 0; i < count; i++) {
                results[area] = results[area].substr(0, results[area].length - 1);
            }
        };

        var pushCharacter = (character: string) => {
            results[area] += character;
        };

        this.enumerateRelevantCodeCharacterRegions(content, (stringSoFar, character) => {
            if (this.stringEndsWith(stringSoFar, exit)) {
                scope--;
                if (scope === 0)
                    area = 2;
            }

            pushCharacter(character);

            if (this.stringEndsWith(stringSoFar, entry)) {
                scope++;
                if (scope === 1 && area === 2) {
                    pushScope();
                }
                if (scope === 1) {
                    popCharacters(entry.length - 1);
                    area = 1;
                }
            }
        });

        pushScope();
        if (results[0])
            pushScope();

        return scopes;
    }

    private stringEndsWith(content: string, search: string) {
        return content.substr(content.length - search.length) === search;
    }
}