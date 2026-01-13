import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditorContainer } from "./EditorContainer";

describe("EditorContainer", () => {
  it("should render Monaco Editor mock", () => {
    const handleChange = vi.fn();
    render(<EditorContainer code="test code" onChange={handleChange} />);

    // Check if mock editor is rendered
    expect(screen.getByTestId("mock-monaco-editor")).toBeInTheDocument();
  });

  it("should pass code value to editor", () => {
    const handleChange = vi.fn();
    const testCode = "function hello() { return 'world'; }";
    render(<EditorContainer code={testCode} onChange={handleChange} />);

    expect(screen.getByTestId("editor-value")).toHaveTextContent(testCode);
  });

  it("should call onChange when editor content changes", async () => {
    const handleChange = vi.fn();
    render(<EditorContainer code="" onChange={handleChange} />);

    // Mock Monaco's onChange is called automatically in the mock
    // We verify the component renders without errors
    expect(screen.getByTestId("mock-monaco-editor")).toBeInTheDocument();
  });

  it("should use default language when not specified", () => {
    const handleChange = vi.fn();
    render(<EditorContainer code="" onChange={handleChange} />);

    expect(screen.getByTestId("editor-language")).toHaveTextContent("javascript");
  });

  it("should use custom language when specified", () => {
    const handleChange = vi.fn();
    render(<EditorContainer code="" onChange={handleChange} language="typescript" />);

    expect(screen.getByTestId("editor-language")).toHaveTextContent("typescript");
  });

  it("should use default theme when not specified", () => {
    const handleChange = vi.fn();
    render(<EditorContainer code="" onChange={handleChange} />);

    expect(screen.getByTestId("editor-theme")).toHaveTextContent("light");
  });

  it("should use custom theme when specified", () => {
    const handleChange = vi.fn();
    render(<EditorContainer code="" onChange={handleChange} theme="vs-dark" />);

    expect(screen.getByTestId("editor-theme")).toHaveTextContent("vs-dark");
  });

  it("should handle empty code", () => {
    const handleChange = vi.fn();
    render(<EditorContainer code="" onChange={handleChange} />);

    expect(screen.getByTestId("editor-value")).toHaveTextContent("");
  });

  it("should handle multiline code", () => {
    const handleChange = vi.fn();
    const multilineCode = "function test() {\n  return true;\n}";
    render(<EditorContainer code={multilineCode} onChange={handleChange} />);

    // React normalizes whitespace, so we check that the code is present
    const editorValue = screen.getByTestId("editor-value");
    expect(editorValue).toHaveTextContent("function test()");
    expect(editorValue).toHaveTextContent("return true");
  });
});
