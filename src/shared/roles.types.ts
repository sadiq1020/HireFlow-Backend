export const ROLES = {
  ADMIN: 'ADMIN',
  COMPANY: 'COMPANY',
  SEEKER: 'SEEKER',
} as const;

export type TRole = keyof typeof ROLES;
