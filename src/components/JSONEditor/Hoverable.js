import React from "react";
import { useState } from "react";

const Hoverable = ({ children }) => {
    const [hovering, setHovering] = useState(false);

    return (
        <div
            style={{
                padding: 5,
                paddingRight: 0,
                background: this.state.hovering ? "#F9F9F9" : "#FFFFFF",
            }}
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}>
            {
                // Only works on single children
                React.cloneElement(children, { hovering })
            }
        </div>
    );
};

export default Hoverable;
