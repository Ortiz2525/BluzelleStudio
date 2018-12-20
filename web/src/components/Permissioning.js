import {autorun} from 'mobx';
import {getClient, hasClient} from '../services/BluzelleService';


export const writers = observable();

export const is_writer = observable('read-only');


autorun(() => {

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

    render() {

        return (
            <BS.Card>
                <BS.CardBody>
                  <BS.CardTitle>Permissioning</BS.CardTitle>
                     <hr style={{border: 'none'}}/>
                    
                    <BS.Alert color="success">
                        You are the database owner.
                    </BS.Alert>

                    <BS.Alert color="primary">
                        You can write to this database.
                    </BS.Alert>

                    <BS.Alert color="dark">
                        You cannot write to this database.
                    </BS.Alert>

                    <code>{"{ my: json, status output goes here }"}</code>

                    <hr/>

                     <BS.ButtonToolbar>
                        <BS.ButtonGroup>
                      
                            <BS.Button 
                                    outline
                                    color="success">
                                    <i className="fas fa-user-plus"></i>
                                </BS.Button>

                            

                            <BS.Button 
                                    outline
                                    color="danger">

                                    <i className="fas fa-user-minus"></i>
                                </BS.Button>

                            <BS.Button 
                                    outline
                                    color="info">

                                        <i className="fas fa-sync"></i>
                                   </BS.Button>

                        </BS.ButtonGroup>
                    </BS.ButtonToolbar>

                </BS.CardBody>
            </BS.Card>
        );

    }

};