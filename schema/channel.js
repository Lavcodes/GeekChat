import { gql } from 'apollo-server-express' 
export default gql`
type Channel{
    id: Int!
    channelname: String!
    admin: User
    messages: [Message!]!
    users: [User!]!
  }
  type Query{
      getChannel(id: Int!) : Channel!
      allChannels :[Channel!]!
  }

type Mutation{
    createChannel( channelname: String!) : Boolean!
}
`