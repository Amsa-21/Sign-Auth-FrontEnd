import React from "react";
import PropTypes from "prop-types";

function Card({ title, icon, value }) {
  return (
    <div
      style={{
        width: "25%",
        borderRadius: 7,
        boxShadow: "0 0 2px black",
        paddingInline: "3%",
        backgroundColor: "rgba(43, 43, 43, .2)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: "20px",
        }}
      >
        <h5
          style={{
            fontFamily: "Segoe UI, Arial, sans-serif",
            fontSize: 16,
            color: "rgba(0, 0, 0, 0.6)",
            margin: 0,
          }}
        >
          {title}
        </h5>
        {icon}
      </div>
      <h1
        style={{
          color: "rgb(0, 0, 0)",
          margin: "10px 0",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  value: PropTypes.number,
};

export default Card;
