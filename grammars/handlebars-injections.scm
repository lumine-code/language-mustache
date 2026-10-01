; Text can occur at any nesting depth; all fragments form one HTML document.
((text) @injection.owner @injection.content
  (#set! injection.language "html")
  (#set! injection.combined))
