import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


// dont think this is right 
export const SAVE_BOOK = gql`
  mutation saveBook() {
    {
        savedBooks{
        id
        authors
        description
        title
        image
        link
      }
      _id
      username
      email
      bookCount
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId:$bookId){
      _id
      username
      bookCount
      savedBooks{
        _bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

