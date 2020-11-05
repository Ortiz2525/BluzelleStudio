import React, { Fragment, useEffect, useState } from "react"

import useCRUDService from "../../services/CRUDService"
import useCommandQueueService from "../../services/CommandQueueService"

import KeyListItem from "./KeyListItem"
import NewKeyField from "./NewKey/NewKeyField"
import RenameKeyField from "./NewKey/RenameKeyField"
import useImportCSV from "./importCSV"
import useExportCSV from "./exportCSV"
import loadingBar from "../loadingBar"

import useData from "components/DataContext/useData"

const KeyList = () => {
    const [showNewKey, setShowNewKey] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("")
    const {
        removePreviousHistory,
        updateHistoryMessage,
        revert,
    } = useCommandQueueService()
    const { removeAll } = useCRUDService()
    const importCSV = useImportCSV()
    const exportCSV = useExportCSV()

    const {
        keys,
        setKeys,
        commandQueue,
        setCommandQueue,
        reload,
        refreshKeys,
        keyPrefix,
        setKeyPrefix,
        isBusy,
        isExistingAccount,
        renameKey,
        setRenameKey,
    } = useData()

    useEffect(() => {
        setIsLoading(true)

        refreshKeys().then(() => {
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        if (commandQueue === undefined) {
            const newCommandQueue = [
                {
                    message: "Initial state",
                    revert,
                },
            ]
            setCommandQueue(newCommandQueue)
        }
    }, [commandQueue])

    const doRemoveAll = () => {
        setIsLoading(true)

        removeAll().then(() => {
            setIsLoading(false)
        })
    }

    const executeReload = () => {
        setIsLoading(true)

        reload().then(() => {
            setIsLoading(false)

            removePreviousHistory()
            updateHistoryMessage("Reload")
        })
    }

    const keyList = keys.sort().map((keyname) => {
        return keyname !== renameKey ? (
            <KeyListItem key={keyname} keyname={keyname} />
        ) : (
            <RenameKeyField
                key={keyname}
                keyname={keyname}
                onChange={() => setRenameKey(undefined)}
            />
        )
    })

    const actualKeysList = (
        <BS.ListGroup>
            {keyList}

            {keyList.length === 0 && !showNewKey && (
                <h5
                    style={{
                        fontStyle: "italic",
                        color: "#999999",
                    }}>
                    No fields...
                </h5>
            )}

            {showNewKey && (
                <NewKeyField onChange={() => setShowNewKey(false)} />
            )}
        </BS.ListGroup>
    )

    const _handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setKeyPrefix(filter)
        }
    }

    return (
        <Fragment>
            <div style={{ padding: 10 }}>
                <BS.InputGroup>
                    <BS.Input
                        type='text'
                        name='key_prefix'
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        onKeyDown={_handleKeyDown}
                        placeholder='Enter key prefix to filter...'
                    />
                    <BS.InputGroupAddon addonType='append'>
                        <BS.Button
                            outline
                            color='danger'
                            type='button'
                            id='clearButton'
                            disabled={filter == ""}
                            onClick={() => {
                                setFilter("")
                                setKeyPrefix("")
                            }}>
                            <i className='fa fa-times-circle'></i>
                        </BS.Button>

                        <BS.Button
                            outline
                            color='primary'
                            type='button'
                            id='filterButton'
                            disabled={
                                isBusy || (!keyPrefix && filter === keyPrefix)
                            }
                            onClick={() => setKeyPrefix(filter)}>
                            <i className='fa fa-filter'></i>
                        </BS.Button>

                        <BS.UncontrolledTooltip
                            placement='top'
                            target='filterButton'>
                            Set filter
                        </BS.UncontrolledTooltip>
                    </BS.InputGroupAddon>
                </BS.InputGroup>
            </div>
            <div style={{ padding: 10 }}>
                <BS.ButtonToolbar
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                    }}>
                    <BS.ButtonGroup
                        style={{ paddingRight: 5, paddingBottom: 5 }}>
                        {isExistingAccount && (
                            <>
                                <BS.Button
                                    outline
                                    color='success'
                                    onClick={() => setShowNewKey(true)}
                                    disabled={isBusy || isLoading}
                                    id='addButton'>
                                    <i className='fas fa-plus'></i>
                                </BS.Button>

                                <BS.UncontrolledTooltip
                                    placement='top'
                                    target='addButton'>
                                    Add Key
                                </BS.UncontrolledTooltip>
                            </>
                        )}

                        <BS.Button
                            outline
                            color='info'
                            onClick={executeReload}
                            disabled={isBusy || isLoading}
                            id='refreshButton'>
                            <i className='fas fa-sync'></i>
                        </BS.Button>

                        <BS.UncontrolledTooltip
                            placement='top'
                            target='refreshButton'>
                            Reload Keys
                        </BS.UncontrolledTooltip>
                    </BS.ButtonGroup>

                    <BS.ButtonGroup style={{ paddingLeft: 5 }}>
                        {isExistingAccount && (
                            <>
                                <BS.Button
                                    outline
                                    id='importButton'
                                    color='primary'
                                    disabled={isBusy || isLoading}
                                    onClick={() =>
                                        importCSV(setIsLoading, setKeys)
                                    }>
                                    <i className='fas fa-file-import'></i>
                                </BS.Button>

                                <BS.UncontrolledTooltip
                                    placement='top'
                                    target='importButton'>
                                    Import CSV file
                                </BS.UncontrolledTooltip>
                            </>
                        )}

                        <BS.Button
                            outline
                            id='exportButton'
                            disabled={isBusy || isLoading}
                            color='secondary'
                            onClick={() =>
                                exportCSV(isLoading, setIsLoading, keys)
                            }>
                            <i className='fas fa-file-export'></i>
                        </BS.Button>

                        <BS.UncontrolledTooltip
                            placement='top'
                            target='exportButton'>
                            Export CSV file
                        </BS.UncontrolledTooltip>

                        {isExistingAccount && (
                            <>
                                <BS.Button
                                    outline
                                    id='clearButton'
                                    color='danger'
                                    disabled={isBusy || isLoading}
                                    onClick={doRemoveAll}>
                                    <i className='fas fa-ban'></i>
                                </BS.Button>

                                <BS.UncontrolledTooltip
                                    placement='top'
                                    target='clearButton'>
                                    Clear List
                                </BS.UncontrolledTooltip>
                            </>
                        )}
                    </BS.ButtonGroup>
                </BS.ButtonToolbar>
            </div>
            <hr />
            <div style={{ padding: 10 }}>
                {isLoading ? loadingBar : actualKeysList}
            </div>
        </Fragment>
    )
}

export default KeyList
