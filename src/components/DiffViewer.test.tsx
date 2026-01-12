import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DiffViewer } from './DiffViewer';

describe('DiffViewer', () => {
    it('should render original and modified content', () => {
        const original = 'const x = 1;';
        const modified = 'const x = 2;';

        render(<DiffViewer original={original} modified={modified} />);

        // Check if mock component is rendered
        expect(screen.getByTestId('mock-diff-editor')).toBeInTheDocument();

        // Check if content is passed to the mock
        expect(screen.getByTestId('original-value')).toHaveTextContent(original);
        expect(screen.getByTestId('modified-value')).toHaveTextContent(modified);
    });

    it('should handle empty strings', () => {
        render(<DiffViewer original="" modified="" />);
        expect(screen.getByTestId('mock-diff-editor')).toBeInTheDocument();
    });
});
