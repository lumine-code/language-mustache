; Text can occur at any nesting depth; all fragments form one HTML document.
((text) @injection.owner @injection.content
  (#set! injection.language "html")
  (#set! injection.combined))

; Annotation candidates are filtered by the target grammar.
((comment) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((text) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none"))

((comment) @injection.owner @injection.content
  (#set! injection.language "todo")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))