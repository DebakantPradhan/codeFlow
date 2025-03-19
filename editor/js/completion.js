// Configure language-specific autocompletion
function setupCompletionProviders() {
    // JavaScript/TypeScript autocompletion
    monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: function (model, position) {
            const suggestions = [
                // JavaScript suggestions...
                {
                    label: 'console.log',
                    kind: monaco.languages.CompletionItemKind.Method,
                    insertText: 'console.log(${1:value});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Log to the console'
                },
                {
                    label: 'function',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'function ${1:name}(${2:params}) {\n\t${3}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Function definition'
                },
                {
                    label: 'if',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'if (${1:condition}) {\n\t${2}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If statement'
                },
                {
                    label: 'ifelse',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If-else statement'
                },
                {
                    label: 'for',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'For loop'
                },
                {
                    label: 'forEach',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '${1:array}.forEach((${2:item}) => {\n\t${3}\n});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Array forEach loop'
                },
                {
                    label: 'map',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '${1:array}.map((${2:item}) => {\n\t${3}\n\treturn ${4:result};\n});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Array map'
                },
                {
                    label: 'filter',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '${1:array}.filter((${2:item}) => {\n\treturn ${3:condition};\n});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Array filter'
                },
                {
                    label: 'arrow',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '(${1:params}) => {\n\t${2}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Arrow function'
                },
                // Additional JavaScript DSA autocompletions
                {
                    label: 'binary-search',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'function binarySearch(arr, target) {\n\tlet left = 0;\n\tlet right = arr.length - 1;\n\twhile (left <= right) {\n\t\tconst mid = Math.floor(left + (right - left) / 2);\n\t\tif (arr[mid] === target) {\n\t\t\treturn mid;\n\t\t} else if (arr[mid] < target) {\n\t\t\tleft = mid + 1;\n\t\t} else {\n\t\t\tright = mid - 1;\n\t\t}\n\t}\n\treturn -1; // Not found\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Binary search implementation'
                },
                {
                    label: 'map-init',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'const ${1:map} = new Map();',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create a Map'
                },
                {
                    label: 'set-init',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'const ${1:set} = new Set();',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create a Set'
                },
                {
                    label: 'queue',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'class Queue {\n\tconstructor() {\n\t\tthis.items = [];\n\t}\n\tenqueue(element) {\n\t\tthis.items.push(element);\n\t}\n\tdequeue() {\n\t\tif (this.isEmpty()) return "Underflow";\n\t\treturn this.items.shift();\n\t}\n\tfront() {\n\t\tif (this.isEmpty()) return "No elements";\n\t\treturn this.items[0];\n\t}\n\tisEmpty() {\n\t\treturn this.items.length === 0;\n\t}\n\tsize() {\n\t\treturn this.items.length;\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Queue implementation'
                },
                {
                    label: 'stack',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'class Stack {\n\tconstructor() {\n\t\tthis.items = [];\n\t}\n\tpush(element) {\n\t\tthis.items.push(element);\n\t}\n\tpop() {\n\t\tif (this.isEmpty()) return "Underflow";\n\t\treturn this.items.pop();\n\t}\n\tpeek() {\n\t\tif (this.isEmpty()) return "No elements";\n\t\treturn this.items[this.items.length - 1];\n\t}\n\tisEmpty() {\n\t\treturn this.items.length === 0;\n\t}\n\tsize() {\n\t\treturn this.items.length;\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Stack implementation'
                },
                {
                    label: 'bfs',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'function bfs(graph, start) {\n\tconst visited = new Set();\n\tconst queue = [start];\n\tvisited.add(start);\n\twhile (queue.length > 0) {\n\t\tconst node = queue.shift();\n\t\tconsole.log(node);\n\t\tfor (const neighbor of graph[node]) {\n\t\t\tif (!visited.has(neighbor)) {\n\t\t\t\tvisited.add(neighbor);\n\t\t\t\tqueue.push(neighbor);\n\t\t\t}\n\t\t}\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Breadth-First Search implementation'
                },
                {
                    label: 'dfs',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'function dfs(graph, node, visited = new Set()) {\n\tvisited.add(node);\n\tconsole.log(node);\n\tfor (const neighbor of graph[node]) {\n\t\tif (!visited.has(neighbor)) {\n\t\t\tdfs(graph, neighbor, visited);\n\t\t}\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Depth-First Search implementation'
                },
                {
                    label: 'quicksort',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'function quickSort(arr) {\n\tif (arr.length <= 1) return arr;\n\tconst pivot = arr[Math.floor(arr.length / 2)];\n\tconst left = arr.filter(x => x < pivot);\n\tconst middle = arr.filter(x => x === pivot);\n\tconst right = arr.filter(x => x > pivot);\n\treturn [...quickSort(left), ...middle, ...quickSort(right)];\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Quick sort implementation'
                },
                {
                    label: 'merge-sort',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'function mergeSort(arr) {\n\tif (arr.length <= 1) return arr;\n\tconst mid = Math.floor(arr.length / 2);\n\tconst left = mergeSort(arr.slice(0, mid));\n\tconst right = mergeSort(arr.slice(mid));\n\treturn merge(left, right);\n}\n\nfunction merge(left, right) {\n\tconst result = [];\n\tlet i = 0, j = 0;\n\twhile (i < left.length && j < right.length) {\n\t\tif (left[i] < right[j]) {\n\t\t\tresult.push(left[i]);\n\t\t\ti++;\n\t\t} else {\n\t\t\tresult.push(right[j]);\n\t\t\tj++;\n\t\t}\n\t}\n\treturn result.concat(left.slice(i)).concat(right.slice(j));\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Merge sort implementation'
                },
                {
                    label: 'graph',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'const graph = {};\n// Add vertices\nfor (let i = 0; i < ${1:n}; i++) {\n\tgraph[i] = [];\n}\n// Add edges: graph[u].push(v);',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create adjacency list for graph'
                },
                {
                    label: 'gcd',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'function gcd(a, b) {\n\tif (b === 0) return a;\n\treturn gcd(b, a % b);\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Greatest Common Divisor function'
                },
                {
                    label: 'min-heap',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'class MinHeap {\n\tconstructor() {\n\t\tthis.heap = [];\n\t}\n\n\tgetParentIndex(i) {\n\t\treturn Math.floor((i - 1) / 2);\n\t}\n\n\tgetLeftChildIndex(i) {\n\t\treturn 2 * i + 1;\n\t}\n\n\tgetRightChildIndex(i) {\n\t\treturn 2 * i + 2;\n\t}\n\n\tswap(i, j) {\n\t\t[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];\n\t}\n\n\tinsert(value) {\n\t\tthis.heap.push(value);\n\t\tthis.siftUp(this.heap.length - 1);\n\t}\n\n\tsiftUp(i) {\n\t\tlet parent = this.getParentIndex(i);\n\t\twhile (i > 0 && this.heap[parent] > this.heap[i]) {\n\t\t\tthis.swap(i, parent);\n\t\t\ti = parent;\n\t\t\tparent = this.getParentIndex(i);\n\t\t}\n\t}\n\n\textractMin() {\n\t\tif (this.heap.length === 0) return null;\n\t\tif (this.heap.length === 1) return this.heap.pop();\n\t\tconst min = this.heap[0];\n\t\tthis.heap[0] = this.heap.pop();\n\t\tthis.siftDown(0);\n\t\treturn min;\n\t}\n\n\tsiftDown(i) {\n\t\tlet minIndex = i;\n\t\tconst left = this.getLeftChildIndex(i);\n\t\tconst right = this.getRightChildIndex(i);\n\t\tif (left < this.heap.length && this.heap[left] < this.heap[minIndex]) {\n\t\t\tminIndex = left;\n\t\t}\n\t\tif (right < this.heap.length && this.heap[right] < this.heap[minIndex]) {\n\t\t\tminIndex = right;\n\t\t}\n\t\tif (i !== minIndex) {\n\t\t\tthis.swap(i, minIndex);\n\t\t\tthis.siftDown(minIndex);\n\t\t}\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Min heap implementation'
                },
                {
                    label: 'filter-arrow',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '${1:array}.filter(${2:item} => ${3:condition})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Filter array with arrow function'
                },
                {
                    label: 'map-arrow',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '${1:array}.map(${2:item} => ${3:expression})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Map array with arrow function'
                },
                {
                    label: 'reduce-arrow',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '${1:array}.reduce((${2:acc}, ${3:curr}) => ${4:acc + curr}, ${5:0})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Reduce array with arrow function'
                }

                // More suggestions...
            ];

            return { suggestions: suggestions };
        }
    });

    // Python autocompletion
    monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: function (model, position) {
            const suggestions = [
                // Python suggestions...
                {
                    label: 'print',
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: 'print(${1:value})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Print to the console'
                },
                {
                    label: 'def',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'def ${1:name}(${2:params}):\n\t${3:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Function definition'
                },
                {
                    label: 'for',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'for ${1:item} in ${2:collection}:\n\t${3:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'For loop'
                },
                {
                    label: 'if',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'if ${1:condition}:\n\t${2:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If statement'
                },
                {
                    label: 'ifelse',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'if ${1:condition}:\n\t${2:pass}\nelse:\n\t${3:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If-else statement'
                },
                {
                    label: 'class',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'class ${1:Name}:\n\tdef __init__(self, ${2:params}):\n\t\t${3:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Class definition'
                },
                {
                    label: 'while',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'while ${1:condition}:\n\t${2:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'While loop'
                },
                // Additional Python DSA autocompletions
                {
                    label: 'imports-basic',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'import math\nimport collections\nimport heapq\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Basic DSA imports'
                },
                {
                    label: 'imports-all',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'import math\nimport collections\nimport heapq\nimport itertools\nimport bisect\nimport functools\nfrom typing import List, Dict, Set, Tuple\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Common DSA imports'
                },
                {
                    label: 'binary-search',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'def binary_search(arr, target):\n\tleft, right = 0, len(arr) - 1\n\twhile left <= right:\n\t\tmid = left + (right - left) // 2\n\t\tif arr[mid] == target:\n\t\t\treturn mid\n\t\telif arr[mid] < target:\n\t\t\tleft = mid + 1\n\t\telse:\n\t\t\tright = mid - 1\n\treturn -1  # Not found\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Binary search implementation'
                },
                {
                    label: 'list-comp',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '[${1:expression} for ${2:item} in ${3:iterable} if ${4:condition}]',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'List comprehension'
                },
                {
                    label: 'dict-comp',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '{${1:key}: ${2:value} for ${3:item} in ${4:iterable}}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Dictionary comprehension'
                },
                {
                    label: 'defaultdict',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'from collections import defaultdict\n${1:d} = defaultdict(${2:int})\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create a defaultdict'
                },
                {
                    label: 'counter',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'from collections import Counter\n${1:counts} = Counter(${2:iterable})\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Use Counter to count elements'
                },
                {
                    label: 'deque',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'from collections import deque\n${1:dq} = deque()\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create a deque'
                },
                {
                    label: 'bfs',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'from collections import deque\n\ndef bfs(graph, start):\n\tvisited = set([start])\n\tqueue = deque([start])\n\twhile queue:\n\t\tnode = queue.popleft()\n\t\tprint(node, end=" ")\n\t\tfor neighbor in graph[node]:\n\t\t\tif neighbor not in visited:\n\t\t\t\tvisited.add(neighbor)\n\t\t\t\tqueue.append(neighbor)\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Breadth-First Search implementation'
                },
                {
                    label: 'dfs',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'def dfs(graph, node, visited=None):\n\tif visited is None:\n\t\tvisited = set()\n\tvisited.add(node)\n\tprint(node, end=" ")\n\tfor neighbor in graph[node]:\n\t\tif neighbor not in visited:\n\t\t\tdfs(graph, neighbor, visited)\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Depth-First Search implementation'
                },
                {
                    label: 'heappush',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'import heapq\nheapq.heappush(${1:heap}, ${2:item})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Push item to heap'
                },
                {
                    label: 'heappop',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'import heapq\n${1:item} = heapq.heappop(${2:heap})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Pop item from heap'
                },
                {
                    label: 'heap-init',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'import heapq\n${1:heap} = []\nheapq.heapify(${1:heap})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Initialize a heap'
                },
                {
                    label: 'sort-lambda',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '${1:items}.sort(key=lambda x: ${2:x[0]})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Sort with custom key function'
                },
                {
                    label: 'quicksort',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'def quicksort(arr):\n\tif len(arr) <= 1:\n\t\treturn arr\n\tpivot = arr[len(arr) // 2]\n\tleft = [x for x in arr if x < pivot]\n\tmiddle = [x for x in arr if x == pivot]\n\tright = [x for x in arr if x > pivot]\n\treturn quicksort(left) + middle + quicksort(right)\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Quick sort implementation'
                },
                {
                    label: 'bisect',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'import bisect\n${1:index} = bisect.bisect_left(${2:arr}, ${3:value})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Binary search in sorted list with bisect'
                },
                {
                    label: 'gcd',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'import math\n${1:result} = math.gcd(${2:a}, ${3:b})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Find greatest common divisor'
                },
                {
                    label: 'test-cases',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 't = int(input())\nfor _ in range(t):\n\t${1:# Your code here}\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Template for multiple test cases'
                }
                // More suggestions...
            ];

            return { suggestions: suggestions };
        }
    });

    // C++ autocompletion
    monaco.languages.registerCompletionItemProvider('cpp', {
        provideCompletionItems: function (model, position) {
            const suggestions = [
                // C++ suggestions...
                {
                    label: 'cout',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'std::cout << ${1:value} << std::endl;',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Output to console'
                },
                {
                    label: 'cin',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'std::cin >> ${1:variable};',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Input from console'
                },
                {
                    label: 'for',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n\t${3}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'For loop'
                },
                {
                    label: 'while',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'while (${1:condition}) {\n\t${2}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'While loop'
                },
                {
                    label: 'if',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'if (${1:condition}) {\n\t${2}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If statement'
                },
                {
                    label: 'ifelse',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If-else statement'
                },
                {
                    label: 'vector',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'std::vector<${1:int}> ${2:name};',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Vector declaration'
                },
                {
                    label: 'class',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'class ${1:Name} {\npublic:\n\t${1:Name}() {\n\t\t${2}\n\t}\n\nprivate:\n\t${3}\n};',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Class definition'
                },
                {
                    label: 'map',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'std::map<${1:int}, ${2:int}> ${3:name};',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Map declaration'
                },
                // Additional C++ DSA autocompletions
                {
                    label: 'include-basic',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Basic includes for DSA'
                },
                {
                    label: 'include-all',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <string>\n#include <queue>\n#include <stack>\n#include <map>\n#include <set>\n#include <unordered_map>\n#include <unordered_set>\nusing namespace std;\n\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Common includes for DSA'
                },
                {
                    label: 'main',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'int main() {\n\t${1}\n\treturn 0;\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Main function template'
                },
                {
                    label: 'binary-search',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'int binarySearch(vector<int>& arr, int target) {\n\tint left = 0, right = arr.size() - 1;\n\twhile (left <= right) {\n\t\tint mid = left + (right - left) / 2;\n\t\tif (arr[mid] == target)\n\t\t\treturn mid;\n\t\telse if (arr[mid] < target)\n\t\t\tleft = mid + 1;\n\t\telse\n\t\t\tright = mid - 1;\n\t}\n\treturn -1; // Not found\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Binary search implementation'
                },
                {
                    label: 'sort-vec',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'sort(${1:vec}.begin(), ${1:vec}.end());',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Sort a vector'
                },
                {
                    label: 'sort-desc',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'sort(${1:vec}.begin(), ${1:vec}.end(), greater<int>());',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Sort a vector in descending order'
                },
                {
                    label: 'pair',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'pair<${1:int}, ${2:int}> ${3:p};',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Pair declaration'
                },
                {
                    label: 'make-pair',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'make_pair(${1:first}, ${2:second})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create a pair'
                },
                {
                    label: 'priority-queue',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'priority_queue<${1:int}> ${2:pq};',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Max heap declaration'
                },
                {
                    label: 'min-heap',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'priority_queue<${1:int}, vector<${1:int}>, greater<${1:int}>> ${2:pq};',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Min heap declaration'
                },
                {
                    label: 'stack',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'stack<${1:int}> ${2:st};',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Stack declaration'
                },
                {
                    label: 'queue',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'queue<${1:int}> ${2:q};',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Queue declaration'
                },
                {
                    label: 'dfs',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'void dfs(vector<vector<int>>& graph, int node, vector<bool>& visited) {\n\tvisited[node] = true;\n\t// Process node\n\tcout << node << " ";\n\tfor (int neighbor : graph[node]) {\n\t\tif (!visited[neighbor]) {\n\t\t\tdfs(graph, neighbor, visited);\n\t\t}\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Depth-First Search implementation'
                },
                {
                    label: 'bfs',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'void bfs(vector<vector<int>>& graph, int start) {\n\tint n = graph.size();\n\tvector<bool> visited(n, false);\n\tqueue<int> q;\n\tq.push(start);\n\tvisited[start] = true;\n\twhile (!q.empty()) {\n\t\tint node = q.front();\n\t\tq.pop();\n\t\t// Process node\n\t\tcout << node << " ";\n\t\tfor (int neighbor : graph[node]) {\n\t\t\tif (!visited[neighbor]) {\n\t\t\t\tvisited[neighbor] = true;\n\t\t\t\tq.push(neighbor);\n\t\t\t}\n\t\t}\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Breadth-First Search implementation'
                },
                {
                    label: 'merge-sort',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'void merge(vector<int>& arr, int l, int m, int r) {\n\tint n1 = m - l + 1;\n\tint n2 = r - m;\n\tvector<int> L(n1), R(n2);\n\tfor (int i = 0; i < n1; i++)\n\t\tL[i] = arr[l + i];\n\tfor (int j = 0; j < n2; j++)\n\t\tR[j] = arr[m + 1 + j];\n\tint i = 0, j = 0, k = l;\n\twhile (i < n1 && j < n2) {\n\t\tif (L[i] <= R[j]) {\n\t\t\tarr[k] = L[i];\n\t\t\ti++;\n\t\t} else {\n\t\t\tarr[k] = R[j];\n\t\t\tj++;\n\t\t}\n\t\tk++;\n\t}\n\twhile (i < n1) {\n\t\tarr[k] = L[i];\n\t\ti++;\n\t\tk++;\n\t}\n\twhile (j < n2) {\n\t\tarr[k] = R[j];\n\t\tj++;\n\t\tk++;\n\t}\n}\n\nvoid mergeSort(vector<int>& arr, int l, int r) {\n\tif (l < r) {\n\t\tint m = l + (r - l) / 2;\n\t\tmergeSort(arr, l, m);\n\t\tmergeSort(arr, m + 1, r);\n\t\tmerge(arr, l, m, r);\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Merge Sort implementation'
                },
                {
                    label: 'quick-sort',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'int partition(vector<int>& arr, int low, int high) {\n\tint pivot = arr[high];\n\tint i = low - 1;\n\tfor (int j = low; j < high; j++) {\n\t\tif (arr[j] <= pivot) {\n\t\t\ti++;\n\t\t\tswap(arr[i], arr[j]);\n\t\t}\n\t}\n\tswap(arr[i + 1], arr[high]);\n\treturn i + 1;\n}\n\nvoid quickSort(vector<int>& arr, int low, int high) {\n\tif (low < high) {\n\t\tint pi = partition(arr, low, high);\n\t\tquickSort(arr, low, pi - 1);\n\t\tquickSort(arr, pi + 1, high);\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Quick Sort implementation'
                },
                {
                    label: 'fast-io',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'ios_base::sync_with_stdio(false);\ncin.tie(NULL);',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Fast I/O setup for competitive programming'
                },
                {
                    label: 'gcd',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'int gcd(int a, int b) {\n\tif (b == 0)\n\t\treturn a;\n\treturn gcd(b, a % b);\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Greatest Common Divisor function'
                },
                {
                    label: 'lcm',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'int lcm(int a, int b) {\n\treturn (a * b) / gcd(a, b);\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Least Common Multiple function'
                },
                {
                    label: 'powmod',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'long long powmod(long long base, long long exp, long long mod) {\n\tlong long result = 1;\n\tbase %= mod;\n\twhile (exp > 0) {\n\t\tif (exp & 1)\n\t\t\tresult = (result * base) % mod;\n\t\texp >>= 1;\n\t\tbase = (base * base) % mod;\n\t}\n\treturn result;\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Fast modular exponentiation'
                },
                {
                    label: 'sieve',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'vector<bool> sieveOfEratosthenes(int n) {\n\tvector<bool> isPrime(n+1, true);\n\tisPrime[0] = isPrime[1] = false;\n\tfor (int i = 2; i * i <= n; i++) {\n\t\tif (isPrime[i]) {\n\t\t\tfor (int j = i * i; j <= n; j += i)\n\t\t\t\tisPrime[j] = false;\n\t\t}\n\t}\n\treturn isPrime;\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Sieve of Eratosthenes for prime numbers'
                },
                {
                    label: 'adj-list',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'vector<vector<int>> adjList(${1:n});\n// Add edges\n// adjList[u].push_back(v);',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create an adjacency list for graph'
                },
                {
                    label: 'adj-matrix',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'vector<vector<int>> adjMatrix(${1:n}, vector<int>(${1:n}, 0));\n// Add edges\n// adjMatrix[u][v] = 1;',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create an adjacency matrix for graph'
                },
                {
                    label: 'custom-sort',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'sort(${1:vec}.begin(), ${1:vec}.end(), [](const ${2:int}& a, const ${2:int}& b) {\n\treturn ${3:a < b};\n});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Custom sort with lambda function'
                },
                {
                    label: 'test-cases',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'int t;\ncin >> t;\nwhile (t--) {\n\t${1}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Template for multiple test cases'
                }
                // More suggestions...
            ];

            return { suggestions: suggestions };
        }
    });

    // Java autocompletion
    monaco.languages.registerCompletionItemProvider('java', {
        provideCompletionItems: function (model, position) {
            const suggestions = [
                {
                    label: 'sout',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'System.out.println(${1:value});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Print to console'
                },
                {
                    label: 'for',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'For loop'
                },
                {
                    label: 'foreach',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'for (${1:Type} ${2:item} : ${3:collection}) {\n\t${4}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'For each loop'
                },
                {
                    label: 'if',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'if (${1:condition}) {\n\t${2}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If statement'
                },
                {
                    label: 'ifelse',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If-else statement'
                },
                {
                    label: 'try',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'try {\n\t${1}\n} catch (${2:Exception} e) {\n\t${3}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Try-catch block'
                },
                // Additional Java DSA autocompletions
                {
                    label: 'imports-dsa',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'import java.util.*;\nimport java.io.*;\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Common imports for DSA'
                },
                {
                    label: 'fast-io',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\nStringTokenizer st = new StringTokenizer(br.readLine());\n',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Fast I/O for competitive programming'
                },
                {
                    label: 'arraylist',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'ArrayList<${1:Integer}> ${2:list} = new ArrayList<>();',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create an ArrayList'
                },
                {
                    label: 'hashmap',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'HashMap<${1:Integer}, ${2:Integer}> ${3:map} = new HashMap<>();',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create a HashMap'
                },
                {
                    label: 'hashset',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'HashSet<${1:Integer}> ${2:set} = new HashSet<>();',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create a HashSet'
                },
                {
                    label: 'pqueue',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'PriorityQueue<${1:Integer}> ${2:pq} = new PriorityQueue<>();',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create a min PriorityQueue'
                },
                {
                    label: 'pqueue-max',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'PriorityQueue<${1:Integer}> ${2:pq} = new PriorityQueue<>(Collections.reverseOrder());',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create a max PriorityQueue'
                },
                {
                    label: 'binary-search',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'int binarySearch(int[] arr, int target) {\n\tint left = 0, right = arr.length - 1;\n\twhile (left <= right) {\n\t\tint mid = left + (right - left) / 2;\n\t\tif (arr[mid] == target)\n\t\t\treturn mid;\n\t\telse if (arr[mid] < target)\n\t\t\tleft = mid + 1;\n\t\telse\n\t\t\tright = mid - 1;\n\t}\n\treturn -1; // Not found\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Binary search implementation'
                },
                {
                    label: 'comparator',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'Collections.sort(${1:list}, new Comparator<${2:Integer}>() {\n\t@Override\n\tpublic int compare(${2:Integer} a, ${2:Integer} b) {\n\t\treturn ${3:a - b};\n\t}\n});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Sort with custom comparator'
                },
                {
                    label: 'lambda-sort',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'Collections.sort(${1:list}, (a, b) -> ${2:a - b});',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Sort with lambda comparator'
                },
                {
                    label: 'bfs',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'void bfs(ArrayList<ArrayList<Integer>> graph, int start) {\n\tboolean[] visited = new boolean[graph.size()];\n\tQueue<Integer> queue = new LinkedList<>();\n\tvisited[start] = true;\n\tqueue.add(start);\n\twhile (!queue.isEmpty()) {\n\t\tint node = queue.poll();\n\t\tSystem.out.print(node + " ");\n\t\tfor (int neighbor : graph.get(node)) {\n\t\t\tif (!visited[neighbor]) {\n\t\t\t\tvisited[neighbor] = true;\n\t\t\t\tqueue.add(neighbor);\n\t\t\t}\n\t\t}\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Breadth-First Search implementation'
                },
                {
                    label: 'dfs',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'void dfs(ArrayList<ArrayList<Integer>> graph, int node, boolean[] visited) {\n\tvisited[node] = true;\n\tSystem.out.print(node + " ");\n\tfor (int neighbor : graph.get(node)) {\n\t\tif (!visited[neighbor]) {\n\t\t\tdfs(graph, neighbor, visited);\n\t\t}\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Depth-First Search implementation'
                },
                {
                    label: 'graph',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'ArrayList<ArrayList<Integer>> graph = new ArrayList<>();\nfor (int i = 0; i < ${1:n}; i++) {\n\tgraph.add(new ArrayList<>());\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Create adjacency list for graph'
                },
                {
                    label: 'gcd',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'int gcd(int a, int b) {\n\tif (b == 0)\n\t\treturn a;\n\treturn gcd(b, a % b);\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Greatest Common Divisor function'
                },
                {
                    label: 'class-solution',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'class Solution {\n\tpublic ${1:int} ${2:methodName}(${3:params}) {\n\t\t${4}\n\t}\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Solution class template for coding platforms'
                }
            ];

            return { suggestions: suggestions };
        }
    });
}