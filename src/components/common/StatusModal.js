import {
  CheckCircleFill,
  XCircleFill,
  InfoCircleFill,
} from "react-bootstrap-icons";

export const StatusModal = ({ status, title, message, onClose }) => (
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    tabIndex="-1"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-body text-center p-4">
          {status === "success" ? (
            <CheckCircleFill className="text-success mb-3" size={48} />
          ) : (
            <XCircleFill className="text-danger mb-3" size={48} />
          )}
          <h5 className="modal-title mb-2">{title}</h5>
          <p className="text-muted">{message}</p>
          <button
            className={`btn ${
              status === "success" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={onClose}
          >
            {status === "success" ? "Close" : "Close"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default StatusModal;
