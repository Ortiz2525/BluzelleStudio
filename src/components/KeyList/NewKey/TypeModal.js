import {JSONIcon, TextIcon, FileIcon} from "../../ObjIcon";
import {selectedKey, refreshKeys, keys, tempKeys} from "../KeyList";
import {getClient} from '../../../services/BluzelleService';
import {execute} from '../../../services/CommandQueueService';
import {create} from '../../../services/CRUDService';


export class TypeModal extends Component {


    render() {


        // This will choose text every time.
        // Removing this re-enables the popup dialog where you
        // can choose text/JSON/file.

        create(this.props.keyField, '');


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