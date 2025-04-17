module.exports = `#graphql
scalar Date
scalar Upload
type message{
id:ID
content:String
fileUrl:String
userId:Int
receiverId:Int
createdAt:Date
}

type userDetail{
name :String
email:String
imgUrl:String
}

type Query{
  messages(sender:Int,receiver:Int):[message]
  userDetails(receiverId:Int):userDetail
}

type Mutation{
  postMessage(newMsg:newMessage,file:Upload):message
}
  input newMessage {
  content:String!

  userId:Int!
  receiverId:Int
}

type Subscription {
  Messages(userId: Int!, receiverId: Int!): message
}
`;