import type { UserStateInterface } from "../../types/user.state";

const UserTransactionState: UserStateInterface = {
  profile: {
    username: "test-user",
    email: "test@sharedvisionsolutions.com",
    avatar: "/path/to/chat/time",
  },
  login: false,
  transaction: true,
  error: null,
};

export default UserTransactionState;
