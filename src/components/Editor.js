import React from "react"

import JSONEditor from "./JSONEditor"
import ExpiryBar from "./ExpiryBar"
import PlainTextEditor from "./PlainTextEditor"
import FileEditor from "./FileEditor/FileEditor"
import loadingBar from "./loadingBar"

import useData from "./DataContext/useData"
import useCRUDService from "services/CRUDService"
import useBluzelle from "services/BluzelleService"
import useCommandQueueService from "services/CommandQueueService"

const Editor = () => {
    const {
        activeValue,
        loadingValue,
        isOwner,
        isBusy,
        selectedKey,
        reload,
        setSelectedKey,
        setRenameKey,
    } = useData()

    const { execute } = useCommandQueueService()
    const { remove, save } = useCRUDService()
    const { getClient } = useBluzelle()

    const rename = () => {
        setRenameKey(selectedKey)
    }

    const showExpiryBar = activeValue !== undefined && !loadingValue

    const executeRemove = () => {
        const sk = selectedKey
        const val = activeValue

        execute({
            doIt: () => remove(),

            undoIt: () =>
                new Promise((resolve) => {
                    return getClient()
                        .create(sk, val)
                        .then(() =>
                            reload().then(() => {
                                setSelectedKey(sk)
                                resolve()
                            })
                        )
                        .catch(() =>
                            alert("Undo failed due to bluzelle network error.")
                        )
                }),

            message: (
                <span>
                    Removed key <code key={1}>{sk}</code>.
                </span>
            ),
        })
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}>
            {showExpiryBar && <ExpiryBar />}

            <div>
                <BS.ButtonGroup
                    style={{
                        paddingLeft: 10,
                        paddingBottom: 10,
                    }}>
                    {isOwner && activeValue !== undefined && (
                        <>
                            <BS.Button
                                outline
                                color='danger'
                                id='removeButton'
                                disabled={isBusy}
                                onClick={executeRemove}>
                                <i className='fas fa-times'></i>
                            </BS.Button>

                            <BS.UncontrolledTooltip
                                placement='top'
                                target='removeButton'>
                                Remove Key
                            </BS.UncontrolledTooltip>
                        </>
                    )}

                    {isOwner && activeValue !== undefined && (
                        <>
                            <BS.Button
                                outline
                                color='warning'
                                onClick={rename}
                                disabled={isBusy}
                                id='renameButton'>
                                <i className='fas fa-i-cursor'></i>
                            </BS.Button>

                            <BS.UncontrolledTooltip
                                placement='top'
                                target='renameButton'>
                                Rename Key
                            </BS.UncontrolledTooltip>
                        </>
                    )}

                    {isOwner && activeValue !== undefined && (
                        <>
                            <BS.Button
                                outline
                                color='success'
                                onClick={save}
                                disabled={isBusy}
                                id='saveButton'>
                                <i className='fas fa-save'></i>
                            </BS.Button>

                            <BS.UncontrolledTooltip
                                placement='top'
                                target='saveButton'>
                                Save Value
                            </BS.UncontrolledTooltip>
                        </>
                    )}
                </BS.ButtonGroup>
            </div>
            <Body />
            {showExpiryBar && (
                <div
                    style={{
                        fontStyle: "italic",
                        fontSize: "0.7em",
                        textAlign: "center",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}>
                    Actual database value may change. Refresh to see the most
                    up-to-date.
                </div>
            )}
        </div>
    )
}

const Body = () => {
    const { activeValue, loadingValue } = useData()

    if (activeValue instanceof Uint8Array) {
        return <FileEditor />
    }

    const type = typeof activeValue

    if (type === "string") {
        return <PlainTextEditor />
    }

    if (type === "object" || type === "boolean" || type === "number") {
        return <JSONEditor />
    }

    if (loadingValue) {
        return (
            <div style={{ textAlign: "center", padding: 15 }}>{loadingBar}</div>
        )
    }

    return <div></div>
}

export default Editor
