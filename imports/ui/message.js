import React, { useState } from "react";

export default function Message({ message , ref}) {
  return <>
    {message && (
      <div ref={ref} className={ 'message ' + message.type}>
        <h1>{message.type}</h1>
        <p>{message.body}</p>
        <p>{message.source}</p>
        <p>{message._id}</p>
      </div>
    )}
  </>;
}
