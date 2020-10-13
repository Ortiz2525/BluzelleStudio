import { EditableField } from "../../EditableField";
import { rename } from "../../../services/CRUDService";

const RenameKeyField = ({ keyname, onChange }) => {
    const [keyField, setKeyField] = useState("");

    const onChangeKey = (key) => {
        setKeyField(key);

        if (key !== "") {
            exit();

            rename(keyname, key);
        }
    };

    const exit = () => {
        onChange();
    };

    return (
        <React.Fragment>
            <BS.ListGroupItem>
                <EditableField
                    val={keyField}
                    active={true}
                    onChange={onChangeKey}
                />
            </BS.ListGroupItem>
        </React.Fragment>
    );
};

export default RenameKeyField;
