import React from 'react';
import { Project } from '../types/project';
import { ProjectItem } from './ProjectItem';

interface ProjectListProps {
    projects: Project[];
    onProjectClick: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectClick }) => {
    if (projects.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                No projects found.
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-200">
            {projects.map((project) => (
                <ProjectItem
                    key={project.id}
                    project={project}
                    onClick={onProjectClick}
                />
            ))}
        </div>
    );
};
