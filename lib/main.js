let injectionRegistrations = [];

const SCOPE = "text.html.mustache";

exports.activate = function () {
  injectionRegistrations.push(
    lumine.grammars.addInjectionPoint(SCOPE, {
      type: "template",
      language: () => "html",
      content: (node) => node.descendantsOfType("text"),
    }),
  );
};

exports.consumeHyperlinkInjection = (hyperlink) => {
  return hyperlink.addInjectionPoint(SCOPE, { types: ["comment", "text"] });
};

exports.consumeTodoInjection = (todo) => {
  return todo.addInjectionPoint(SCOPE, { types: ["comment"] });
};

exports.deactivate = function () {
  for (const registration of injectionRegistrations.splice(0)) registration.dispose();
};
