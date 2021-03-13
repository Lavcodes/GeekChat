import { gql } from 'apollo-server-express' 
export default gql`
type User {
    id: Int!
    username: String!
    email: String!
    password: String!
    channels : [Channel!]!
  }
  type Query{
      getUser(id: Int!) : User!
      allUsers :[User!]!
  }
  type Mutation {
      Register(username : String! , email : String! , password : String!) : Boolean!
  }

`