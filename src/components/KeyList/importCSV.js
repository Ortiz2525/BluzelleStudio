import useBluzelle from "../../services/BluzelleService";
import Papa from "papaparse";
import { create } from "../../services/CRUDService";

const importCSV = (setIsLoading, setKeys) => {
    const { getClient } = useBluzelle();

    const createFields = async (fields) => {
        setIsLoading(true);

        const keys = await getClient().keys();

        setKeys(keys);
        setIsLoading(false);

        const promises = fields.map(({ key, value }) => {
            if (!keys.includes(key)) {
                create(key, value);
            } else {
                getClient().update(key, value);
            }
        });
    };

    const input = document.createElement("input");

    input.type = "file";

    input.onchange = () => {
        if (input.files.length === 0) {
            return;
        }

        if (input.files.length > 1) {
            alert("Please select only one file.");
            return;
        }

        Papa.parse(input.files[0], {
            complete: function (results) {
                console.log("Errors from CSV input", results.errors);
                console.log("CSV metadata", results.meta);

                const table = results.data;

                const notEmpty = (cell) => cell.length;

                const filteredTable = table.map((row) => row.filter(notEmpty));

                const goodRows = filteredTable.filter((row) => row.length >= 2);

                const fields = goodRows.map((row) => ({
                    key: row[0],
                    value: row[1],
                }));

                createFields(fields);
            },
        });
    };

    input.click();
};

export default importCSV;
