import {autorun} from 'mobx';
import {getClient, hasClient} from '../services/BluzelleService';
import {Fragment} from 'react';
import {loadingBar} from './loadingBar';

export const writers = observable();

export const is_writer = observable('read-only');

export const loading = observable(false);


autorun(() => {

    writers.get();

    if(!hasClient()) return;


    const pub_key = getClient().publicKey();

    if(pub_key === writers.get().owner) {

        is_writer.set('owner');

    } else if(writers.get().writers.includes(pub_key)) {

        is_writer.set('writer');

    } else {

        is_writer.set('read-only');

    }

});


@observer
export class Permissioning extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false
        };
    }

    refresh() {

        loading.set(true);

        getClient().getWriters().then(
            w => {
                loading.set(false);
                writers.set(w)
            },
            e => {
                loading.set(false);
                alert('Failed to get writers.');
                throw e;
            }
        );

    }


    addWriter() {

        const pub = prompt('Please enter the public key of the new writer.', 'MFYwEAY...');

        if(pub.length) {

            getClient().addWriters(pub).then(
                () => this.refresh(),
                e => {
                    alert('Failed to add writer.');
                    throw e;
                }
            );

        }

    }


    deleteWriter(writer) {

        getClient().deleteWriters(writer).then(
            () => this.refresh(),
            e => {
                alert('Failed to delete writer.');
                throw e;
            }
        );

    }


    toggle() {

        this.setState({
            modal: !this.state.modal
        });
    
    }


    render() {

        const render_pubkey = pubkey => 
            <td>
                <code style={{whiteSpace: 'pre-wrap'}}>{(pubkey === undefined ? '' : pubkey + ' ')}</code>
                {pubkey === getClient().publicKey() && <BS.Badge color="primary">Me</BS.Badge>}
            </td>;

        return (
            <Fragment>

                { loading.get() ? <div style={{marginBottom: 15}}>{loadingBar}</div> :

                    is_writer.get() === 'owner' ?

                        <BS.Alert color="success">
                            You are the database owner.
                        </BS.Alert>

                        :

                        is_writer.get() === 'writer' ?

                            <BS.Alert color="primary">
                                You can write to this database.
                            </BS.Alert>

                            :

                            <BS.Alert color="dark">
                                You cannot write to this database.
                            </BS.Alert>
                }

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
                    {render_pubkey(writers.get().owner)}
                  </tr>
                  <tr>
                    <th scope="row">writers</th>
                    {render_pubkey(writers.get().writers[0])}
                  </tr>
                  {
                    writers.get().writers.slice(1).map(w => 
                        <tr key={w}>
                            <th scope="row"></th>
                            {render_pubkey(w)}
                        </tr>)
                  }
                </tbody>
                </BS.Table>

                <hr/>

                 <BS.ButtonToolbar>
                    <BS.ButtonGroup>
                    
                        {

                            is_writer.get() === 'owner' &&

                        <BS.Button 
                                outline
                                color="success"
                                onClick={() => this.addWriter()}>
                                <i className="fas fa-user-plus"></i>
                            </BS.Button>

                        }


                        {

                            is_writer.get() === 'owner' &&

                        <BS.Button 
                                outline
                                color="danger"
                                onClick={() => this.toggle()}>

                                <i className="fas fa-user-minus"></i>
                            </BS.Button>

                        }

                        <BS.Button 
                                outline
                                color="info"
                                onClick={() => this.refresh()}>

                                    <i className="fas fa-sync"></i>
                               </BS.Button>

                    </BS.ButtonGroup>
                </BS.ButtonToolbar>

                <BS.Modal isOpen={this.state.modal} toggle={() => this.toggle()}>
                  <BS.ModalHeader toggle={() => this.toggle()}>Delete Writers</BS.ModalHeader>
                  <BS.ModalBody>
                    <BS.Alert color="secondary">Please click on the writer you want to remove.</BS.Alert>

                    <BS.ListGroup>
                    {
                        writers.get().writers.map(w => 
                            <BS.ListGroupItem 
                                key={w}
                                tag="button" 
                                action 
                                style={{wordWrap: 'break-word'}}
                                onClick={() => this.deleteWriter(w)}>

                                {w}


                            </BS.ListGroupItem>)
                    }
                    </BS.ListGroup>

                    {
                        writers.get().writers.length === 0 && <div>No writers.</div>
                    }
                  </BS.ModalBody>
                </BS.Modal>
            </Fragment>
        );

    }

};