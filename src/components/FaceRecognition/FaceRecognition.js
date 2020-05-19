import React from "react";

const FaceRecognition = ({ imageUrl }) => {
  return (
    <div className="center ma">
      <div className="absolute ma2">
        <img src={imageUrl} alt="" width="500px" />
      </div>
    </div>
  );
};

export default FaceRecognition;
