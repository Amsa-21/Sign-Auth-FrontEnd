import "./style.css";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

function ModalPDF({ content, open, onClose }) {
  useEffect(() => {
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];

    if (modal && span) {
      if (open) {
        modal.style.display = "block";
      } else {
        modal.style.display = "none";
      }

      span.addEventListener("click", function () {
        modal.style.display = "none";
        onClose();
      });

      window.addEventListener("click", function (event) {
        if (event.target === modal) {
          modal.style.display = "none";
          onClose();
        }
      });
    }
  }, [open, onClose]);

  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <span className="close">&times;</span>
        {content}
      </div>
    </div>
  );
}

ModalPDF.propTypes = {
  content: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalPDF;
