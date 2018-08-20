import React, { Component } from 'react';
import { Timeline, Modal, } from 'antd';
import firebase from 'firebase';
import get from 'lodash/get';
import './App.css';
import ChatAppContainer from './components/layout/ChatAppContainer/index';
import ChatHistoryContainer from './components/layout/ChatHistoryContainer';
import ChatInputContainer from './components/layout/ChatInputContainer';
import ChatInput from './components/ChatInput';

var config = {
  apiKey: "AIzaSyAX3vLjAeIihpvfby1E6Oztes0EGuYgD8c",
  authDomain: "ez-chat-assistant.firebaseapp.com",
  databaseURL: "https://ez-chat-assistant.firebaseio.com",
  projectId: "ez-chat-assistant",
  storageBucket: "ez-chat-assistant.appspot.com",
  messagingSenderId: "162552085055"
};
var firebaseApp = firebase.initializeApp(config);
const DB = 'chats';
class App extends Component {
  constructor(props) {
    super(props);
    this.onSendMesage = this.onSendMesage.bind(this);
    this.initNewKey = this.initNewKey.bind(this);
    this.onChangeUserInput = this.onChangeUserInput.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.regenerateMessagesList = this.regenerateMessagesList.bind(this);

    this.state = {
      firebaseApp,
      chatSessionId: '',
      username: '',
      messages: [],
      input: '',
    };
  }
  askForName() {
    this.setState({
      showNameInputModal: true,
    });
  }
  initNewKey() {
    const sessionKey = this.state.firebaseApp.database().ref().child(DB).push().key;
    this.props.history.push({
      pathname: `/${sessionKey}`,
    });
    this.setState({
      chatSessionId: sessionKey,
    })
  }

  regenerateMessagesList(snapshotDict, sessionKey) {
    const messages = [];
    if (snapshotDict) {
      Object.keys(snapshotDict).forEach((key) => {
        messages.push(snapshotDict[key]);
      })
      this.setState({
        chatSessionId: sessionKey,
        messages,
      });
    } else {
      this.initNewKey();
    }
  }
  componentDidMount() {
    // const key = this.state.firebaseApp.database().ref().child('chats').push().key;
    // this.state.firebaseApp.database().ref().child(`chats/${key}`).set({
    //   "aaaaaa": 'hahahaha',
    // });
    this.askForName();

    let sessionKey = get(this.props, 'match.params.chatSessionId', '');
    if (!sessionKey) {
      this.initNewKey();
    } else {
      this.state.firebaseApp.database().ref(`${DB}/${sessionKey}`).once('value').then((snapshot) => {
        console.log('found');
        console.log(snapshot.val());
        const dict = snapshot.val();
        this.regenerateMessagesList(dict, sessionKey);
      })
    }
    this.state.firebaseApp.database().ref(`${DB}/${sessionKey}`).on('value', (snapshot) => {
      this.regenerateMessagesList(snapshot.val(), this.state.chatSessionId);
    })
  }
  onChangeUserInput(event) {
    event.persist();
    const {
      value,
      name,
    } = event.target;
    this.setState((prevState) => {
      prevState[name] = value;
      return prevState;
    })
  }
  onSendMesage(message) {
    const {chatSessionId, username,} = this.state;
    const chatKey = this.state.firebaseApp.database().ref().child(`${DB}/${chatSessionId}/`).push().key;
    console.log(message);
    console.log(chatSessionId);
    console.log(chatKey);
    this.state.firebaseApp.database().ref().child(`${DB}/${chatSessionId}/${chatKey}`).set({
      id: chatKey,
      username,
      content: message,
      time: Date.now(),
    });

    // this.setState((prevState) => {
    //   prevState.messages.push({
    //     username,
    //     content: message,
    //   });
    //   return prevState;
    // })
  }

  handleOk(e) {
    console.log(e);
    this.setState({
      showNameInputModal: false,
    });
  }

  render() {
    return (
      <ChatAppContainer>
        <Modal title="Your Name"
          visible={this.state.showNameInputModal}
          onOk={this.handleOk}
        >
          <input
            placeholder="i.e. David"
            value={this.state.username}
            name="username"
            onChange={this.onChangeUserInput}
          />
        </Modal>
        <ChatHistoryContainer>
          <Timeline>
            {this.state.messages.map((message) => (
              <Timeline.Item key={message.id}><b>{message.username}</b>: {message.content}</Timeline.Item>
            ))}
          </Timeline>
        </ChatHistoryContainer>

        <ChatInputContainer>
          <ChatInput input={this.state.input} onChange={this.onChangeUserInput} sendMessage={this.onSendMesage}/>
        </ChatInputContainer>
      </ChatAppContainer>
    );
  }
}

export default App;
