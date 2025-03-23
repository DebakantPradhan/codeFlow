// C++ Advanced Autocompletion Module
const CppAdvancedAutocompletion = (function() {
    // Public methods
    function setupCppAdvancedCompletion(monaco) {
        // Advanced C++ context-aware completion
        monaco.languages.registerCompletionItemProvider('cpp', {
            triggerCharacters: ['.', '::', '->', '(', '[', ',', ' '],
            provideCompletionItems: function(model, position) {
                // Get editor content up to cursor
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });
                
                // Get current line text
                const lineText = model.getLineContent(position.lineNumber).substring(0, position.column - 1);
                
                const suggestions = [];
                
                // Handle object member access with dot or arrow operator
                if (lineText.match(/\.|->$/)) {
                    const match = lineText.match(/(\w+)(?:\.|->)$/);
                    if (match) {
                        const objName = match[1];
                        // Find object type
                        const objType = findObjectType(textUntilPosition, objName);
                        
                        if (objType) {
                            // Find methods for this class/type
                            const methods = findClassMethods(textUntilPosition, objType);
                            methods.forEach(method => {
                                suggestions.push({
                                    label: method.name,
                                    kind: monaco.languages.CompletionItemKind.Method,
                                    detail: `${method.returnType} ${objType}::${method.name}`,
                                    insertText: method.name + (method.hasParams ? '($0)' : '()'),
                                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                    sortText: '00' + method.name,
                                });
                            });
                        }
                        
                        // If no methods found for user-defined class or failed to determine type
                        const stdMembers = getStandardTypeMembers(objName, textUntilPosition, monaco);
                        if (stdMembers.length > 0) {
                            suggestions.push(...stdMembers);
                        }
                        
                        // Determine object type using naming conventions
                        if (suggestions.length === 0) {
                            // Common vector methods if seems like a vector
                            if (objName.match(/vec|arr|v_|nums|items|points|results|elements|values/i)) {
                                getVectorMembers(monaco).forEach(member => {
                                    suggestions.push(member);
                                });
                            }
                            // Common string methods
                            else if (objName.match(/str|s_|text|name|word|chars/i)) {
                                getStringMembers(monaco).forEach(member => {
                                    suggestions.push(member);
                                });
                            }
                            // Common map methods
                            else if (objName.match(/map|m_|dict|counts|freq|lookup|table|cache|memo/i)) {
                                getMapMembers(monaco).forEach(member => {
                                    suggestions.push(member);
                                });
                            }
                            // Solution class methods (LeetCode style)
                            else if (objName.match(/sol|solution/i)) {
                                findSolutionMethods(textUntilPosition).forEach(method => {
                                    suggestions.push({
                                        label: method.name,
                                        kind: monaco.languages.CompletionItemKind.Method,
                                        detail: `${method.returnType} Solution::${method.name}`,
                                        insertText: method.name + (method.hasParams ? '($0)' : '()'),
                                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                        sortText: '00' + method.name,
                                    });
                                });
                            }
                        }
                    }
                    
                    return { 
                        suggestions: suggestions,
                        incomplete: true
                    };
                }
                
                // Namespace scope resolution (::)
                else if (lineText.endsWith('::')) {
                    const match = lineText.match(/(\w+)::$/);
                    if (match) {
                        const namespace = match[1];
                        // Add namespace members based on common namespaces
                        const namespaceMembers = getNamespaceMembers(namespace, monaco);
                        namespaceMembers.forEach(member => {
                            suggestions.push(member);
                        });
                        
                        return { 
                            suggestions: suggestions,
                            incomplete: true
                        };
                    }
                }
                
                // Standard context-aware suggestions
                // Extract variables, functions and classes
                
                // C++ variable declarations (with types)
                const variableRegex = /\b(?:int|float|double|char|bool|string|auto|long|unsigned|short|void|size_t|vector<[^>]*>|map<[^>]*>|set<[^>]*>|queue<[^>]*>|stack<[^>]*>|deque<[^>]*>|list<[^>]*>|array<[^>]*>|pair<[^>]*>|unique_ptr<[^>]*>|shared_ptr<[^>]*>|const\s+\w+)\s+(\w+)(?!\s*\()/g;
                
                let match;
                while ((match = variableRegex.exec(textUntilPosition)) !== null) {
                    const varName = match[1];
                    if (!varName.match(/^(if|else|for|while|switch|return|break|continue|case|default)$/)) {
                        suggestions.push({
                            label: varName,
                            kind: monaco.languages.CompletionItemKind.Variable,
                            detail: 'Variable',
                            insertText: varName,
                            sortText: '03' + varName,
                        });
                    }
                }
                
                // C++ function declarations
                const functionRegex = /(?:void|int|float|double|bool|auto|string|char|unsigned|long|short|size_t|vector<[^>]*>|map<[^>]*>|set<[^>]*>|pair<[^>]*>)\s+(\w+)\s*\([^)]*\)\s*(?:const|override|final)?\s*{/g;
                while ((match = functionRegex.exec(textUntilPosition)) !== null) {
                    const functionName = match[1];
                    if (!functionName.match(/^(if|else|for|while|switch)$/)) {
                        suggestions.push({
                            label: functionName,
                            kind: monaco.languages.CompletionItemKind.Function,
                            detail: 'Function',
                            insertText: functionName + '($0)',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            sortText: '04' + functionName,
                        });
                    }
                }
                
                // C++ classes and structs
                const classRegex = /(?:class|struct)\s+(\w+)(?:\s*:\s*(?:public|protected|private)\s+\w+)?(?:\s*{)?/g;
                while ((match = classRegex.exec(textUntilPosition)) !== null) {
                    suggestions.push({
                        label: match[1],
                        kind: monaco.languages.CompletionItemKind.Class,
                        detail: match[0].includes('class') ? 'Class' : 'Struct',
                        insertText: match[1],
                        sortText: '05' + match[1],
                    });
                }
                
                // C++ typedefs and using declarations
                const typedefRegex = /(?:typedef|using)\s+(?:[^;=]+?)\s+(\w+);/g;
                while ((match = typedefRegex.exec(textUntilPosition)) !== null) {
                    suggestions.push({
                        label: match[1],
                        kind: monaco.languages.CompletionItemKind.Class,
                        detail: 'Type Alias',
                        insertText: match[1],
                        sortText: '06' + match[1],
                    });
                }
                
                // C++ enum values
                const enumRegex = /enum(?:\s+class)?\s+(\w+)(?:\s*:\s*\w+)?\s*{([^}]*)}/g;
                while ((match = enumRegex.exec(textUntilPosition)) !== null) {
                    const enumName = match[1];
                    const enumBody = match[2];
                    const enumValues = enumBody.split(',');
                    
                    enumValues.forEach(value => {
                        const valueName = value.trim().split('=')[0].trim();
                        if (valueName && valueName.length > 0) {
                            suggestions.push({
                                label: valueName,
                                kind: monaco.languages.CompletionItemKind.Enum,
                                detail: `Enum Value (${enumName})`,
                                insertText: valueName,
                                sortText: '07' + valueName,
                            });
                        }
                    });
                }
                
                // C++ macros and #defines
                const defineRegex = /#define\s+(\w+)(?:\(.*\)|)/g;
                while ((match = defineRegex.exec(textUntilPosition)) !== null) {
                    suggestions.push({
                        label: match[1],
                        kind: monaco.languages.CompletionItemKind.Constant,
                        detail: 'Macro',
                        insertText: match[1],
                        sortText: '08' + match[1],
                    });
                }
                
                // Find function parameters and local variables in current scope
                const currentLine = position.lineNumber;
                const lines = textUntilPosition.split('\n');
                let bracketCount = 0;
                let inCurrentFunction = false;
                let functionParams = [];
                let localVars = [];
                
                // First pass: find function parameters
                for (let i = currentLine - 1; i >= 0; i--) {
                    const line = lines[i];
                    
                    // Count brackets to track scope
                    bracketCount += (line.match(/{/g) || []).length || 0;
                    bracketCount -= (line.match(/}/g) || []).length || 0;
                    
                    if (!inCurrentFunction && bracketCount > 0) {
                        inCurrentFunction = true;
                        
                        // Look for function parameters
                        const paramMatch = line.match(/\([^)]*\)/);
                        if (paramMatch) {
                            const params = paramMatch[0].substring(1, paramMatch[0].length - 1).split(',');
                            params.forEach(param => {
                                const parts = param.trim().split(' ');
                                if (parts.length >= 2) {
                                    // The last part is the parameter name (handle pointers and references)
                                    let paramName = parts[parts.length - 1]
                                      .replace('&', '')
                                      .replace('*', '');
                                    
                                    // Remove any default value
                                    paramName = paramName.split('=')[0].trim();
                                    
                                    if (paramName && !paramName.includes(' ')) {
                                        functionParams.push({
                                            name: paramName,
                                            type: parts.slice(0, -1).join(' ')
                                        });
                                    }
                                }
                            });
                        }
                    }
                    
                    // If we've gone out of scope, stop looking
                    if (bracketCount < 0) {
                        break;
                    }
                    
                    // Find local variable declarations within function
                    if (inCurrentFunction) {
                        // Match local variable declarations
                        const localVarRegex = /(?:int|float|double|char|bool|string|auto|vector<[^>]*>|map<[^>]*>|set<[^>]*>)\s+(\w+)(?:\s*=\s*[^;]+)?;/g;
                        let localMatch;
                        while ((localMatch = localVarRegex.exec(line)) !== null) {
                            const varName = localMatch[1];
                            const varType = line.substring(0, line.indexOf(varName)).trim();
                            localVars.push({
                                name: varName,
                                type: varType
                            });
                        }
                    }
                }
                
                // Add parameters to suggestions with highest priority
                functionParams.forEach(param => {
                    suggestions.push({
                        label: param.name,
                        kind: monaco.languages.CompletionItemKind.Variable,
                        detail: `Parameter (${param.type})`,
                        insertText: param.name,
                        sortText: '00' + param.name, // Highest priority
                    });
                });
                
                // Add local variables with high priority
                localVars.forEach(localVar => {
                    suggestions.push({
                        label: localVar.name,
                        kind: monaco.languages.CompletionItemKind.Variable,
                        detail: `Local Variable (${localVar.type})`,
                        insertText: localVar.name,
                        sortText: '01' + localVar.name, // High priority
                    });
                });
                
                // C++ for loop context - suggest i, j, k
                if (lineText.trim().startsWith('for') || lineText.includes('for (')) {
                    ['i', 'j', 'k', 'n', 'm'].forEach((loopVar, idx) => {
                        suggestions.push({
                            label: loopVar,
                            kind: monaco.languages.CompletionItemKind.Variable,
                            detail: 'Loop Variable',
                            insertText: loopVar,
                            sortText: '00' + idx, // Higher priority for loop context
                        });
                    });
                }
                
                return { 
                    suggestions: suggestions,
                    incomplete: true
                };
            }
        });
    }
    
    // Private helper functions
    function findObjectType(text, objName) {
        // Pattern: Type objName
        const varDeclRegex = new RegExp(`\\b(\\w+(?:<[^>]*>)?)\\s+${objName}\\b`, 'g');
        const varDeclMatch = varDeclRegex.exec(text);
        
        if (varDeclMatch) {
            return varDeclMatch[1];
        }
        
        // Check for function parameters: func(Type param)
        const paramRegex = new RegExp(`\\([^)]*\\b(\\w+(?:<[^>]*>)?)\\s+${objName}\\b[^)]*\\)`, 'g');
        const paramMatch = paramRegex.exec(text);
        
        if (paramMatch) {
            return paramMatch[1];
        }
        
        // Look for common naming patterns
        if (objName === 'sol' || objName.endsWith('Sol') || objName.endsWith('Solution')) {
            return 'Solution';
        }
        
        // Assume type from instance name for common containers
        if (objName.match(/vec|arr|v_|nums|items|points|results|elements|values/i)) {
            return 'vector';
        }
        if (objName.match(/str|s_|text|name|word|chars/i)) {
            return 'string';
        }
        if (objName.match(/map|m_|dict|counts|freq|lookup|table|cache|memo/i)) {
            return 'map';
        }
        
        return null;
    }
    
    function findClassMethods(text, className) {
        const methods = [];
        
        // Pattern to match method declarations inside a class
        const classRegex = new RegExp(`class\\s+${className}\\s*{[^}]*}`, 'g');
        const classMatch = classRegex.exec(text);
        
        if (classMatch) {
            const classBody = classMatch[0];
            
            // Extract method declarations
            const methodRegex = /\b((?:void|int|float|double|bool|auto|string|char|unsigned|long|short|size_t|vector<[^>]*>|map<[^>]*>|set<[^>]*>|\w+)(?:\s*[*&])?)\s+(\w+)\s*\([^)]*\)/g;
            let methodMatch;
            
            while ((methodMatch = methodRegex.exec(classBody)) !== null) {
                const returnType = methodMatch[1];
                const methodName = methodMatch[2];
                const params = methodMatch[0].match(/\([^)]*\)/)[0];
                
                // Skip constructor/destructor
                if (methodName !== className && methodName !== `~${className}`) {
                    methods.push({
                        name: methodName,
                        returnType: returnType,
                        hasParams: params.trim() !== '()'
                    });
                }
            }
        }
        
        // Also look for method implementations outside the class
        const methodImplRegex = new RegExp(`\\b(?:void|int|float|double|bool|auto|string|char|unsigned|long|short|size_t|vector<[^>]*>|map<[^>]*>|set<[^>]*>|\\w+)(?:\\s*[*&])?\\s+${className}::([\\w~]+)\\s*\\(`, 'g');
        let implMatch;
        
        while ((implMatch = methodImplRegex.exec(text)) !== null) {
            const methodName = implMatch[1];
            
            // Check if method is already in the list
            if (!methods.some(m => m.name === methodName)) {
                methods.push({
                    name: methodName,
                    returnType: implMatch[0].split(' ')[0],
                    hasParams: true
                });
            }
        }
        
        return methods;
    }

    function findSolutionMethods(text) {
        const methods = [];
        
        // Look for public methods in Solution class
        const publicMethodsRegex = /public:\s*(?:(?:virtual|static|inline|explicit)\s+)?(\w+(?:<[^>]*>)?(?:\s*[*&])?)\s+(\w+)\s*\(([^)]*)\)/g;
        let match;
        
        while ((match = publicMethodsRegex.exec(text)) !== null) {
            const returnType = match[1];
            const methodName = match[2];
            const params = match[3];
            
            // Skip constructor/destructor
            if (methodName !== 'Solution' && methodName !== '~Solution') {
                methods.push({
                    name: methodName,
                    returnType: returnType,
                    hasParams: params.trim() !== ''
                });
            }
        }
        
        return methods;
    }
    
    function getStandardTypeMembers(objName, text, monaco) {
        const suggestions = [];
        
        // For Solution class instances (common in LeetCode/competitive programming)
        if (objName === 'sol' || objName.endsWith('Sol') || objName.endsWith('Solution')) {
            // Find all methods in Solution class
            const methodRegex = /public:.*?\b(\w+)\s*\(/g;
            let methodMatch;
            
            while ((methodMatch = methodRegex.exec(text)) !== null) {
                const methodName = methodMatch[1];
                if (methodName !== 'Solution') {  // Exclude constructor
                    suggestions.push({
                        label: methodName,
                        kind: monaco.languages.CompletionItemKind.Method,
                        detail: `Solution::${methodName}`,
                        insertText: methodName + '($0)',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        sortText: '00' + methodName,
                    });
                }
            }
        }
        
        return suggestions;
    }
    
    function getVectorMembers(monaco) {
        return [
            {
                name: 'push_back',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'void',
                insertText: 'push_back($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'pop_back',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'void',
                insertText: 'pop_back()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'size',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'size_t',
                insertText: 'size()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'empty',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'bool',
                insertText: 'empty()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'clear',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'void',
                insertText: 'clear()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'front',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'T&',
                insertText: 'front()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'back',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'T&',
                insertText: 'back()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'begin',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'iterator',
                insertText: 'begin()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'end',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'iterator',
                insertText: 'end()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'resize',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'void',
                insertText: 'resize($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'reserve',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'void',
                insertText: 'reserve($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }
        ];
    }
    
    function getStringMembers(monaco) {
        return [
            {
                name: 'length',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'size_t',
                insertText: 'length()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'size',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'size_t',
                insertText: 'size()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'empty',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'bool',
                insertText: 'empty()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'substr',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'string',
                insertText: 'substr(${1:pos}, ${2:len})',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'find',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'size_t',
                insertText: 'find($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'append',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'string&',
                insertText: 'append($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'replace',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'string&',
                insertText: 'replace(${1:pos}, ${2:len}, ${3:str})',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'erase',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'string&',
                insertText: 'erase(${1:pos}, ${2:len})',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'clear',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'void',
                insertText: 'clear()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }
        ];
    }
    
    function getMapMembers(monaco) {
        return [
            {
                name: 'insert',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'pair<iterator,bool>',
                insertText: 'insert({${1:key}, ${2:value}})',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'erase',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'size_t',
                insertText: 'erase($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'find',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'iterator',
                insertText: 'find($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'count',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'size_t',
                insertText: 'count($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'size',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'size_t',
                insertText: 'size()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'empty',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'bool',
                insertText: 'empty()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'clear',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'void',
                insertText: 'clear()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }
        ];
    }
    
    function getSetMembers(monaco) {
        return [
            {
                name: 'insert',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'pair<iterator,bool>',
                insertText: 'insert($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'erase',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'size_t',
                insertText: 'erase($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'find',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'iterator',
                insertText: 'find($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'count',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'size_t',
                insertText: 'count($0)',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'size',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'size_t',
                insertText: 'size()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'empty',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'bool',
                insertText: 'empty()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            },
            {
                name: 'clear',
                kind: monaco.languages.CompletionItemKind.Method,
                returnType: 'void',
                insertText: 'clear()',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }
        ];
    }
    
    function getNamespaceMembers(namespace, monaco) {
        if (namespace === 'std') {
            return [
                {
                    label: 'vector',
                    kind: monaco.languages.CompletionItemKind.Class,
                    detail: 'std::vector',
                    insertText: 'vector',
                },
                {
                    label: 'string',
                    kind: monaco.languages.CompletionItemKind.Class,
                    detail: 'std::string',
                    insertText: 'string',
                },
                {
                    label: 'map',
                    kind: monaco.languages.CompletionItemKind.Class,
                    detail: 'std::map',
                    insertText: 'map',
                },
                {
                    label: 'set',
                    kind: monaco.languages.CompletionItemKind.Class,
                    detail: 'std::set',
                    insertText: 'set',
                },
                {
                    label: 'unordered_map',
                    kind: monaco.languages.CompletionItemKind.Class,
                    detail: 'std::unordered_map',
                    insertText: 'unordered_map',
                },
                {
                    label: 'unordered_set',
                    kind: monaco.languages.CompletionItemKind.Class,
                    detail: 'std::unordered_set',
                    insertText: 'unordered_set',
                },
                {
                    label: 'queue',
                    kind: monaco.languages.CompletionItemKind.Class,
                    detail: 'std::queue',
                    insertText: 'queue',
                },
                {
                    label: 'priority_queue',
                    kind: monaco.languages.CompletionItemKind.Class,
                    detail: 'std::priority_queue',
                    insertText: 'priority_queue',
                },
                {
                    label: 'stack',
                    kind: monaco.languages.CompletionItemKind.Class,
                    detail: 'std::stack',
                    insertText: 'stack',
                },
                {
                    label: 'pair',
                    kind: monaco.languages.CompletionItemKind.Class,
                    detail: 'std::pair',
                    insertText: 'pair',
                },
                {
                    label: 'make_pair',
                    kind: monaco.languages.CompletionItemKind.Function,
                    detail: 'std::make_pair',
                    insertText: 'make_pair($0)',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                },
                {
                    label: 'sort',
                    kind: monaco.languages.CompletionItemKind.Function,
                    detail: 'std::sort',
                    insertText: 'sort(${1:begin}, ${2:end})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                },
                {
                    label: 'find',
                    kind: monaco.languages.CompletionItemKind.Function,
                    detail: 'std::find',
                    insertText: 'find(${1:begin}, ${2:end}, ${3:value})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                },
                {
                    label: 'cout',
                    kind: monaco.languages.CompletionItemKind.Variable,
                    detail: 'std::cout',
                    insertText: 'cout',
                },
                {
                    label: 'cin',
                    kind: monaco.languages.CompletionItemKind.Variable,
                    detail: 'std::cin',
                    insertText: 'cin',
                },
                {
                    label: 'endl',
                    kind: monaco.languages.CompletionItemKind.Variable,
                    detail: 'std::endl',
                    insertText: 'endl',
                }
            ];
        }
        return [];
    }

    // Return public API
    return {
        setupCppAdvancedCompletion: setupCppAdvancedCompletion
    };
})();

// Export the module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CppAdvancedAutocompletion;
}