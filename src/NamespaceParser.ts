import {
    CSharpNamespace
} from './Models';

import { ScopeHelper } from './ScopeHelper';
import { RegExHelper } from './RegExHelper';
import { UsingsParser } from './UsingsParser';
import { ClassParser } from './ClassParser';
import { InterfaceParser } from './InterfaceParser';
import { EnumParser } from './EnumParser';
import { StructParser } from './StructParser';

export class NamespaceParser {
    private scopeHelper = new ScopeHelper();
    private regexHelper = new RegExHelper();
    private usingsParser = new UsingsParser();
    private classParser = new ClassParser();
    private interfaceParser = new InterfaceParser();
	private enumParser = new EnumParser();
	private structParser = new StructParser();

    constructor() {
        
    }

    public parseNamespaces(content: string) {
        var namespaces = new Array<CSharpNamespace>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
            var matches = this.regexHelper.getMatches(
                scope.prefix, 
                /namespace\s+([\.\w]+?)\s*{/g);
            for (var match of matches) {
                var namespace = new CSharpNamespace(match[0]);
                namespace.innerScopeText = scope.content;

                var enums = this.enumParser.parseEnums(scope.content);
                for (var enumObject of enums) {
                    enumObject.parent = namespace;
                    namespace.enums.push(enumObject);
                }

                var classes = this.classParser.parseClasses(scope.content);
                for (var classObject of classes) {
                    classObject.parent = namespace;
                    namespace.classes.push(classObject);
				}

				var structs = this.structParser.parseStructs(scope.content);
				for (var struct of structs) {
					struct.parent = namespace;
					namespace.structs.push(struct);
				}

                var usings = this.usingsParser.parseUsings(scope.content);
                for (var using of usings) {
                    using.parent = namespace;
                    namespace.usings.push(using);
                }
                
                var subNamespaces = this.parseNamespaces(scope.content);
                for (var subNamespace of subNamespaces) {
                    subNamespace.parent = namespace;
                    namespace.namespaces.push(subNamespace);
                }

                var interfaces = this.interfaceParser.parseInterfaces(scope.content);
                for (var interfaceObject of interfaces) {
                    namespace.interfaces.push(interfaceObject);
                }

                namespaces.push(namespace);
            }
        }

        return namespaces;
    }
}