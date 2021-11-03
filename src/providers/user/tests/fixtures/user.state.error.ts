import type { UserStateInterface } from "../../types/user.state";

const UserErrorState: UserStateInterface = {
  profile: {
    username: "test-user",
    email: "test@sharedvisionsolutions.com",
    avatar: "/path/to/chat/time",
  },
  login: false,
  transaction: false,
  error: "AuthExpired",
};

export default UserErrorState;
