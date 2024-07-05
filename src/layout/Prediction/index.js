import React, { useRef, useState } from "react";
import { Button, Spin, message } from "antd";
import axios from "axios";
import Webcam from "react-webcam";
import HomeLayout from "../../container";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

function Prediction() {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState("");

  const capture = async () => {
    try {
      setRes("");
      setLoading(true);
      const formData = new FormData();
      formData.append("img", webcamRef.current.getScreenshot());

      const response = await axios.post(`${API_URL}/predict`, formData, {});
      if (response.data.success) {
        setRes(response.data.person);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.toString());
    }
    setLoading(false);
  };

  return (
    <HomeLayout>
      <div
        style={{
          display: "grid",
          justifyContent: "center",
          alignContent: "center",
          gap: "25px",
        }}
      >
        <Spin fullscreen spinning={loading} />
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          minScreenshotWidth={180}
          minScreenshotHeight={180}
        />
        {res && <h1>{res}</h1>}
        <div style={{ display: "flex", justifyContent: "right" }}>
          <Button
            type="primary"
            style={{ backgroundColor: "#0C356A" }}
            onClick={capture}
          >
            Prendre la photo
          </Button>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Prediction;
