// Used because preact can't render an array.
export const TransparentContainer = ({ children }) => (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {children}
    </div>
);
