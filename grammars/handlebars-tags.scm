; Inline partials declare reusable template fragments. Calls and block helpers
; are references and deliberately do not appear as declarations.
(inline_partial
  (inline_partial_open (string_literal) @name
    (#set! symbol.strip "^['\"]|['\"]$"))) @definition.function
