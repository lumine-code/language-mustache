(comment) @comment.block.mustache

(string_literal) @string.quoted.double.mustache
(number_literal) @constant.numeric.mustache
(boolean_literal) @constant.language.boolean.mustache
(null_literal) @constant.language.null.mustache

(identifier) @variable.other.mustache

(hash_pair
  (identifier) @variable.other.key.mustache)

(block_open
  "#" @punctuation.definition.block.begin.mustache
  (path_expression (identifier) @keyword.control.mustache))

(block_close
  "/" @punctuation.definition.block.end.mustache
  (path_expression (identifier) @keyword.control.mustache))

(else_block
  "else" @keyword.control.mustache)

(partial
  ">" @keyword.control.import.mustache)

(partial_block_open
  "#>" @keyword.control.import.mustache)

(decorator
  "*" @keyword.other.mustache)

(block_decorator_open
  "#*" @keyword.other.mustache)

(expression
  "&" @keyword.operator.mustache)

(subexpression
  "(" @punctuation.definition.arguments.begin.bracket.round.mustache
  ")" @punctuation.definition.arguments.end.bracket.round.mustache)

(block_params
  "as" @keyword.control.mustache
  "|" @punctuation.separator.parameters.mustache)

(path_expression
  ["this" "."] @variable.language.this.mustache)

(segment_literal
  "[" @punctuation.definition.segment.begin.bracket.square.mustache
  "]" @punctuation.definition.segment.end.bracket.square.mustache)

[
  "{{"
  "{{{"
  "{{{{"
  "{{{{/"
] @punctuation.definition.expression.begin.mustache

[
  "}}"
  "}}}"
  "}}}}"
] @punctuation.definition.expression.end.mustache

"~" @keyword.operator.trim.mustache
"=" @keyword.operator.assignment.mustache
"." @punctuation.accessor.mustache
