import { gql } from 'apollo-server-express' 
export default gql`
type Message {
    id:Int!
    text: String!
    user: User!
    channel: Channel!
    createdAt: String!
  }
  type Subscription {
      newChannelMessage(channel_id:Int!) : Message!
  }
  type Query{
      getMessage(id: Int!) : Message!
      allMessages(channel_id:Int!) :[Message!]
  }
  type Mutation{
      createMessage(text:String!, channel_id:Int!): Boolean!
  }
`