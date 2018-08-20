import React from 'react';
import Container from './style/Container';

export default function ChatInputContainer(props) {
  return (
    <Container>{props.children}</Container>
  );
}
