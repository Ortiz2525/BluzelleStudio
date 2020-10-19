import React from "react";

import useCRUDService from "../../services/CRUDService";
import useCommandQueueService from "../../services/CommandQueueService";

import loadingBar from "../loadingBar";

const KeyListItem = ({ keyname }) => {
    const { selectedKey, setSelectedKey, tempKeys } = useData();
    const { execute } = useCommandQueueService();
    const { rename } = useCRUDService();

    const select = (target) => {
        const old = selectedKey;

        execute({
            doIt: () => Promise.resolve(setSelectedKey(target)),
            undoIt: () => Promise.resolve(setSelectedKey(old)),
            message: (
                <span>
                    Selected <code key={1}>{target}</code>.
                </span>
            ),
        });
    };

    const renameKey = (newKey) => {
        execute({
            doIt: () => rename(keyname, newKey),
            undoIt: () => rename(newKey, keyname),
            message: (
                <span>
                    Renamed <code key={1}>{keyname}</code> to{" "}
                    <code key={2}>{newKey}</code>.
                </span>
            ),
        });
    };

    return (
        <BS.ListGroupItem
            onClick={() => {
                if (tempKeys.includes(keyname)) return;

                selectedKey === keyname ? select(undefined) : select(keyname);
            }}
            active={selectedKey === keyname}>
            <span style={{ marginLeft: 15 }}>{keyname}</span>

            {tempKeys.includes(keyname) && loadingBar}

            {keyname === selectedKey && (
                <i
                    style={{
                        float: "right",
                        lineHeight: "24px",
                    }}
                    className='fas fa-chevron-right'></i>
            )}
        </BS.ListGroupItem>
    );
};

export default KeyListItem;
