import { gql } from "apollo-angular";

const receiverDetails = gql`
query UserDetails($receiverId: Int) {
  userDetails(receiverId: $receiverId) {
    name
    email
    imgUrl
  }
}`;

const messages = gql`
query GetId($sender: Int, $receiver: Int) {
  messages(sender: $sender, receiver: $receiver) {
    userId
    fileUrl
    content
    createdAt
  }
}
`;

const Messages = gql`
  subscription Messages($userId: Int!, $receiverId: Int!) {
    Messages(userId: $userId, receiverId: $receiverId) {
      userId
      receiverId
        fileUrl
      content
      createdAt
    }
  }
`;

const sendMessage = gql`
mutation postMessage($newMsg: newMessage, $file: Upload) {
  postMessage(newMsg: $newMsg, file: $file) {
    fileUrl
    content
  }
}
`;



export { receiverDetails, messages, Messages, sendMessage }