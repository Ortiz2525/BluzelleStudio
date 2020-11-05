import useBluzelle from "../../services/BluzelleService"
import Papa from "papaparse"
import useCRUDService from "../../services/CRUDService"
import useData from "components/DataContext/useData"

const useImportCSV = () => {
    const { getClient } = useBluzelle()
    const { create } = useCRUDService()
    const { gasPrice, maxGas, reload } = useData()

    const gas_info = {
        gas_price: gasPrice,
        max_gas: maxGas,
    }

    const doImport = (fields) => {
        return new Promise((resolve) => {
            getClient()
                .withTransaction(() =>
                    Promise.all(
                        fields.map(({ key, value }) =>
                            getClient().upsert(key, value, gas_info)
                        )
                    )
                )
                .then((results) => {
                    resolve()
                })
                .catch((ex) => {
                    alert(
                        ex.error ? ex.error : "Error due to bluzelle network!"
                    )
                    resolve()
                })
        })
    }

    const importCSV = (setIsLoading, setKeys) => {
        const createFields = async (fields) => {
            setIsLoading(true)

            const keys = await getClient().keys()

            setKeys(keys)

            let i = 0
            while (i < fields.length) {
                await doImport(fields.slice(i, 1000))
                i += 1000
            }

            setIsLoading(false)
            reload()
        }

        const input = document.createElement("input")

        input.type = "file"

        input.onchange = () => {
            if (input.files.length === 0) {
                return
            }

            if (input.files.length > 1) {
                alert("Please select only one file.")
                return
            }

            Papa.parse(input.files[0], {
                complete: function (results) {
                    console.log("Errors from CSV input", results.errors)
                    console.log("CSV metadata", results.meta)

                    const table = results.data

                    const goodRows = table.filter((row) => row.length >= 2)

                    const fields = goodRows.map((row) => ({
                        key: row[0],
                        value: row[1],
                    }))

                    createFields(fields)
                },
            })
        }

        input.click()
    }

    return importCSV
}

export default useImportCSV
