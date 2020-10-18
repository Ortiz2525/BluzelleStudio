import React, { useEffect, useState } from "react";
import useData from "./DataContext/useData";

const logs_max_length = 10;

const Log = () => {
    const { log, setLog } = useData();
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (log) {
            const newLogs = [...logs];

            if (newLogs.length === logs_max_length) {
                newLogs.shift();
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

            newLogs.push({
                type: log.type,
                json: log.json,
                time,
            });

            setLogs(newLogs);
        }
    }, [log]);

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
                                        "Outgoing database_msg\n": "hotpink",
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
};

export default Log;
