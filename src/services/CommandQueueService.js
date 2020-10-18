import useData from "components/DataContext/useData";

const useCommandQueueService = () => {
    const {
        commandQueue,
        setCommandQueue,
        currentPosition,
        setCurrentPosition,
    } = useData();

    const revert = (targetPosition) => {
        const { commandQueue, currentPosition, setCurrentPosition } = useData();

        if (cp > targetPosition) {
            const prev = commandQueue[currentPosition - 1];

            commandQueue[currentPosition].undoIt(prev).then(() => {
                setCurrentPosition(currentPosition - 1);
                revert(targetPosition);
            });
        }

        if (currentPosition < targetPosition) {
            commandQueue[currentPosition + 1].doIt().then(() => {
                setCurrentPosition(currentPosition + 1);
                revert(targetPosition);
            });
        }
    };

    if (commandQueue === undefined) {
        const newCommandQueue = [
            {
                message: "Initial state",
                revert: revert.bind(this, 0),
            },
        ];
        setCommandQueue(newCommandQueue);
    }

    const canUndo = () => {
        return currentPosition > 0;
    };

    const undo = () => {
        canUndo() && revert(currentPosition - 1);
    };

    const canRedo = () => {
        return currentPosition < commandQueue.length - 1;
    };

    const redo = () => {
        canRedo() && revert(currentPosition + 1);
    };

    // Caution: the consecutive execution of undoIt and doIt should cancel
    // each other out exactly. If the action is to, for instance, create a new
    // object, the object should have the same identity as it had before
    // undoing and redoing.

    const execute = ({ doIt, undoIt, message }) => {
        new Promise((resolve) => {
            doIt().then(resolve);

            setCurrentPosition(currentPosition + 1);
            deleteFuture();

            const newCommandQueue = [...commandQueue];
            newCommandQueue.push({
                revert: () => revert(currentPosition),
                doIt,
                undoIt,
                message,
            });

            setCommandQueue(newCommandQueue);
        });
    };

    const deleteFuture = () =>
        currentPosition >= 0 && (commandQueue.length = currentPosition);

    const removePreviousHistory = () => {
        const newCommandQueue = [...commandQueue];
        newCommandQueue.slice(currentPosition);
        setCommandQueue(newCommandQueue);
        setCurrentPosition(0);
    };

    const updateHistoryMessage = (message) =>
        (commandQueue[currentPosition].message = message);

    return {
        canUndo,
        undo,
        canRedo,
        redo,
        execute,
        deleteFuture,
        removePreviousHistory,
        updateHistoryMessage,
    };
};

export default useCommandQueueService;
