import React, { useState } from "react"

import loadingBar from "./loadingBar"
import useBluzelle from "../services/BluzelleService"

import useData from "./DataContext/useData"

const ExpiryBar = () => {
    const [expiry, setExpiry] = useState("")

    const [d, setD] = useState(0)
    const [h, setH] = useState(0)
    const [m, setM] = useState(0)
    const [s, setS] = useState(0)

    const { getClient } = useBluzelle()

    const {
        selectedKey,
        activeTTL,
        loadingTTL,
        setLoadingTTL,
        reloadTTL,
        gasPrice,
        maxGas,
        isBusy,
        isExistingAccount,
        isOwner,
        setTxInfo,
    } = useData()

    const gas_info = {
        gas_price: gasPrice,
        max_gas: maxGas,
    }

    const expire = () => {
        const v = sanitizeExpiry(expiry)

        setExpiry("")

        setLoadingTTL(true)

        const lease_info = {
            days: d,
            hours: h,
            minutes: m,
            seconds: s,
        }
        console.log(lease_info)

        getClient()
            .renewLease(selectedKey, gas_info, lease_info)
            .then((result) => {
                setTxInfo(result)
            })
            .catch((ex) => {
                alert(
                    ex.error
                        ? ex.error
                        : "Failed due to bluzelle network error."
                )

                console.error(ex)
            })
            .finally(reloadTTL)
    }

    const persist = () => {
        setLoadingTTL(true)

        setExpiry("")

        getClient()
            .renewLease(selectedKey, gas_info, { days: 365 })
            .then((result) => {
                setTxInfo(result)
            })
            .catch((ex) => {
                alert(
                    ex.error
                        ? ex.error
                        : "Failed due to bluzelle network error."
                )

                console.error(ex)
            })
            .finally(reloadTTL)
    }

    const renderTTL = (ttl) => {
        var d = Math.floor(ttl / (3600 * 24))
        var h = Math.floor((ttl % (3600 * 24)) / 3600)
        var m = Math.floor((ttl % 3600) / 60)
        var s = Math.floor((ttl % 3600) % 60)

        return { d, h, m, s }
    }

    const sanitizeExpiry = (s) => {
        if (s === "") {
            return false
        }

        s = Number(s)

        if (s === NaN) {
            return false
        }

        if (s <= 0) {
            return false
        }

        if (!Number.isInteger(s)) {
            return false
        }

        return s
    }

    return (
        <div
            style={{
                padding: 10,
            }}>
            <BS.Card>
                <BS.CardBody>
                    {loadingTTL && (
                        <div style={{ textAlign: "center", padding: 15 }}>
                            {loadingBar}
                        </div>
                    )}
                    {!loadingTTL && (
                        <>
                            <div>
                                Current expiry: {renderTTL(activeTTL).d} days{" "}
                                {renderTTL(activeTTL).h} hours{" "}
                                {renderTTL(activeTTL).m} minutes{" "}
                                {renderTTL(activeTTL).s} seconds
                            </div>
                            {isOwner && isExistingAccount && (
                                <BS.InputGroup
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginTop: "10px",
                                    }}>
                                    <BS.InputGroupAddon addonType='prepend'>
                                        Expiry :
                                    </BS.InputGroupAddon>
                                    <BS.Input
                                        placeholder={0}
                                        disabled={
                                            !isOwner || !isExistingAccount
                                        }
                                        onChange={(e) =>
                                            setD(parseInt(e.target.value))
                                        }
                                        style={{ minWidth: "50px" }}
                                    />
                                    <span>{" d  "}</span>
                                    <BS.Input
                                        placeholder={0}
                                        disabled={
                                            !isOwner || !isExistingAccount
                                        }
                                        onChange={(e) =>
                                            setH(parseInt(e.target.value))
                                        }
                                        style={{ minWidth: "50px" }}
                                    />
                                    <span>{" h  "}</span>
                                    <BS.Input
                                        placeholder={0}
                                        disabled={
                                            !isOwner || !isExistingAccount
                                        }
                                        onChange={(e) =>
                                            setM(parseInt(e.target.value))
                                        }
                                        style={{ minWidth: "50px" }}
                                    />
                                    <span>{" m  "}</span>
                                    <BS.Input
                                        placeholder={0}
                                        disabled={
                                            !isOwner || !isExistingAccount
                                        }
                                        onChange={(e) =>
                                            setS(parseInt(e.target.value))
                                        }
                                        style={{ minWidth: "50px" }}
                                    />
                                    <span>{" s  "}</span>
                                    {isOwner && isExistingAccount && (
                                        <BS.InputGroupAddon
                                            addonType='append'
                                            style={{ marginLeft: "10px" }}>
                                            <BS.Button
                                                outline
                                                color='primary'
                                                type='button'
                                                id='setExpiryButton'
                                                disabled={
                                                    isBusy ||
                                                    (!d && !h && !m && !s)
                                                }
                                                onClick={expire}>
                                                <i className='fas fa-stopwatch'></i>
                                            </BS.Button>

                                            <BS.UncontrolledTooltip
                                                placement='top'
                                                target='setExpiryButton'>
                                                Set Expiry
                                            </BS.UncontrolledTooltip>

                                            <BS.Button
                                                outline
                                                color='success'
                                                type='button'
                                                id='permanentButton'
                                                disabled={
                                                    isBusy || activeTTL === 0
                                                }
                                                onClick={persist}>
                                                <i className='fa fa-clock'></i>
                                            </BS.Button>

                                            <BS.UncontrolledTooltip
                                                placement='top'
                                                target='permanentButton'>
                                                Make permanent (1 yr) <br />
                                                Requires a lot of gas!
                                            </BS.UncontrolledTooltip>
                                        </BS.InputGroupAddon>
                                    )}
                                </BS.InputGroup>
                            )}
                        </>
                    )}
                </BS.CardBody>
            </BS.Card>
        </div>
    )
}

export default ExpiryBar
