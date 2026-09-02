const path = require("path");

describe("Mustache and Handlebars Tree-sitter grammar", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-html");
    await lumine.packages.activatePackage("language-mustache");
  });

  it("parses and highlights the sample template", async () => {
    const editor = await lumine.workspace.open(path.join(__dirname, "fixtures", "sample.hbs"));
    const languageMode = editor.getBuffer().getLanguageMode();
    await languageMode.ready;

    expect(editor.getGrammar().scopeName).toBe("text.html.mustache");
    expect(languageMode.tree.rootNode.hasError).toBe(false);
    expect(editor.scopeDescriptorForBufferPosition([0, 4]).getScopesArray()).toContain(
      "comment.block.mustache",
    );
    expect(editor.scopeDescriptorForBufferPosition([8, 13]).getScopesArray()).toContain(
      "variable.other.mustache",
    );
    expect(editor.scopeDescriptorForBufferPosition([19, 6]).getScopesArray()).toContain(
      "punctuation.definition.block.begin.mustache",
    );
  });

  it("registers HTML over the non-Handlebars text ranges", () => {
    const registrations = [];
    const previous = lumine.grammars.addInjectionPoint;
    lumine.grammars.addInjectionPoint = (scopeName, options) => {
      registrations.push({ scopeName, options });
      return { dispose() {} };
    };

    try {
      require("../lib/main").activate();
    } finally {
      lumine.grammars.addInjectionPoint = previous;
    }

    const injection = registrations.find(({ options }) => options.type === "template");
    const text = [{ type: "text" }, { type: "text" }];
    const node = { descendantsOfType: () => text };
    expect(injection.scopeName).toBe("text.html.mustache");
    expect(injection.options.language()).toBe("html");
    expect(injection.options.content(node)).toBe(text);
  });
});
