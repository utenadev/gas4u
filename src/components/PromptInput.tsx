import type React from "react";
import { useState } from "react";
import { Spinner } from "./Spinner";

type PromptInputProps = {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
};

const LIGHTNING_ICON = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

function getInputClassName(disabled: boolean): string {
  const base =
    "block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm";
  return disabled ? `${base} opacity-50 cursor-not-allowed` : base;
}

function getButtonClassName(isDisabled: boolean): string {
  const base =
    "px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center gap-2";
  return isDisabled
    ? `${base} bg-slate-100 text-slate-400 cursor-not-allowed`
    : `${base} bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md hover:translate-y-[-1px]`;
}

export function PromptInput({
  onSubmit,
  isLoading = false,
  placeholder = "Describe what you want to do...",
}: PromptInputProps): React.ReactElement {
  const [prompt, setPrompt] = useState("");

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt && !isLoading) {
      onSubmit(trimmedPrompt);
      setPrompt("");
    }
  }

  const isButtonDisabled = isLoading || !prompt.trim();

  return (
    <div className="w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {LIGHTNING_ICON}
          </div>
          <input
            type="text"
            className={getInputClassName(isLoading)}
            placeholder={placeholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={getButtonClassName(isButtonDisabled)}
        >
          {isLoading ? (
            <>
              <Spinner className="-ml-1 mr-2 text-white" />
              Generating...
            </>
          ) : (
            <>
              Generate
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
