import { observe } from "mobx";
import { log } from "../services/BluzelleService";

observe(log, (v) => {
    if (logs.length === logs_max_length) {
        logs.shift();
    }

    if (v.newValue[1].read && v.newValue[1].read.value) {
        v.newValue[1].read.value = ["..."];
    }

    if (v.newValue[1].subscriptionUpdate) {
        v.newValue[1].subscriptionUpdate.value = ["..."];
    }

    if (v.newValue[1].update && v.newValue[1].update.value) {
        v.newValue[1].update.value = ["..."];
    }

    const date = new Date();

    const time =
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds() +
        "." +
        date.getMilliseconds();

    logs.push({
        type: v.newValue[0],
        json: v.newValue[1],
        time,
    });
});

const logs_max_length = 10;
const logs = observable([]);

@observer
export class Log extends Component {
    render() {
        return (
            <BS.ListGroup flush>
                {logs.reverse().map((msg, i) => (
                    <BS.ListGroupItem
                        color={
                            msg.json.error !== undefined ||
                            msg.type === "Connection error"
                                ? "danger"
                                : ""
                        }
                        key={i}
                        style={{
                            wordBreak: "break-all",
                        }}>
                        <BS.ListGroupItemHeading>
                            <span>
                                <i
                                    style={{
                                        color: {
                                            "Outgoing database_msg\n":
                                                "hotpink",
                                            "Incoming database_response\n":
                                                "purple",
                                        }[msg.type],
                                    }}
                                    className={
                                        {
                                            "Outgoing database_msg\n":
                                                "fas fa-sign-out-alt",
                                            "Incoming database_response\n":
                                                "fas fa-sign-in-alt fa-flip-horizontal",
                                        }[msg.type]
                                    }></i>
                            </span>
                            &nbsp; &nbsp;&nbsp;&nbsp;
                            <BS.Badge pill>{msg.time}</BS.Badge>
                        </BS.ListGroupItemHeading>

                        <BS.ListGroupItemText
                            style={{
                                fontFamily: "monospace",
                                color: "#888888",
                                fontStyle: "italic",
                                whiteSpace: "pre-wrap",
                            }}>
                            {JSON.stringify(msg.json, null, 4)}
                        </BS.ListGroupItemText>
                    </BS.ListGroupItem>
                ))}
            </BS.ListGroup>
        );
    }
}
