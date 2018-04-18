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

    constructor(
		private classParser: ClassParser,
		private interfaceParser: InterfaceParser,
		private enumParser: EnumParser,
        private structParser: StructParser) {
        
    }

    parseNamespacesFromCode(content: string) {
        var namespaces = new Array<CSharpNamespace>();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var scope of scopes) {
            var statements = this.scopeHelper.getStatements(scope.prefix);
            for(var statement of statements) {
                var matches = this.regexHelper.getMatches(
                    statement, 
                    new RegExp(this.regexHelper.getNamespaceRegex(false, true), "g"));
                for (var match of matches) {
                    try {
                        var name = match[0];
                        var namespacesFromName = NamespaceParser.parseNamespacesFromName(name);

                        var namespace = namespacesFromName[namespacesFromName.length-1];
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
                        
                        var subNamespaces = this.parseNamespacesFromCode(scope.content);
                        for (let subNamespace of subNamespaces) {
                            subNamespace.parent = namespace;
                            namespace.namespaces.push(subNamespace);
                        }

                        var interfaces = this.interfaceParser.parseInterfaces(scope.content);
                        for (var interfaceObject of interfaces) {
                            namespace.interfaces.push(interfaceObject);
                        }

                        namespaces.push(namespacesFromName[0]);
                    } catch(ex) {
                        console.error("Skipping namespace due to parsing error.", statement, ex);
                    }
                }
            }
        }

        return namespaces;
    }

    static parseNamespaceFromName(name: string) {
        return name ? this.parseNamespacesFromName(name)[0] : null;
    }

    static parseNamespacesFromName(name: string) {
        var namespaces = new Array<CSharpNamespace>();

        var previousNamespace: CSharpNamespace = null;
        var subNames = name.split(".");

        for(var i=0;i<subNames.length-1;i++) {
            var subName = subNames[i];

            let subNamespace = new CSharpNamespace(subName);
            namespaces.push(subNamespace);

            if(previousNamespace) {
                subNamespace.parent = previousNamespace;
                previousNamespace.namespaces.push(subNamespace);
            }

            previousNamespace = subNamespace;
        }

        name = subNames[subNames.length-1];

        var namespace = new CSharpNamespace(name);
        namespaces.push(namespace);

        if(previousNamespace) {
            previousNamespace.namespaces.push(namespace);
            namespace.parent = previousNamespace;
        }

        return namespaces;
    }
}