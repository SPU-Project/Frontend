// src/components/CropperModal.jsx
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider"; // atau gunakan slider lain sesuai kebutuhan
import { getCroppedImg } from "../utils/cropImage";

const CropperModal = ({ imageSrc, onCancel, onComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPx) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onComplete(croppedImage);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cropper-modal" style={modalStyle}>
      <div style={cropperContainerStyle}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1} // untuk square crop, sesuaikan jika perlu aspect ratio lain
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div style={{ marginTop: 16 }}>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, value) => setZoom(value)}
        />
      </div>
      <div style={buttonContainerStyle}>
        <button onClick={handleCrop}>Crop</button>
        <button onClick={onCancel}>Batal</button>
      </div>
    </div>
  );
};

// Contoh style sederhana (sesuaikan dengan styling kamu)
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const cropperContainerStyle = {
  position: "relative",
  width: "80%",
  height: "400px",
  background: "#333",
};

const buttonContainerStyle = {
  marginTop: "16px",
  display: "flex",
  gap: "8px",
};

export default CropperModal;
