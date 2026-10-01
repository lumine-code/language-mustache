const path = require("path");

describe("Mustache and Handlebars Tree-sitter grammar", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage(path.resolve(__dirname, "..", "..", "language-html"));
    await lumine.packages.activatePackage("language-mustache");
  });

  it("parses and highlights the sample template", async () => {
    const editor = await lumine.workspace.open(path.join(__dirname, "fixtures", "sample.hbs"));
    const languageMode = editor.getBuffer().getLanguageMode();
    await languageMode.ready;

    expect(editor.getGrammar().scopeName).toBe("text.html.mustache");
    expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
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

  it("keeps nested template text in one HTML document across a local edit", async () => {
    const editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.html.mustache"));
    editor.setText(
      "<section>{{#if visible}}<article>{{#each items}}<b>{{name}}</b>{{/each}}</article>{{/if}}</section>",
    );
    await editor.languageMode.ready;
    await editor.languageMode.atTransactionEnd();

    const assertHTML = () => {
      const layers = editor.languageMode
        .getAllInjectionLayers()
        .filter((layer) => layer.grammar.scopeName === "text.html.basic");
      expect(layers.length).toBe(1);
      expect(layers[0].tree.rootNode.hasError).toBe(false);
      const textNodes = editor.languageMode.tree.rootNode.descendantsOfType("text");
      expect(textNodes.length).toBe(6);
      expect(
        layers[0].getCurrentRanges().map((range) => editor.getTextInBufferRange(range)),
      ).toEqual(textNodes.map((node) => node.text));
    };
    assertHTML();

    const buffer = editor.getBuffer();
    const index = editor.getText().indexOf("<b>");
    buffer.setTextInRange(
      [buffer.positionForCharacterIndex(index), buffer.positionForCharacterIndex(index + 3)],
      '<b class="active">',
    );
    await editor.languageMode.atTransactionEnd();
    assertHTML();
    const point = buffer.positionForCharacterIndex(editor.getText().indexOf("active"));
    expect(editor.scopeDescriptorForBufferPosition(point).getScopesArray()).toContain(
      "string.quoted.double.html",
    );
  });
});
