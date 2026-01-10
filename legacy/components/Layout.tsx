import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
    return (
        <div className={`min-h-screen bg-gray-50 ${className || ''}`}>
            {children}
        </div>
    );
};

export const Header = ({ children }: { children: React.ReactNode }) => (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        {children}
    </header>
);

export const Main = ({ children, className }: LayoutProps) => (
    <main className={`p-4 ${className || ''}`}>
        {children}
    </main>
);
