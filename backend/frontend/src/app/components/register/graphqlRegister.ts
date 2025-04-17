import { gql } from 'apollo-angular';

const registerMutation = gql`
  mutation signUp($createuser: createUser!,$file: Upload) {
    signUp(createuser: $createuser, file: $file) {
        msg
    }
  }
`;
export { registerMutation };