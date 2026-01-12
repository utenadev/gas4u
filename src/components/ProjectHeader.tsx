import type React from "react";

type ProjectHeaderProps = {
	scriptId: string;
	setScriptId: (id: string) => void;
	onLoadProject: () => void;
	onSaveProject: () => void;
	isLoadingProject: boolean;
	currentFileName: string;
};

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
	scriptId,
	setScriptId,
	onLoadProject,
	onSaveProject,
	isLoadingProject,
	currentFileName,
}) => {
	return (
		<div className="bg-white border-b border-slate-200 px-6 py-3 flex gap-4 items-center shadow-sm z-20">
			<div className="flex items-center gap-3 flex-1">
				<div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
					<span className="text-blue-600 font-bold text-lg">G</span>
				</div>
				<div className="flex flex-col">
					<span className="text-sm font-bold text-slate-700 leading-tight">
						GAS4U Project
					</span>
					<span className="text-xs text-slate-400">{currentFileName}.gs</span>
				</div>
			</div>

			<div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
				<input
					type="text"
					placeholder="Script ID"
					className="bg-transparent px-3 py-1.5 text-sm w-48 focus:outline-none text-slate-700 placeholder:text-slate-400"
					value={scriptId}
					onChange={(e) => setScriptId(e.target.value)}
				/>
				<button
					onClick={onLoadProject}
					disabled={isLoadingProject || !scriptId}
					className="px-4 py-1.5 bg-white hover:bg-slate-50 rounded-md text-sm font-medium text-slate-700 shadow-sm border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoadingProject ? (
						<span className="flex items-center gap-2">
							<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Loading
						</span>
					) : (
						"Load"
					)}
				</button>
			</div>

			<div className="border-l border-slate-200 h-8 mx-2"></div>

			<button
				onClick={onSaveProject}
				disabled={isLoadingProject || !scriptId}
				className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white shadow-sm shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
					/>
				</svg>
				Save to GAS
			</button>
		</div>
	);
};
