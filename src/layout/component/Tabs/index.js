import PropTypes from "prop-types";
import React, { useState } from "react";
import "./style.css";

function Tabs({ defaultActiveKey, items }) {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  const handleClick = (key) => {
    setActiveKey(key);
  };

  return (
    <>
      <div className="tab">
        {items.map((item) => (
          <button
            key={item.key}
            className={`tablinks ${item.key === activeKey ? "active" : ""}`}
            onClick={() => handleClick(item.key)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {items.map((item) => (
        <div
          key={item.key}
          id={item.name}
          className={`tabcontent ${item.key === activeKey ? "active" : ""}`}
          style={{ display: item.key === activeKey ? "block" : "none" }}
        >
          {item.content}
        </div>
      ))}
    </>
  );
}

Tabs.propTypes = {
  defaultActiveKey: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
};

export default Tabs;
