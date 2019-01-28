import {JSONEditor} from "./JSONEditor";
import {PlainTextEditor} from './PlainTextEditor';
import {FileEditor} from "./FileEditor/FileEditor";
import {loadingBar} from './loadingBar';
import {activeValue, loadingValue} from '../services/CRUDService';


@observer
export class Editor extends Component {

    render() {

        if(activeValue.get() instanceof Uint8Array) {

            return <FileEditor/>;

        }


        const type = typeof activeValue.get();


        if(type === 'string') {

            return <PlainTextEditor/>;

        }

        if(type === 'object' || type === 'boolean' || type === 'number') {

            return <JSONEditor/>;

        }


        if(loadingValue.get()) {
            return <div style={{textAlign: 'center', padding: 15}}>{loadingBar}</div>;
        }

        return <div></div>;

    }

};
