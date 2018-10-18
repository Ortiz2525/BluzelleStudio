import {KeyListItem} from "./KeyListItem";
import {NewKeyField} from "./NewKey/NewKeyField";
import {activeValue, save, remove, reload} from '../../services/CRUDService';
import {execute, removePreviousHistory, updateHistoryMessage} from '../../services/CommandQueueService';
import {observe} from 'mobx';
import {create, update, keys as bzkeys} from 'bluzelle';
import {Fragment} from 'react';

export const selectedKey = observable(undefined);

export const keys = observable([]);


export const refreshKeys = () => 
    bzkeys().then(k => keys.replace(k));

export const tempKey = observable.box();


@observer
export class KeyList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showNewKey: false
        };

    }


    componentWillMount() {

        refreshKeys();

    }


    render() {

        const keyList = keys.sort().map(keyname =>
            <KeyListItem key={keyname} keyname={keyname}/>);

        return (
            <Fragment>
            <div style={{padding: 10}}>

                <BS.ListGroup>

                    {keyList}

                    {keyList.length === 0 &&
                     !this.state.showNewKey &&

                        <h5 style={{
                            fontStyle: 'italic',
                            color: "#999999"
                        }}>Empty...</h5>}

                    { this.state.showNewKey &&
                        <NewKeyField onChange={() => this.setState({showNewKey: false})}/> }
                
                </BS.ListGroup>
            </div>
            <hr/>
            <div style={{padding: 10}}>

                <BS.ButtonToolbar>
                    <BS.ButtonGroup>
                        <AddButton onClick={() => this.setState({showNewKey: true})}/>
                        
                        {

                            activeValue.get() !== undefined &&

                            <BS.Button 
                                outline
                                color="danger"
                                onClick={executeRemove}>

                                <i className="fas fa-times"></i>
                            </BS.Button>

                        }

                        <SaveReloadRemove/>
                    </BS.ButtonGroup>
                </BS.ButtonToolbar>
            </div>

            <hr/>

            <div style={{padding: 10}}>
                
            </div>
            </Fragment>
        );
    }
}


const executeRemove = () => {

    const sk = selectedKey.get();
    const val = activeValue.get();


    execute({

        doIt: () => remove(),

        undoIt: () => new Promise(resolve =>

            create(sk, val).then(() => reload().then(() => {

                selectedKey.set(sk);
                resolve();

            }))),

        message: <span>Removed key <code key={1}>{sk}</code>.</span>

    });

};


// Doesn't play nice with the current system of undos.

// An idea: track changes to observables and automatically 
// generate undo/redo behavior based on single command.

const executeReload = () => {

    reload();

    removePreviousHistory();
    updateHistoryMessage('Reload');

};


const AddButton = ({onClick}) => 

    <BS.Button 
        outline
        color="success"
        onClick={onClick}>

        <i className="fas fa-plus"></i>
    </BS.Button>;


const SaveReloadRemove = observer(({keyname}) =>

        <Fragment>
           <BS.Button 
            outline
            color="info"
            onClick={executeReload}>

                <i className="fas fa-sync"></i>
           </BS.Button>

            {

                activeValue.get() !== undefined &&
                
                <BS.Button 
                    color="success"
                    onClick={save}>
                    
                    <i className="fas fa-save"></i>
               </BS.Button>

            }

        </Fragment>);
