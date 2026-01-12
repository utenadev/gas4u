import { useEffect, useState } from "react";
import { StorageManager } from "../lib/storage/manager";

export const App = () => {
	const [apiKey, setApiKey] = useState("");
	const [status, setStatus] = useState<string>("");

	useEffect(() => {
		StorageManager.getApiKey().then((key) => {
			if (key) setApiKey(key);
		});
	}, []);

	const handleSave = async () => {
		try {
			await StorageManager.setApiKey(apiKey);
			setStatus("Saved successfully!");
			setTimeout(() => setStatus(""), 2000);
		} catch (error) {
			console.error(error);
			setStatus("Error saving settings.");
		}
	};

	return (
		<div className="w-80 p-5 flex flex-col gap-5 bg-slate-50 h-full font-sans">
			<header className="flex items-center gap-3 border-b border-slate-200 pb-4">
				<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
					<span className="text-white font-bold text-lg">G</span>
				</div>
				<div>
					<h1 className="text-lg font-bold text-slate-800 leading-tight">
						GAS4U
					</h1>
					<p className="text-xs text-slate-500 font-medium">
						AI coding assistant
					</p>
				</div>
			</header>

			<div className="flex flex-col gap-1.5">
				<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
					Gemini API Key
				</label>
				<div className="relative">
					<input
						type="password"
						className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm"
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
						placeholder="Paste your API Key here"
					/>
					<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
							/>
						</svg>
					</div>
				</div>
				<p className="text-xs text-slate-400 mt-1">
					Get your free API key from{" "}
					<a
						href="https://aistudio.google.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
					>
						Google AI Studio
					</a>
					.
				</p>
			</div>

			<button
				onClick={handleSave}
				className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-semibold text-sm shadow-md shadow-blue-100 flex items-center justify-center gap-2"
			>
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 13l4 4L19 7"
					/>
				</svg>
				Save Settings
			</button>

			{status && (
				<div
					className={`text-xs font-medium text-center p-2.5 rounded-lg flex items-center justify-center gap-2 animate-fade-in ${status.includes("Error") ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"}`}
				>
					{status.includes("Error") ? (
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					) : (
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					)}
					{status}
				</div>
			)}

			<footer className="mt-auto border-t border-slate-200 pt-4 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-medium">
				<span>Version 1.0.0</span>
				<span>utenadev</span>
			</footer>
		</div>
	);
};
