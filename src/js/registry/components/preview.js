import React from 'react';


export function BasicPreview(props) {
  return <div style={{padding: '10px'}} onClick={props.onClick}>{props.name}</div>;
}
