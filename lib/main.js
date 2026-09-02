const SCOPE = "text.html.mustache";

exports.activate = function () {
  lumine.grammars.addInjectionPoint(SCOPE, {
    type: "template",
    language: () => "html",
    content: (node) => node.descendantsOfType("text"),
  });
};

exports.consumeHyperlinkInjection = (hyperlink) => {
  hyperlink.addInjectionPoint(SCOPE, { types: ["comment", "text"] });
};

exports.consumeTodoInjection = (todo) => {
  todo.addInjectionPoint(SCOPE, { types: ["comment"] });
};
