export const USERS_RULES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type UserRole = (typeof USERS_RULES)[keyof typeof USERS_RULES];

export const USER_ROLE_VALUES = Object.values(USERS_RULES) as [UserRole, ...UserRole[]];

export const PRIVILEGED_ROLES: UserRole[] = [USERS_RULES.ADMIN, USERS_RULES.SUPER_ADMIN];

export const hasPrivilegedAccess = (role: UserRole): boolean =>
  PRIVILEGED_ROLES.includes(role);
