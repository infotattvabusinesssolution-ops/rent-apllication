export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  SUPPORT: 'SUPPORT',
};

export const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'],
  [ROLES.ADMIN]: [
    'dashboard',
    'ads',
    'pending-ads',
    'banners',
    'subscriptions',
    'users',
    'leads',
    'reports',
    'visitor-win',
    'analytics',
    'settings',
  ],
  [ROLES.MODERATOR]: [
    'dashboard',
    'ads',
    'pending-ads',
    'reports',
  ],
  [ROLES.SUPPORT]: [
    'dashboard',
    'users',
    'subscriptions',
    'leads',
    'visitor-win',
  ],
};

export const hasPermission = (userRole, pageKey) => {
  if (!userRole) return false;
  const allowed = PERMISSIONS[userRole];
  if (!allowed) return false;
  if (allowed.includes('*')) return true;
  return allowed.includes(pageKey);
};
