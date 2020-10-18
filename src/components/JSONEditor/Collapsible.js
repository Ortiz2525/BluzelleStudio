import React, { useState } from "react";

const Collapsible = (props) => {
    const [collapsed, setCollapsed] = useState(props.collapsed || false);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const collapseTriangle = () => {
        return collapsed ? "chevron-right" : "chevron-down";
    };

    return (
        <React.Fragment>
            <div style={{ minHeight: 21 }}>
                {props.preamble && (
                    <span style={{ marginRight: 5 }}>{props.preamble}:</span>
                )}
                <span onClick={toggleCollapse}>
                    <BS.Glyphicon glyph={collapseTriangle()} /> {props.label}
                </span>
                {props.buttons}
            </div>
            <div
                style={{
                    paddingLeft: 20,
                    background: "white",
                    borderLeft: "1px solid #CCCCCC",
                }}>
                {collapsed || props.children}
            </div>
        </React.Fragment>
    );
};

export default Collapsible;
