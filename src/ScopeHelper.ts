export interface Scope {
    prefix: string;
    content: string;
    suffix: string;
}

export class ScopeHelper {
    public getScopes(content: string): Scope[] {
        var results = ['', '', ''];

        var scope = 0;
        var area = 0;

        var insideString = false;
        var insideStringEscapeCharacter = false;

        var scopes = new Array<Scope>();

        var pushScope = () =>
            scopes.push({
                prefix: results[0],
                content: results[1],
                suffix: results[2]
            });

        var pushCharacter = (character) => results[area] += character;

        for (var character of content) {

            if (insideString && character === '\\') {
                insideStringEscapeCharacter = true;
                pushCharacter(character);
                continue;
            } else if (insideString)
                insideStringEscapeCharacter = false;

            if (character === '"' || character === "'")
                insideString = !insideString;

            if (insideString) {
                pushCharacter(character);
                continue;
            }

            if (character === '}') {
                scope--;
                if (scope === 0)
                    area = 2;
            }

            pushCharacter(character);

            if (character === '{') {
                scope++;
                if (scope === 1 && area === 2) {
                    pushScope();

                    results[0] = results[2];
                    results[1] = '';
                    results[2] = '';
                }
                if (scope === 1)
                    area = 1;
            }

        }

        pushScope();

        return scopes;
    }
}