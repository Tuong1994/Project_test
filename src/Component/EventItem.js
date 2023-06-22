import React from "react";

const EventItem = ({ eventInfo, content }) => {
  return (
    <div
      style={{
        width: "100%",
        padding: "5px",
        overflow: "hidden",
        borderRadius: "4px",
        backgroundColor: eventInfo.event.backgroundColor,
      }}
    >
      <small>{content[0]}</small>
      <br />
      <small>{content[1]}</small>
    </div>
  );
};

export default EventItem;
