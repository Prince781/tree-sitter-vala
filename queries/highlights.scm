; highlights.scm

(comment) @comment
(type) @type
(unqualified_type) @type
(attribute) @attribute
(method_declaration (symbol (identifier) @function))
(creation_method_declaration (symbol (identifier) @constructor))
(enum_declaration (symbol) @type)
(enum_value (identifier) @constant)
(errordomain_declaration (symbol) @type)
(errorcode (identifier) @constant)
(constant_declaration (identifier) @constant)
(method_call_expression (member_access_expression (identifier) @function))
(parameter (identifier) @variable.parameter)
(property_declaration (symbol (identifier) @property))
(this_access) @variable.builtin
(base_access) @variable.builtin
(boolean) @constant.builtin
(character) @constant
(integer) @number
(null) @constant.builtin
(real) @number
(regex) @constant
(string) @string
(template_string) @string
(template_string_expression) @string.special
(verbatim_string) @string
[
 "var"
 "void"
] @type.builtin

[
 "abstract"
 "as"
 "async"
 "break"
 "case"
 "catch"
 "class"
 "const"
 "construct"
 "continue"
 "default"
 "do"
 "dynamic"
 "else"
 "enum"
 "errordomain"
 "extern"
 "finally"
 "for"
 "foreach"
 "get"
 "if"
 "in"
 "inline"
 "interface"
 "internal"
 "is"
 "lock"
 "namespace"
 "new"
 "not"
 "out"
 "override"
 "private"
 "protected"
 "public"
 "ref"
 "return"
 "set"
 "sizeof"
 "static"
 "struct"
 "switch"
 "throw"
 "throws"
 "try"
 "typeof"
 "unowned"
 "using"
 "virtual"
 "weak"
 "while"
 "yield"
] @keyword

[
 "="
 "+"
 "+="
 "-"
 "-="
 "|"
 "|="
 "&"
 "&="
 "^"
 "^="
 "/"
 "/="
 "*"
 "*="
 "%"
 "%="
 "<<"
 "<<="
 ">>"
 ">>="
 "."
 "?."
 "->"
 "!"
 "~"
 "??"
 "?"
 ":"
 "<"
 ">"
 "||"
 "&&"
] @operator

[
 ","
 ";"
] @punctuation.delimiter

[
 "("
 ")"
 "{"
 "}"
 "["
 "]"
] @punctuation.bracket
