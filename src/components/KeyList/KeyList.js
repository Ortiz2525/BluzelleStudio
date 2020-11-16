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
import Collapsible from "components/JSONEditor/Collapsible"

const KeyList = () => {
    const [showNewKey, setShowNewKey] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("")
    const [keyArray, setKeyArray] = useState({})
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

    useEffect(() => {
        if (keys.length) {
            let newKeyArray = {}

            const addToArray = (key, info, arr, parentKey = null) => {
                if (!key || key == "") return

                arr.keys = arr.keys ? arr.keys : {}

                if (key.includes(".")) {
                    const first = key.slice(0, key.indexOf("."))
                    const curKey = parentKey ? parentKey + "." + first : first

                    arr.keys[first] = {
                        ...arr.keys[first],
                        key: curKey,
                    }

                    addToArray(
                        key.slice(key.indexOf(".") + 1),
                        info,
                        arr.keys[first],
                        curKey
                    )
                } else {
                    arr.keys[key] = {
                        ...arr.keys[key],
                        ...info,
                    }
                }
            }

            keys.forEach((key) => {
                addToArray(key.key, key, newKeyArray)
            })

            console.log(newKeyArray)
            setKeyArray(newKeyArray)
        }
    }, [keys])

    const updateKeyPrefix = (filter) => {
        setIsLoading(true)

        setKeyPrefix(filter).finally(() => {
            setIsLoading(false)
        })
    }

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

    const keyList = keys.sort().map((key) => {
        return key.key !== renameKey ? (
            <KeyListItem key={key.key} keyname={key.key} />
        ) : (
            <RenameKeyField
                key={key.key}
                keyname={key.key}
                onChange={() => setRenameKey(undefined)}
            />
        )
    })

    const renderKeyList = (keylist) => {
        if (!keylist) return null
        return (
            <Collapsible
                label={keylist.key}
                key={keylist.key}
                info={keylist}
                onChange={
                    keylist.key == renameKey
                        ? () => setRenameKey(undefined)
                        : undefined
                }>
                {keylist.keys &&
                    Object.keys(keylist.keys).map((k) =>
                        renderKeyList(keylist.keys[k])
                    )}
            </Collapsible>
        )
    }

    const actualKeysList = (
        <BS.ListGroup>
            {renderKeyList(keyArray)}

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
            updateKeyPrefix(filter)
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
                        disabled={isBusy || isLoading}
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
                                updateKeyPrefix("")
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
                            onClick={() => updateKeyPrefix(filter)}>
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
