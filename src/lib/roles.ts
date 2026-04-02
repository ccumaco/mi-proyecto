/**
 * Roles canónicos tal como vienen de la base de datos.
 * Úsalos siempre en lugar de strings literales.
 */
export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  RESIDENT: 'RESIDENT',
} as const;

export type UserRole = (typeof Role)[keyof typeof Role];

/** Etiquetas en español para mostrar en la UI. */
export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Administrador',
  ADMIN: 'Administrador',
  RESIDENT: 'Residente',
};

/**
 * Normaliza cualquier valor de rol (legacy o del backend) al formato canónico de la DB.
 * Acepta variantes como 'admin', 'super-admin', 'superadmin', 'user', 'resident', etc.
 */
export function normalizeRole(raw?: string | null): UserRole {
  const r = String(raw ?? '')
    .trim()
    .toUpperCase()
    .replace(/[- ]/g, '_');

  if (r === 'SUPER_ADMIN' || r === 'SUPERADMIN') return Role.SUPER_ADMIN;
  if (r === 'ADMIN' || r === 'ADMINISTRATOR') return Role.ADMIN;
  if (r === 'RESIDENT' || r === 'USER') return Role.RESIDENT;
  return Role.RESIDENT;
}

/** Devuelve la etiqueta en español para un rol dado. */
export function getRoleLabel(role?: string | null): string {
  return ROLE_LABELS[normalizeRole(role)];
}
