import Modal from "@/components/modals/Modal";

const DeleteModal: React.FC<{
    open: boolean,
    onClose: () => void,
    onDeleteUser: () => void,
    modalText?: string
}> = ({ open, onClose, onDeleteUser, modalText }) => (
    <Modal
        open={open}
        onClose={onClose}
        header={<div>Delete Confirmation</div>}
        width="500px"
        height="auto"
        body={
            <div className="flex flex-col">
                <p className="text-typography text-lg">{modalText}</p>
                <div className="flex justify-end space-x-2 mt-3">
                    <button
                        className="text-grey-400  bg-red-600 rounded shadow-xl p-3"
                        onClick={onDeleteUser}
                    >
                        Delete
                    </button>
                    <button
                        className="text-grey-400 bg-gray-400 rounded shadow-xl p-3 "
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        }
    />
);

export default DeleteModal