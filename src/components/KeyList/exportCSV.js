import React from "react";
import { getClient } from "../../services/BluzelleService";

import download from "downloadjs";

export default exportCSV = async (isLoading, setIsLoading, keys) => {
    if (isLoading) {
        alert("Cannot export while loading keys list.");
        return;
    }

    setIsLoading(true);

    try {
        const values = await Promise.all(
            keys.map((key) => getClient().read(key))
        );

        const fields = keys.map((key, i) => [key, values[i]]);

        console.log(fields);

        downloadCSV(fields);
    } catch (e) {
        alert("Couldn't complete export due to network error");
        console.error(e);
    }

    setIsLoading(false);
};

const downloadCSV = (fields) => {
    const content = fields
        .map((field) => field.map(sanitize).join(","))
        .join("\n");

    download(content, "download", "text/csv");
};

const sanitize = (str) => '"' + str.replace(/"/g, '""') + '"';
