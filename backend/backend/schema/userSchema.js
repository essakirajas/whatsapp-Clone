module.exports = `#graphql
scalar Date
scalar Email
scalar Upload
directive @upper on FIELD_DEFINITION
  type user {
    id: ID
    name: String! 
    email: Email!
    password: String
    otp:Int!
    phoneNo:Int
    imgUrl: String
    createdAt:Date!
  }
  
  type Message {
    msg: String
    token: String
    refreshToken :String
  }

  type Query {
    validToken:Message
    validUser(phoneNo:Int!):Message
    login(phoneNo: Int!, otp: String!): Message
    getId : user
    user:user
    users:[user]
  }
  type Mutation{
    signUp(createuser: createUser!,file: Upload): Message
  }
  
  input createUser {
    id: ID
    name: String!
    email: String!
    password: String!
    phoneNo:Int
    createdAt:Date
  }

  type Subscription{
    addUser:user
  }
`;
