import { toast } from "react-toastify";
import "../components/DeleteToast";

export const DeleteToast = ({ onConfirm }) => {
    toast(({ closeToast }) => (
        <div>
            <p>Are you sure you want to delete this post?</p>
            <div className="toast-btn-group">
                <button className="btn-red"
                    onClick={() => {
                        onConfirm();
                        closeToast();
                        toast.success("Post deleted successfully!");
                    }}>Yes</button>
                <button className="btn-blue" onClick={closeToast}>No</button>
            </div>
        </div>
    ), { autoClose: false });
};