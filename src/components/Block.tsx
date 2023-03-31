import React from "react";

interface BlockProps {
  color: string;
}

const Block: React.FC<BlockProps> = ({ color }) => (
  <div
    style={{
      backgroundColor: color,
      border: "1px solid",
      width: "100%",
      height: "100%",
    }}
  ></div>
);

export default Block;
