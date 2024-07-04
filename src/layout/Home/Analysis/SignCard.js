import PropTypes from "prop-types";
import { Card, Divider, Image } from "antd";

function SignCard({ sign }) {
  return (
    <div
      style={{
        width: "100%",
        overflow: "auto",
        display: "flex",
        gap: 15,
        marginTop: 20,
      }}
    >
      {Object.entries(sign).map(([key, value]) => (
        <Card
          key={key}
          style={{
            border: "2px solid #0C356A",
            width: 260,
          }}
        >
          <Image
            src={"data:image/png;base64," + value}
            alt="Image of signature"
          />
          <Divider />
          <p>{key}</p>
        </Card>
      ))}
    </div>
  );
}

SignCard.propTypes = {
  sign: PropTypes.object.isRequired,
};

export default SignCard;
