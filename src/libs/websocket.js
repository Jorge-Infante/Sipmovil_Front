class WebSocketService {

  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect(chatURL) {
    const path = `ws://localhost:8000/ws/chat/${chatURL}/`;
    console.log("connect socket: "+path);
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log('websocket open');
    }

    this.socketRef.onmessage = (e) => {
      console.log('websocket onmessage')
      console.log(e.data)
      this.socketNewMessage(e.data);
    }
    this.socketRef.onerror = e => {
      console.log(e.message);
    }
    this.socketRef.onclose = e => {
      console.log('websocket close');
      this.connect();
    }
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0){
      return;
    }
    if (command === 'messages') {
      this.callbacks[command](parsedData.messages);
    }
    if (command === 'new_message') {
      this.callbacks[command](parsedData.message);
    }
  }

  fetchMessages(username, chatId) {
    this.sendMessage({
      command: 'fetch_messages',
      username: username,
      chatId: chatId
    })
  }

  disconnect(){
    this.socketRef.close();
  }

  newChatMessage(message) {
    this.sendMessage({
      command: 'new_message',
      from: message.from,
      message: message.content,
      chatId: message.chatId
    });
  }

  addCallbacks(messagesCallback, newMessageCallback) {
    this.callbacks['messages'] = messagesCallback;
    this.callbacks['new_message'] = newMessageCallback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data}))
    } catch (err) {
      console.log(err.message);
    }
  }

  state() {
    return this.socketRef.readyState;
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;