import React, { useState, useEffect } from 'react';
import { ProjectList } from '../components/ProjectList';
import { Project } from '../types/project';

const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        name: 'My First GAS Project',
        scriptId: 'script-id-1',
        lastModified: '2025-11-20T10:00:00Z',
        url: 'https://script.google.com/d/script-id-1/edit'
    },
    {
        id: '2',
        name: 'Automated Report Generator',
        scriptId: 'script-id-2',
        lastModified: '2025-11-19T15:30:00Z',
        url: 'https://script.google.com/d/script-id-2/edit'
    },
    {
        id: '3',
        name: 'Slack Bot Integration',
        scriptId: 'script-id-3',
        lastModified: '2025-11-18T09:15:00Z',
        url: 'https://script.google.com/d/script-id-3/edit'
    }
];

const App: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        // Simulate fetching data
        setProjects(MOCK_PROJECTS);
    }, []);

    const handleProjectClick = (project: Project) => {
        console.log('Opening project:', project);
        // In a real extension, this would open a new tab or navigate to the editor
        // For now, we'll just log it.
        // window.open(project.url, '_blank');
    };

    return (
        <div className="w-80 bg-white min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <h1 className="text-lg font-bold">GAS4U Projects</h1>
            </header>
            <main className="flex-grow overflow-y-auto">
                <ProjectList projects={projects} onProjectClick={handleProjectClick} />
            </main>
            <footer className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500">
                GAS4U Extension v0.1.0
            </footer>
        </div>
    );
};

export default App;
