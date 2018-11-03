import {log} from '../services/BluzelleService'

log.observe(v => {

    if(logs.length === logs_max_length) {
        logs.shift();
    }


    if(v.newValue[1].read && v.newValue[1].read.value) {
        v.newValue[1].read.value = ['...'];
    }

    if(v.newValue[1].subscriptionUpdate) {
        v.newValue[1].subscriptionUpdate.value = ['...'];
    }

    if(v.newValue[1].update && v.newValue[1].update.value) {
        v.newValue[1].update.value = ['...'];
    }



    const date = new Date();

    const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds();

    logs.push({
        type: v.newValue[0],
        json: v.newValue[1],
        time
    });

});


const logs_max_length = 10;
const logs = observable([]);


@observer
export class Log extends Component {

    render() {

        return (
            <BS.ListGroup flush>

                {logs.reverse().map((msg, i) =>

                    <BS.ListGroupItem 
                    color={
                        (msg.json.error !== undefined || msg.type === 'Connection error') 
                           ? 'danger' : ''}
                    key={i}
                    style={{
                        wordBreak: 'break-all'
                    }}>

                        <BS.ListGroupItemHeading>
                            <span>
                                <i 
                                style={{
                                    color: ({
                                        'Sending': 'orange',
                                        'Receiving': 'purple',
                                        'Connection open': 'green',
                                        'Connection error': 'red',
                                        'Redirecting': 'hotpink'
                                    })[msg.type]
                                }}
                                className={
                                    ({
                                        'Sending': "fas fa-sign-out-alt",
                                        'Receiving': 'fas fa-sign-in-alt fa-flip-horizontal',
                                        'Connection open': "fas fa-plug",
                                        'Connection error': 'fas fa-exclamation-triangle',
                                        'Redirecting': 'fas fa-directions'
                                    })[msg.type]
                                }></i>
                            </span>
                            &nbsp; &nbsp;&nbsp;&nbsp;
                            <BS.Badge pill>{msg.time}</BS.Badge>
                        </BS.ListGroupItemHeading>
                        

                        <BS.ListGroupItemText style={{
                            fontFamily: 'monospace',
                            color: '#888888',
                            fontStyle: 'italic'
                        }}>
                            {JSON.stringify(msg.json)}
                        </BS.ListGroupItemText>
                        

                    </BS.ListGroupItem>

                )}
            </BS.ListGroup>
        );
    }
}
