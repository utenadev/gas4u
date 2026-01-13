import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PromptInput } from "./PromptInput";

describe("PromptInput", () => {
  it("should render input and button", () => {
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate/i })).toBeInTheDocument();
  });

  it("should call onSubmit with trimmed prompt", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /generate/i });

    await user.type(input, "  create a function  ");
    await user.click(button);

    expect(handleSubmit).toHaveBeenCalledWith("create a function");
    expect(input).toHaveValue("");
  });

  it("should not call onSubmit with empty prompt", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);

    const button = screen.getByRole("button", { name: /generate/i });
    await user.click(button);

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("should not call onSubmit when prompt is only whitespace", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: /generate/i }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("should disable input and button when loading", () => {
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} isLoading={true} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /generating/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    expect(screen.getByText(/generating/i)).toBeInTheDocument();
  });

  it("should disable button when input is empty", () => {
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);

    const button = screen.getByRole("button", { name: /generate/i });
    expect(button).toBeDisabled();
  });

  it("should enable button when input has text", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /generate/i });

    await user.type(input, "test");
    expect(button).toBeEnabled();
  });

  it("should submit on form submit", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test prompt");

    const form = screen.getByRole("textbox").closest("form");
    if (form) {
      await user.type(input, "{Enter}");
      expect(handleSubmit).toHaveBeenCalledWith("test prompt");
    }
  });

  it("should use custom placeholder", () => {
    const handleSubmit = vi.fn();
    render(
      <PromptInput onSubmit={handleSubmit} placeholder="Custom placeholder" />,
    );

    expect(screen.getByPlaceholderText("Custom placeholder")).toBeInTheDocument();
  });

  it("should clear input after successful submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test prompt");
    await user.click(screen.getByRole("button", { name: /generate/i }));

    expect(input).toHaveValue("");
  });
});
