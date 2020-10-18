import React, { useState } from "react";
import {
    commandQueue,
    undo,
    redo,
    canUndo,
    canRedo,
    currentPosition,
} from "../services/CommandQueueService";

const CommandControls = () => {
    const [show, setShow] = useState(false);

    const undoButton = (
        <BS.Button outline color='primary' onClick={undo} disabled={!canUndo()}>
            <i className='fas fa-chevron-left'></i>
        </BS.Button>
    );

    const redoButton = (
        <BS.Button outline color='primary' onClick={redo} disabled={!canRedo()}>
            <i className='fas fa-chevron-right'></i>
        </BS.Button>
    );

    const undoRedo = (
        <BS.ButtonGroup style={{ marginRight: 10 }}>
            {undoButton}
            {redoButton}
        </BS.ButtonGroup>
    );

    const historyButton = (
        <BS.Button
            color='info'
            style={{ marginRight: 10 }}
            onClick={() => setShow(true)}>
            <i className='fas fa-history'></i>
        </BS.Button>
    );

    const closeButton = (
        <BS.Button
            outline
            color='secondary'
            style={{ float: "right" }}
            onClick={() => setShow(false)}>
            <i className='fas fa-times'></i>
        </BS.Button>
    );

    const historyList = commandQueue.map(({ revert, message }, index) => (
        <BS.ListGroupItem
            onClick={revert}
            key={index}
            active={currentPosition.get() === index}>
            {message}
        </BS.ListGroupItem>
    ));

    return (
        <div style={{ padding: 10 }}>
            {undoRedo}
            {historyButton}

            <BS.Modal
                isOpen={show}
                toggle={() => setShow(!show)}
                onHide={() => setShow(false)}>
                <div style={{ padding: 10 }}>
                    {undoRedo}
                    {closeButton}
                </div>
                <div style={{ fontFamily: "monospace" }}>
                    <BS.ListGroup style={{ margin: 0 }}>
                        {historyList}
                    </BS.ListGroup>
                </div>
            </BS.Modal>
        </div>
    );
};

export default CommandControls;
