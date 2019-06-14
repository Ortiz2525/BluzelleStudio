import {JSONEditor} from "./JSONEditor";
import {ExpiryBar} from "./ExpiryBar";
import {PlainTextEditor} from './PlainTextEditor';
import {FileEditor} from "./FileEditor/FileEditor";
import {loadingBar} from './loadingBar';
import {activeValue, loadingValue} from '../services/CRUDService';


@observer
export class Editor extends Component {

    render() {

        const showExpiryBar = activeValue.get() !== undefined && !loadingValue.get();

        return (
            <div style={{height: '100%'}}>
                {showExpiryBar && <ExpiryBar/>}
                {showExpiryBar && <hr style={{marginBottom: 0}}/>}
                <Body/>
            </div>
        );

    }

}



@observer
class Body extends Component {

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
