import React from 'react';
import Container from './style/Container';

export default function ChatAppContainer(props) {
  return (
    <Container>{props.children}</Container>
  );
}
