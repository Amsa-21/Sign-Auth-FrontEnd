import React, { useRef, useState } from "react";
import { Button, Image, Spin, message } from "antd";
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
  const [res, setRes] = useState(null);
  const [img, setImg] = useState(null);
  const [cam, setCam] = useState(false);

  const capture = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", webcamRef.current.getScreenshot());

      const response = await axios.post(`${API_URL}/predict`, formData, {});
      if (response.data.success) {
        setRes(response.data.person);
        setImg(response.data.face);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.toString());
    }
    setLoading(false);
  };

  function toogleCam() {
    setCam(!cam);
  }

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
        <div style={{ display: "flex", justifyContent: "left", width: 640 }}>
          <Button
            type="primary"
            style={{ backgroundColor: "#0C356A" }}
            onClick={toogleCam}
          >
            {cam ? "Fermer la caméra" : "Ouvrir la caméra"}
          </Button>
        </div>
        {cam ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              minScreenshotWidth={200}
              minScreenshotHeight={200}
              mirrored={true}
              style={{ borderRadius: "6px" }}
            />
            <div style={{ display: "flex", justifyContent: "right" }}>
              <Button
                type="primary"
                style={{ backgroundColor: "#0C356A" }}
                onClick={capture}
              >
                Prendre la photo
              </Button>
            </div>
          </>
        ) : null}
        <h1>{res}</h1>
        {img && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src={img}
              style={{ width: 160, height: 160 }}
              alt="Captured Image"
            />
          </div>
        )}
      </div>
    </HomeLayout>
  );
}

export default Prediction;
