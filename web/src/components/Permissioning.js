import {autorun} from 'mobx';
import {getClient, hasClient} from '../services/BluzelleService';
import {Fragment} from 'react';

export const writers = observable();

export const is_writer = observable('read-only');


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

        getClient().getWriters().then(
            w => writers.set(w),
            e => {
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

        return (
            <Fragment>

                {

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

                <hr/>

                <code style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(writers.get(), null, 4)}</code>


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
                  </BS.ModalBody>
                </BS.Modal>
            </Fragment>
        );

    }

};