import React from "react";
import {
    commandQueue,
    undo,
    redo,
    canUndo,
    canRedo,
    currentPosition,
} from "../services/CommandQueueService";

@observer
export class CommandControls extends Component {
    constructor(props) {
        super(props);

        this.state = { show: false };
    }

    render() {
        const undoButton = (
            <BS.Button
                outline
                color='primary'
                onClick={undo}
                disabled={!canUndo()}>
                <i className='fas fa-chevron-left'></i>
            </BS.Button>
        );

        const redoButton = (
            <BS.Button
                outline
                color='primary'
                onClick={redo}
                disabled={!canRedo()}>
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
                onClick={() => this.setState({ show: true })}>
                <i className='fas fa-history'></i>
            </BS.Button>
        );

        const closeButton = (
            <BS.Button
                outline
                color='secondary'
                style={{ float: "right" }}
                onClick={() => this.setState({ show: false })}>
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
                    isOpen={this.state.show}
                    toggle={() => this.setState({ show: !this.state.show })}
                    onHide={() => this.setState({ show: false })}>
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
    }
}
