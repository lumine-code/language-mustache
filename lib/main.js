const SCOPE = "text.html.mustache";

exports.consumeHyperlinkInjection = (hyperlink) => {
  return hyperlink.addInjectionPoint(SCOPE, { types: ["comment", "text"] });
};

exports.consumeTodoInjection = (todo) => {
  return todo.addInjectionPoint(SCOPE, { types: ["comment"] });
};
