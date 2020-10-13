import { Fragment, useEffect } from "react";

import { getClient, hasClient } from "../services/BluzelleService";
import loadingBar from "./loadingBar";
import useData from "./DataContext/useData";

const Permissioning = () => {
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const { mnemonic, isWriter, setIsWriter, writers, setWriters } = useData();

    const refresh = () => {
        setLoading(true);

        getClient()
            ._getWriters()
            .then(
                (w) => {
                    setLoading(false);
                    setWriters(w);
                },
                (e) => {
                    setLoading(false);
                    alert("Failed to get writers.");
                    throw e;
                }
            );
    };

    const addWriter = () => {
        const pub = prompt(
            "Please enter the public key of the new writer.",
            "MFYwEAY..."
        );

        if (pub.length) {
            getClient()
                ._addWriters(pub)
                .then(
                    () => refresh(),
                    (e) => {
                        alert("Failed to add writer.");
                        throw e;
                    }
                );
        }
    };

    const deleteWriter = (writer) => {
        getClient()
            ._deleteWriters(writer)
            .then(
                () => refresh(),
                (e) => {
                    alert("Failed to delete writer.");
                    throw e;
                }
            );
    };

    const toggle = () => {
        setModal(!modal);
    };

    useEffect(() => {
        if (!hasClient()) return;

        if (mnemonic === writers.owner) {
            setIsWriter("owner");
        } else if (writers.writers.includes(mnemonic)) {
            setIsWriter("writer");
        } else {
            setIsWriter("read-only");
        }
    }, [mnemonic]);

    const render_mnemonic = (_mnemonic) => (
        <td>
            <code style={{ whiteSpace: "pre-wrap" }}>
                {_mnemonic === undefined ? "" : _mnemonic + " "}
            </code>
            {_mnemonic === mnemonic && <BS.Badge color='primary'>Me</BS.Badge>}
        </td>
    );

    return (
        <Fragment>
            {loading ? (
                <div style={{ marginBottom: 15 }}>{loadingBar}</div>
            ) : isWriter === "owner" ? (
                <BS.Alert color='success'>You are the database owner.</BS.Alert>
            ) : isWriter === "writer" ? (
                <BS.Alert color='primary'>
                    You can write to this database.
                </BS.Alert>
            ) : (
                <BS.Alert color='dark'>
                    You cannot write to this database.
                </BS.Alert>
            )}

            <BS.Table>
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope='row'>owner</th>
                        {render_mnemonic(writers.owner)}
                    </tr>
                    <tr>
                        <th scope='row'>writers</th>
                        {render_mnemonic(writers.writers[0])}
                    </tr>
                    {writers.writers.slice(1).map((w) => (
                        <tr key={w}>
                            <th scope='row'></th>
                            {render_mnemonic(w)}
                        </tr>
                    ))}
                </tbody>
            </BS.Table>

            <hr />

            <BS.ButtonToolbar>
                <BS.ButtonGroup>
                    {isWriter === "owner" && (
                        <BS.Button outline color='success' onClick={addWriter}>
                            <i className='fas fa-user-plus'></i>
                        </BS.Button>
                    )}

                    {isWriter === "owner" && (
                        <BS.Button outline color='danger' onClick={toggle}>
                            <i className='fas fa-user-minus'></i>
                        </BS.Button>
                    )}

                    <BS.Button outline color='info' onClick={refresh}>
                        <i className='fas fa-sync'></i>
                    </BS.Button>
                </BS.ButtonGroup>
            </BS.ButtonToolbar>

            <BS.Modal isOpen={modal} toggle={toggle}>
                <BS.ModalHeader toggle={toggle}>Delete Writers</BS.ModalHeader>
                <BS.ModalBody>
                    <BS.Alert color='secondary'>
                        Please click on the writer you want to remove.
                    </BS.Alert>

                    <BS.ListGroup>
                        {writers.writers.map((w) => (
                            <BS.ListGroupItem
                                key={w}
                                tag='button'
                                action
                                style={{ wordWrap: "break-word" }}
                                onClick={() => deleteWriter(w)}>
                                {w}
                            </BS.ListGroupItem>
                        ))}
                    </BS.ListGroup>

                    {writers.writers.length === 0 && <div>No writers.</div>}
                </BS.ModalBody>
            </BS.Modal>
        </Fragment>
    );
};

export default Permissioning;
