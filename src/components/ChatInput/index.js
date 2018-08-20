import React from 'react';
import { Input } from 'antd';
const Search = Input.Search;
export default function ChatInput(props) {
  return (
    <Search
      placeholder="input search text"
      enterButton="Send"
      size="large"
      name="input"
      value={props.input}
      onSearch={value => {
        console.log(value);
        props.sendMessage(value);
      }}
      onChange={props.onChange}
    />
  );
}
