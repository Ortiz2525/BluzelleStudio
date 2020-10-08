import { getClient, hasClient } from "../services/BluzelleService";
import { Fragment, useEffect } from "react";
import { loadingBar } from "./loadingBar";
import useData from "./DataContext/useData";

export const writers = observable();
export const is_writer = observable("read-only");
export const loading = observable(false);

const Permissioning = () => {
    const [modal, setModal] = useState(false);
    const { mnemonic } = useData();

    const refresh = () => {
        loading.set(true);

        getClient()
            ._getWriters()
            .then(
                (w) => {
                    loading.set(false);
                    writers.set(w);
                },
                (e) => {
                    loading.set(false);
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
        writers.get();

        if (!hasClient()) return;

        if (mnemonic === writers.get().owner) {
            is_writer.set("owner");
        } else if (writers.get().writers.includes(mnemonic)) {
            is_writer.set("writer");
        } else {
            is_writer.set("read-only");
        }
    }, [mnemonic]);

    const render_mnemonic = (_mnemonic) => (
        <td>
            <code style={{ whiteSpace: "pre-wrap" }}>
                {_mnemonic === undefined ? "" : _mnemonic + " "}
            </code>
            {_mnemonic === mnemonic && <BS.Badge color="primary">Me</BS.Badge>}
        </td>
    );

    return (
        <Fragment>
            {loading.get() ? (
                <div style={{ marginBottom: 15 }}>{loadingBar}</div>
            ) : is_writer.get() === "owner" ? (
                <BS.Alert color="success">You are the database owner.</BS.Alert>
            ) : is_writer.get() === "writer" ? (
                <BS.Alert color="primary">
                    You can write to this database.
                </BS.Alert>
            ) : (
                <BS.Alert color="dark">
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
                        <th scope="row">owner</th>
                        {render_mnemonic(writers.get().owner)}
                    </tr>
                    <tr>
                        <th scope="row">writers</th>
                        {render_mnemonic(writers.get().writers[0])}
                    </tr>
                    {writers
                        .get()
                        .writers.slice(1)
                        .map((w) => (
                            <tr key={w}>
                                <th scope="row"></th>
                                {render_mnemonic(w)}
                            </tr>
                        ))}
                </tbody>
            </BS.Table>

            <hr />

            <BS.ButtonToolbar>
                <BS.ButtonGroup>
                    {is_writer.get() === "owner" && (
                        <BS.Button outline color="success" onClick={addWriter}>
                            <i className="fas fa-user-plus"></i>
                        </BS.Button>
                    )}

                    {is_writer.get() === "owner" && (
                        <BS.Button outline color="danger" onClick={toggle}>
                            <i className="fas fa-user-minus"></i>
                        </BS.Button>
                    )}

                    <BS.Button outline color="info" onClick={refresh}>
                        <i className="fas fa-sync"></i>
                    </BS.Button>
                </BS.ButtonGroup>
            </BS.ButtonToolbar>

            <BS.Modal isOpen={modal} toggle={toggle}>
                <BS.ModalHeader toggle={toggle}>Delete Writers</BS.ModalHeader>
                <BS.ModalBody>
                    <BS.Alert color="secondary">
                        Please click on the writer you want to remove.
                    </BS.Alert>

                    <BS.ListGroup>
                        {writers.get().writers.map((w) => (
                            <BS.ListGroupItem
                                key={w}
                                tag="button"
                                action
                                style={{ wordWrap: "break-word" }}
                                onClick={() => deleteWriter(w)}
                            >
                                {w}
                            </BS.ListGroupItem>
                        ))}
                    </BS.ListGroup>

                    {writers.get().writers.length === 0 && (
                        <div>No writers.</div>
                    )}
                </BS.ModalBody>
            </BS.Modal>
        </Fragment>
    );
};

export default Permissioning;
