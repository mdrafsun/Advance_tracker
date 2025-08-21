module.exports = (adminService) => ({
  listUsers:  (adminProxy) => adminProxy.listUsers(),
  deleteUser: (adminProxy, userId) => adminProxy.deleteUser(userId).then(() => ({ ok: true, userId })),
});
