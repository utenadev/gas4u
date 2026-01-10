import React from 'react';
import { Project } from '../types/project';

interface ProjectItemProps {
    project: Project;
    onClick: (project: Project) => void;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project, onClick }) => {
    return (
        <div
            className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            onClick={() => onClick(project)}
        >
            <h3 className="text-sm font-medium text-gray-900 truncate">{project.name}</h3>
            <div className="mt-1 flex justify-between items-center">
                <span className="text-xs text-gray-500">Last modified: {new Date(project.lastModified).toLocaleDateString()}</span>
                <span className="text-xs text-blue-600 hover:text-blue-800">Open</span>
            </div>
        </div>
    );
};
