let users = [];

class UserRepo {
  static addUser(user) {
    users.push(user);
  }

  static getUsers() {
    return users;
  }
}

export default UserRepo;
