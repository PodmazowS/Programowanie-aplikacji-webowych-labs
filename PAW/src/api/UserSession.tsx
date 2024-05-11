import { User } from "../models/User";

const users: User[] = [
  { id: "1", firstName: "John", lastName: "Doe", role: "admin" },
  { id: "2", firstName: "Jane", lastName: "Smith", role: "developer" },
  { id: "3", firstName: "Alice", lastName: "Johnson", role: "devops" }
];

class UserSession {
  static getUser(): User {
    return users[0];
  }

  static getAllUsers(): User[] {
    return users;
  }
}

export default UserSession;
