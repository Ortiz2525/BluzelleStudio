const FileName = ({ filename }) => {
    const getPrefix = (s) => s.split(".")[0];

    const getExtension = (s) => {
        const arr = s.split(".");
        arr.shift();
        return arr.join(".");
    };

    return (
        <span>
            <span>{getPrefix(filename)}</span>.
            <span style={{ fontWeight: "bold" }}>{getExtension(filename)}</span>
        </span>
    );
};

export default FileName;
