import { gql } from 'apollo-angular';

const validToken = gql`
query ValidToken {
  validToken {
    msg
  }
}
`;

const addUser = gql`
  subscription {
    addUser {
      id
      name
      email
    }
  }
`;

const newMessage = gql`
  subscription {
    newMessage {
      userId
        content
    }
  }
`;

const localUser = gql`
query user {
  user {
    imgUrl name
  }
}
`;

const users = gql`
query($userId:Int){
  friends(userId:$userId) {
        id  name  imgUrl
        message {
          content
    }
  }
}
`;

export { localUser, addUser, users, newMessage, validToken };
