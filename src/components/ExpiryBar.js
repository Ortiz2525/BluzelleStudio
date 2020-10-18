import React, { useState } from "react";

import loadingBar from "./loadingBar";
import { getClient } from "../services/BluzelleService";

import useData from "./DataContext/useData";

export default ExpiryBar = () => {
    const [expiry, setExpiry] = useState("");

    const {
        selectedKey,
        activeTTL,
        loadingTTL,
        setLoadingTTL,
        reloadTTL,
    } = useData();

    const expire = () => {
        const v = sanitizeExpiry(expiry);

        setExpiry("");

        setLoadingTTL(true);

        getClient()
            .expire(selectedKey, v)
            .catch((e) => {
                alert("Failure to set expiry. See console.");

                console.error(e);
            })
            .finally(reloadTTL);
    };

    const persist = () => {
        setLoadingTTL(true);

        setExpiry("");

        getClient()
            .persist(selectedKey)
            .catch((e) => {
                alert("Failure to persist key. See console.");

                console.error(e);
            })
            .finally(reloadTTL);
    };

    const renderTTL = (ttl) => (ttl === 0 ? "0 (indefinite)" : ttl);

    const sanitizeExpiry = (s) => {
        if (s === "") {
            return false;
        }

        s = Number(s);

        if (s === NaN) {
            return false;
        }

        if (s <= 0) {
            return false;
        }

        if (!Number.isInteger(s)) {
            return false;
        }

        return s;
    };

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
                        <BS.InputGroup>
                            <BS.InputGroupAddon addonType='prepend'>
                                Expiry (s):{" "}
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
                                    disabled={
                                        !(expiry && sanitizeExpiry(expiry))
                                    }
                                    onClick={expire}>
                                    <i className='fas fa-stopwatch'></i>
                                </BS.Button>
                                <BS.Button
                                    outline
                                    color='danger'
                                    type='button'
                                    disabled={activeTTL === 0}
                                    onClick={persist}>
                                    <i className='fas fa-ban'></i>
                                </BS.Button>
                            </BS.InputGroupAddon>
                        </BS.InputGroup>
                    )}
                </BS.CardBody>
            </BS.Card>
        </div>
    );
};
