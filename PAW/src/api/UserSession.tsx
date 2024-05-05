import { User } from "../models/User";

const loggedInUser: User = {
  id: "1",
  firstName: "John",
  lastName: "Doe"
};

class UserSession {
  static getUser(): User {
    return loggedInUser;
  }
}

export default UserSession;
