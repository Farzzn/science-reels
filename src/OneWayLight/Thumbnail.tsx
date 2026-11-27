import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export const OneWayLightThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Img
        src={staticFile("onewaylight/thumbnail.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
