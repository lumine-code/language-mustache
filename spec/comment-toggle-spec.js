describe("Mustache comment toggling", () => {
  let editor;

  beforeEach(async () => {
    jasmine.useRealClock();
    for (const method of ["openExternal", "openPath", "showItemInFolder", "openApplication"])
      spyOn(lumine.shell, method).and.returnValue(Promise.resolve());
    spyOn(lumine.application, "openWindow").and.returnValue(Promise.resolve());
    await lumine.packages.activatePackage("language-source");
    await lumine.packages.activatePackage("language-html");
    await lumine.packages.activatePackage("language-javascript");
    await lumine.packages.activatePackage("language-css");
    await lumine.packages.activatePackage("language-mustache");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.html.mustache"));
  });

  afterEach(() => editor?.destroy());

  it("keeps native template metadata when HTML and generic source settings are active", async () => {
    editor.setText("{{value}}");
    await editor.whenGrammarSettled();
    expect(await editor.getCommentDelimitersForBufferPosition([0, 0])).toEqual({
      line: undefined,
      block: ["{{!--", "--}}"],
    });
    await editor.toggleLineCommentsForBufferRows(0, 0);
    expect(editor.getText()).toBe("{{!-- {{value}} --}}");
    await editor.whenGrammarSettled();
    expect(editor.languageMode.tree.rootNode.descendantsOfType("comment").length).toBe(1);
    await editor.toggleLineCommentsForBufferRows(0, 0);
    expect(editor.getText()).toBe("{{value}}");
  });

  it("preserves JavaScript and CSS comment policies in embedded script and style bodies", async () => {
    for (const [source, scope, line, block] of [
      ["<script>\nconst value = 1;\n</script>", "source.js", "//", ["/*", "*/"]],
      ["<style>\na { color: red; }\n</style>", "source.css", undefined, ["/*", "*/"]],
    ]) {
      editor.setText(source);
      await editor.whenGrammarSettled();
      expect(editor.scopeDescriptorForBufferPosition([1, 1]).getScopesArray()).toContain(scope);
      expect(await editor.getCommentDelimitersForBufferPosition([1, 1])).toEqual({ line, block });
      await editor.toggleLineCommentsForBufferRows(1, 1);
      expect(editor.lineTextForBufferRow(1)).toMatch(line ? /^\/\// : /^\/\*/);
      await editor.toggleLineCommentsForBufferRows(1, 1);
      expect(editor.getText()).toBe(source);
    }
  });

  it("creates a complete native comment and removes both delimiters on a second toggle", async () => {
    editor.setText("Hello");
    await editor.languageMode.ready;
    editor.toggleLineCommentsInSelection();
    expect(editor.getText()).toBe("{{!-- Hello --}}");
    await editor.languageMode.atTransactionEnd();
    expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
    expect(editor.languageMode.tree.rootNode.descendantsOfType("comment").length).toBe(1);
    editor.toggleLineCommentsInSelection();
    expect(editor.getText()).toBe("Hello");
  });

  it("comments the complete template expression and following text", async () => {
    editor.setText("{{name}} tail");
    await editor.languageMode.ready;
    editor.toggleLineCommentsInSelection();
    expect(editor.getText()).toBe("{{!-- {{name}} tail --}}");
    await editor.languageMode.atTransactionEnd();
    expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
    const comments = editor.languageMode.tree.rootNode.descendantsOfType("comment");
    expect(comments.length).toBe(1);
    expect(comments[0].text).toBe(editor.getText());
    editor.toggleLineCommentsInSelection();
    expect(editor.getText()).toBe("{{name}} tail");
  });

  it("keeps an ordinary complete template comment valid", async () => {
    editor.setText("{{! note }}\n{{name}}");
    await editor.languageMode.ready;
    await editor.languageMode.atTransactionEnd();
    expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
    expect(editor.languageMode.tree.rootNode.descendantsOfType("comment").length).toBe(1);
  });
});
