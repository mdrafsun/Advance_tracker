class AdminProxy {
  constructor(adminService, currentUser) {
    this.adminService = adminService;
    this.role = (currentUser && currentUser.role) || 'user';
  }
  ensureAdmin() {
    if (this.role !== 'admin') throw new Error('Access denied: admin role required');
  }
  async listUsers()  { this.ensureAdmin(); return this.adminService.listUsers(); }
  async deleteUser(userId) { this.ensureAdmin(); return this.adminService.deleteUser(userId); }
  async broadcast(message){ this.ensureAdmin(); return this.adminService.broadcast(message); }
}

module.exports = AdminProxy;
