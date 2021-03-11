import { gql } from 'apollo-server-express' 
export default gql`
type Message {
    id:Int!
    text: String!
    user: User!
    channel: Channel
  }
  type Query{
      getMessage(id: Int!) : Message!
      allMessages :[Message!]!
  }
  type Mutation{
      createMessage(text:String!, channel_id:Int!): Boolean!
  }
`