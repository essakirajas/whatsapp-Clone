module.exports = `#graphql

type friendsDetails{
  name : String
  id :Int
  imgUrl:String
  message:message
}
type Query{
  friends(userId:Int):[friendsDetails]
}

type Subscription{
  newMessage : message
}

`;
