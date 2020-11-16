import KeyListItem from "components/KeyList/KeyListItem"
import RenameKeyField from "components/KeyList/NewKey/RenameKeyField"
import React, { useEffect, useState } from "react"

const Collapsible = (props) => {
    const [collapsed, setCollapsed] = useState(props.collapsed || false)

    useEffect(() => {
        setCollapsed(props.collapsed || false)
    }, [props.collapsed])

    const toggleCollapse = () => {
        setCollapsed(!collapsed)
    }

    const collapseTriangle = collapsed
        ? "fas fa-caret-right"
        : "fas fa-caret-down"

    return (
        <React.Fragment>
            <div style={{ height: props.label ? 60 : 40 }}>
                {props.preamble && (
                    <span style={{ marginRight: 5 }}>{props.preamble}:</span>
                )}
                <span
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginTop: 10,
                        marginBottom: 10,
                        height: "100%",
                    }}>
                    {props.info.keys && (
                        <i
                            onClick={toggleCollapse}
                            className={collapseTriangle}
                            style={{ paddingRight: 10 }}></i>
                    )}
                    {props.info.lease ? (
                        props.onChange ? (
                            <RenameKeyField
                                key={props.info.key}
                                keyname={props.info.key}
                                onChange={props.onChange}
                            />
                        ) : (
                            <KeyListItem
                                key={props.info.key}
                                keyname={props.info.key}
                                info={props.info}
                                style={{ flex: 1 }}
                            />
                        )
                    ) : (
                        props.label
                    )}
                </span>
                {props.buttons && props.buttons}
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
    )
}

export default Collapsible
