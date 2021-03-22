import { gql } from 'apollo-server-express' 
export default gql`
type Channel{
    id: Int!
    channelname: String!
    messages: [Message!]!
    users: [User!]!
  }
  type Query{
      getChannel(id: Int!) : Channel!
      allChannels :[Channel!]!
  }

type createChannelResponse {
    ok: Boolean!
    errors: [Error!]
}

type VoidResponse {
    ok:Boolean!
    errors:[Error!]
}

type Mutation{
    createChannel( channelname: String!) : createChannelResponse!
    addChannelMember (email:String!, channel_id: Int!) : VoidResponse!
}
`