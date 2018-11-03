import {JSONIcon, TextIcon, FileIcon} from "../../ObjIcon";
import {selectedKey, refreshKeys, keys, tempKey} from "../KeyList";
import {getClient} from '../../../services/BluzelleService';
import {execute} from '../../../services/CommandQueueService';


export class TypeModal extends Component {

    chooseJSON() {
        this.addNewKey({}, 'JSON');
    }

    chooseText() {
        this.addNewKey('', 'plain text');
    }

    chooseFile() {
        this.addNewKey(new ArrayBuffer(), 'file');
    }


    addNewKey(keyData, typeName) {

        const oldSelection = selectedKey.get();


        execute({
            doIt: () => new Promise(resolve => {

                keys.push(this.props.keyField);
                tempKey.set(this.props.keyField);

                getClient().create(this.props.keyField, keyData).then(() => {
                    
                    tempKey.set();
                    refreshKeys().then(resolve)

                }).catch(() => alert('Failed to create key due to bluzelle network error.'));

            }),

            undoIt: () => new Promise(resolve => {

                getClient().remove(this.props.keyField).then(() =>
                    refreshKeys().then(resolve))
                    .catch(() => alert('Failed to undo due to bluzelle network error.'));
            }),

            message: <span>Added field <code key={1}>{this.props.keyField}</code>.</span>
        });

        this.props.onHide();

    }


    render() {


        // This will choose text every time.
        // Removing this re-enables the popup dialog where you
        // can choose text/JSON/file.

        this.chooseText();


        return (<div></div>);
        //     <BS.Modal show={true} onHide={this.props.onHide}>
        //         <BS.Modal.Header closeButton>
        //             <BS.Modal.Title>
        //                 Select Key Type
        //             </BS.Modal.Title>
        //         </BS.Modal.Header>
        //         <BS.Modal.Body>
        //             <BS.ListGroup>
        //                 <BS.ListGroupItem onClick={this.chooseJSON.bind(this)}>
        //                     <JSONIcon/>
        //                     <span style={{marginLeft: 15}}>JSON Data</span>
        //                 </BS.ListGroupItem>
        //                 <BS.ListGroupItem onClick={this.chooseText.bind(this)}>
        //                     <TextIcon/>
        //                     <span style={{marginLeft: 15}}>Plain Text</span>
        //                 </BS.ListGroupItem>
        //                 <BS.ListGroupItem onClick={this.chooseFile.bind(this)}>
        //                     <FileIcon/>
        //                     <span style={{marginLeft: 15}}>File</span>
        //                 </BS.ListGroupItem>
        //             </BS.ListGroup>
        //         </BS.Modal.Body>
        //     </BS.Modal>
        // );
    }
}