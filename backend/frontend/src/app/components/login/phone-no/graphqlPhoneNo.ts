import { gql } from 'apollo-angular';

const ValidateUser = gql`
query ValidUser($phoneNo: Int!) {
  validUser(phoneNo: $phoneNo) {
    msg
  }
}
`;

export { ValidateUser };