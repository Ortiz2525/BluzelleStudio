import React, { useState } from "react";

const CollapsibleCard = (props) => {
    const [collapsed, setCollapsed] = useState(props.collapsed || false);

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    return (
        <BS.Card>
            <BS.CardBody>
                <BS.CardTitle style={{ marginBottom: 0 }}>
                    <span
                        style={{ display: "inline-block", width: 30 }}
                        onClick={toggle}>
                        {collapsed ? (
                            <i className='fas fa-caret-right'></i>
                        ) : (
                            <i className='fas fa-caret-down'></i>
                        )}
                    </span>
                    {props.title}
                </BS.CardTitle>

                <BS.Collapse isOpen={!collapsed}>
                    <div style={{ height: 20 }}></div>
                    {props.children}
                </BS.Collapse>
            </BS.CardBody>
        </BS.Card>
    );
};

export default CollapsibleCard;
