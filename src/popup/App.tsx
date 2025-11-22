import React, { useState, useEffect } from 'react';
import { ProjectList } from '../components/ProjectList';
import { Project } from '../types/project';

const App: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                    const response = await chrome.runtime.sendMessage({ type: 'GET_PROJECTS' });
                    if (response.error) {
                        setError(response.error);
                    } else {
                        // Convert GasProject to UI Project type
                        const uiProjects: Project[] = response.projects.map((p: any) => ({
                            id: p.id,
                            name: p.title,
                            scriptId: p.scriptId,
                            lastModified: new Date().toISOString(), // Mock date as API doesn't return it yet
                            url: `https://script.google.com/d/${p.scriptId}/edit`
                        }));
                        setProjects(uiProjects);
                    }
                } else {
                    // Fallback for web preview without extension context
                    console.warn('Chrome runtime not available, using mock data');
                    setProjects([
                        {
                            id: '1',
                            name: 'Mock Project (Web Preview)',
                            scriptId: 'mock-script-id',
                            lastModified: new Date().toISOString(),
                            url: '#'
                        }
                    ]);
                }
            } catch (err) {
                setError('Failed to load projects');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectClick = (project: Project) => {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
                type: 'OPEN_EDITOR',
                projectId: project.scriptId
            });
        } else {
            console.log('Open editor for:', project.scriptId);
            // For web preview, maybe navigate to editor route?
            window.location.href = `/src/editor/index.html?projectId=${project.scriptId}`;
        }
    };

    return (
        <div className="w-80 bg-white min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <h1 className="text-lg font-bold">GAS4U Projects</h1>
            </header>
            <main className="flex-grow overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-32 text-gray-500">
                        Loading...
                    </div>
                ) : error ? (
                    <div className="p-4 text-red-500 text-center">
                        {error}
                    </div>
                ) : (
                    <ProjectList projects={projects} onProjectClick={handleProjectClick} />
                )}
            </main>
            <footer className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500">
                GAS4U Extension v0.1.0
            </footer>
        </div>
    );
};

export default App;
