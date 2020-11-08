import useBluzelle from "../../services/BluzelleService"

import download from "downloadjs"

const useExportCSV = () => {
    const { getClient } = useBluzelle()

    const exportCSV = async (isLoading, setIsLoading, keys) => {
        if (isLoading) {
            alert("Cannot export while loading keys list.")
            return
        }

        setIsLoading(true)

        try {
            let values = []
            for (let i = 0; i < keys.length; i += 1000) {
                values = values.concat(
                    await Promise.all(
                        keys
                            .slice(i, i + 1000)
                            .map((key) => getClient().read(key))
                    )
                )
            }

            const fields = keys.map((key, i) => [key, values[i]])

            downloadCSV(fields)
        } catch (e) {
            alert("Couldn't complete export due to network error")
            console.error(e)
        }

        setIsLoading(false)
    }

    const downloadCSV = (fields) => {
        const content = fields
            .map((field) => field.map(sanitize).join(","))
            .join("\n")

        download(content, "download", "text/csv")
    }

    const sanitize = (str) => '"' + str.replace(/"/g, '""') + '"'

    return exportCSV
}

export default useExportCSV
