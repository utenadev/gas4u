import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProjectHeader } from "./ProjectHeader";

describe("ProjectHeader", () => {
  const defaultProps = {
    scriptId: "",
    setScriptId: vi.fn(),
    onLoadProject: vi.fn(),
    onSaveProject: vi.fn(),
    isLoadingProject: false,
    currentFileName: "Code",
  };

  it("should render header with project info", () => {
    render(<ProjectHeader {...defaultProps} />);

    expect(screen.getByText("GAS4U Project")).toBeInTheDocument();
    expect(screen.getByText("Code.gs")).toBeInTheDocument();
  });

  it("should render script ID input", () => {
    render(<ProjectHeader {...defaultProps} />);

    expect(screen.getByPlaceholderText("Script ID")).toBeInTheDocument();
  });

  it("should update script ID on input change", async () => {
    const user = userEvent.setup();
    const setScriptId = vi.fn();
    render(<ProjectHeader {...defaultProps} setScriptId={setScriptId} />);

    const input = screen.getByPlaceholderText("Script ID");
    await user.type(input, "test-script-id");

    expect(setScriptId).toHaveBeenCalled();
  });

  it("should disable Load button when no script ID", () => {
    render(<ProjectHeader {...defaultProps} />);

    const loadButton = screen.getByRole("button", { name: /load/i });
    expect(loadButton).toBeDisabled();
  });

  it("should enable Load button when script ID exists", () => {
    render(<ProjectHeader {...defaultProps} scriptId="test-id" />);

    const loadButton = screen.getByRole("button", { name: /load/i });
    expect(loadButton).toBeEnabled();
  });

  it("should disable Save button when no script ID", () => {
    render(<ProjectHeader {...defaultProps} />);

    const saveButton = screen.getByRole("button", { name: /save to gas/i });
    expect(saveButton).toBeDisabled();
  });

  it("should enable Save button when script ID exists", () => {
    render(<ProjectHeader {...defaultProps} scriptId="test-id" />);

    const saveButton = screen.getByRole("button", { name: /save to gas/i });
    expect(saveButton).toBeEnabled();
  });

  it("should call onLoadProject when Load button is clicked", async () => {
    const user = userEvent.setup();
    const onLoadProject = vi.fn();
    render(
      <ProjectHeader {...defaultProps} scriptId="test-id" onLoadProject={onLoadProject} />,
    );

    const loadButton = screen.getByRole("button", { name: /load/i });
    await user.click(loadButton);

    expect(onLoadProject).toHaveBeenCalled();
  });

  it("should call onSaveProject when Save button is clicked", async () => {
    const user = userEvent.setup();
    const onSaveProject = vi.fn();
    render(
      <ProjectHeader {...defaultProps} scriptId="test-id" onSaveProject={onSaveProject} />,
    );

    const saveButton = screen.getByRole("button", { name: /save to gas/i });
    await user.click(saveButton);

    expect(onSaveProject).toHaveBeenCalled();
  });

  it("should show Loading state when isLoadingProject is true", () => {
    render(<ProjectHeader {...defaultProps} isLoadingProject={true} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should disable buttons when loading", () => {
    render(
      <ProjectHeader {...defaultProps} scriptId="test-id" isLoadingProject={true} />,
    );

    const loadButton = screen.getByRole("button", { name: /loading/i });
    const saveButton = screen.getByRole("button", { name: /save to gas/i });

    expect(loadButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
  });

  it("should display current file name", () => {
    render(<ProjectHeader {...defaultProps} currentFileName="MyScript" />);

    expect(screen.getByText("MyScript.gs")).toBeInTheDocument();
  });
});
