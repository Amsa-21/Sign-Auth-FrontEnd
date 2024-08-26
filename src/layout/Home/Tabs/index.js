import PropTypes from "prop-types";
import "./index.css";

function Tabs({ defaultActiveKey, items }) {
  function open(evt, id) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(id).style.display = "block";
    evt.currentTarget.className += " active";
  }

  return (
    <>
      <div className="tab">
        {items.map((item) => (
          <button
            key={item.key}
            className={`tablinks ${
              item.key === defaultActiveKey ? "active" : ""
            }`}
            onClick={(event) => open(event, item.name)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {items.map((item) => (
        <div
          key={item.key}
          id={item.name}
          className={`tabcontent ${
            item.key === defaultActiveKey ? "active" : ""
          }`}
        >
          {item.content}
        </div>
      ))}
    </>
  );
}

Tabs.propTypes = {
  defaultActiveKey: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

export default Tabs;
