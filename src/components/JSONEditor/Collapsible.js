import { useState } from "react";

const Collapsible = ({ children, collapsed, label, buttons, preamble }) => {
    const [collapsed, setCollapsed] = useState(collapsed || false);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const collapseTriangle = () => {
        return collapsed ? "chevron-right" : "chevron-down";
    };

    return (
        <React.Fragment>
            <div style={{ minHeight: 21 }}>
                {preamble && (
                    <span style={{ marginRight: 5 }}>{preamble}:</span>
                )}
                <span onClick={toggleCollapse}>
                    <BS.Glyphicon glyph={collapseTriangle()} /> {label}
                </span>
                {buttons}
            </div>
            <div
                style={{
                    paddingLeft: 20,
                    background: "white",
                    borderLeft: "1px solid #CCCCCC",
                }}>
                {collapsed || children}
            </div>
        </React.Fragment>
    );
};

export default Collapsible;
