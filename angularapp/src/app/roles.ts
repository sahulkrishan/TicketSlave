export enum Roles {
  ADMIN = 'Admin',
  USER = 'User'
}

// Define permissions for each role
export const rolePermissions = {
  [Roles.ADMIN]: ['canEditUsers', 'canDeletePosts', 'canManageRoles'],
  [Roles.USER]: ['canViewContent', 'canComment'],
};
