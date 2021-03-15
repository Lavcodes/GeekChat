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
  
  type RegisterResponse {
      ok : Boolean!
      user : User
      errors : [Error!]
  }

  type LoginResponse {
      ok : Boolean!
      token : String
      refreshToken : String
      errors : [Error!] 
  }

  type Mutation {
      Register(username : String! , email : String! , password : String!) : RegisterResponse!
      Login(email : String!, password : String!) : LoginResponse!
  }

`