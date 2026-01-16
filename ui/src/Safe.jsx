export default function Safe({ children }) {
    try {
        return children;
    } catch (e) {
        console.error(e);
        return <div style={{ color: "red" }}>Rendering Error</div>;
    }
}
