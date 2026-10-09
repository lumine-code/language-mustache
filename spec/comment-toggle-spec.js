describe("Mustache comment toggling", () => {
  let editor;

  beforeEach(async () => {
    for (const method of ["openExternal", "openPath", "showItemInFolder", "openApplication"])
      spyOn(lumine.shell, method).and.returnValue(Promise.resolve());
    spyOn(lumine.application, "openWindow").and.returnValue(Promise.resolve());
    await lumine.packages.activatePackage("language-mustache");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.html.mustache"));
  });

  afterEach(() => editor?.destroy());

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
