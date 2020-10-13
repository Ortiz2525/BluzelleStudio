import FileName from "./FileName";
import FileSize from "./FileSize";
import { activeValue } from "../../services/CRUDService";

export default FileEditor = () => {
    const [uploaded, setUploaded] = useState(false);
    const [uploadedFilename, setUploadedFilename] = useState("");

    const { selectedKey } = useData();

    let fileSelector = null;

    const onSubmit = (e) => {
        e.preventDefault();

        if (!fileSelector) return;
        if (!fileSelector.files[0]) return;

        const file = fileSelector.files[0];

        const reader = new FileReader();

        reader.onload = () => {
            // const oldBytearray = props.keyData.get('bytearray'),
            ///    oldFilename = props.keyData.get('filename');

            activeValue.set(new Uint8Array(reader.result));

            setUploaded(true);
            setUploadedFilename(file.name);

            // execute({
            //     doIt: () => {
            //         props.keyData.set('bytearray', [PREFIX, ...arr]);
            //         props.keyData.set('filename', file.name);
            //     },
            //     undoIt: () => {
            //         props.keyData.set('bytearray', oldBytearray);
            //         props.keyData.set('filename', oldFilename);
            //     },
            //     message: <span>Uploaded <code key={1}>{file.name}</code> to <code key={2}>{props.keyName}</code>.</span>
            // });
        };

        reader.readAsArrayBuffer(file);
    };

    const download = () => {
        const arr = activeValue.get();

        const blob = new Blob([arr.buffer]);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);

        const fileName = selectedKey;

        link.download = fileName;
        link.click();
    };

    return (
        <div style={{ padding: 15 }}>
            <BS.Panel>
                <BS.Panel.Heading>File Editor</BS.Panel.Heading>
                <BS.Panel.Body>
                    <div>
                        File size:{" "}
                        <code>
                            <FileSize numBytes={activeValue.get().byteLength} />
                        </code>
                    </div>
                    <div>
                        File name: <code>{selectedKey}</code>
                    </div>

                    <hr />

                    <BS.ListGroup>
                        <BS.ListGroupItem onClick={download}>
                            <BS.Glyphicon glyph='download' /> Download
                        </BS.ListGroupItem>
                    </BS.ListGroup>

                    <hr />

                    <BS.FormGroup>
                        <input type='file' ref={(el) => (fileSelector = el)} />
                        <BS.ListGroup>
                            <BS.ListGroupItem onClick={onSubmit}>
                                Submit
                            </BS.ListGroupItem>
                        </BS.ListGroup>
                    </BS.FormGroup>

                    {uploaded && (
                        <div>
                            Uploaded <FileName filename={uploadedFilename} />{" "}
                            successfully as <code>{selectedKey}</code>.
                        </div>
                    )}
                </BS.Panel.Body>
            </BS.Panel>
        </div>
    );
};
