import React, { useState } from "react"

import loadingBar from "./loadingBar"
import useBluzelle from "../services/BluzelleService"

import useData from "./DataContext/useData"

const ExpiryBar = () => {
    const [expiry, setExpiry] = useState("")
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
    } = useData()

    const gas_info = {
        gas_price: gasPrice,
        max_gas: maxGas,
    }

    const expire = () => {
        const v = sanitizeExpiry(expiry)

        setExpiry("")

        setLoadingTTL(true)

        getClient()
            .renewLease(selectedKey, gas_info, { seconds: v })
            .catch((e) => {
                alert("Failure to set expiry. See console.")

                console.error(e)
            })
            .finally(reloadTTL)
    }

    const persist = () => {
        setLoadingTTL(true)

        setExpiry("")

        getClient()
            .renewLease(selectedKey, gas_info, { days: 365 })
            .catch((e) => {
                alert("Failure to persist key. See console.")

                console.error(e)
            })
            .finally(reloadTTL)
    }

    const renderTTL = (ttl) => {
        var d = Math.floor(ttl / (3600 * 24))
        var h = Math.floor((ttl % (3600 * 24)) / 3600)
        var m = Math.floor((ttl % 3600) / 60)
        var s = Math.floor((ttl % 3600) % 60)

        var dDisplay = d > 0 ? d + "d " : ""
        var hDisplay = h > 0 ? h + "h " : ""
        var mDisplay = m > 0 ? m + "m " : ""
        var sDisplay = s > 0 ? s + "s" : ""

        return dDisplay + hDisplay + mDisplay + sDisplay
        // return (ttl === 0 ? "0 (indefinite)" : ttl)
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
                        <BS.InputGroup
                            style={{ display: "flex", alignItems: "center" }}>
                            <BS.InputGroupAddon addonType='prepend'>
                                Expiry (s) :
                            </BS.InputGroupAddon>
                            <BS.Input
                                placeholder={renderTTL(activeTTL)}
                                onChange={(e) => setExpiry(e.target.value)}
                            />
                            <BS.InputGroupAddon addonType='append'>
                                <BS.Button
                                    outline
                                    color='primary'
                                    type='button'
                                    id='setExpiryButton'
                                    disabled={
                                        isBusy ||
                                        !(expiry && sanitizeExpiry(expiry))
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
                                    color='danger'
                                    type='button'
                                    id='permanentButton'
                                    disabled={isBusy || activeTTL === 0}
                                    onClick={persist}>
                                    <i className='fas fa-ban'></i>
                                </BS.Button>

                                <BS.UncontrolledTooltip
                                    placement='top'
                                    target='permanentButton'>
                                    Make this field permanent (1 yr) <br />
                                    Be careful when setting the key as permanent
                                    as it requires a lot of gas!
                                </BS.UncontrolledTooltip>
                            </BS.InputGroupAddon>
                        </BS.InputGroup>
                    )}
                </BS.CardBody>
            </BS.Card>
        </div>
    )
}

export default ExpiryBar
