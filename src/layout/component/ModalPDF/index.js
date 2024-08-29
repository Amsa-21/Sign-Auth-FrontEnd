import PropTypes from "prop-types";
import "./style.css";

function ModalPDF({ content, open, onClose }) {
  return (
    <div
      className="modal"
      style={{ display: open ? "block" : "none" }}
      onClick={onClose}
    >
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {content}
      </div>
    </div>
  );
}

ModalPDF.propTypes = {
  content: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalPDF;
