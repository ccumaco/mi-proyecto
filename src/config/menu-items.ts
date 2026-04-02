import {
  faCalendarAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHome,
  faUser,
  faUsers,
  faBuilding,
  faWallet,
  faBell,
  faCog,
  faShieldAlt,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import { Role, type UserRole } from '@/lib/roles';

export interface MenuItem {
  label: string;
  icon: IconDefinition;
  href: string;
  roles: UserRole[];
}

export const MENU_ITEMS: MenuItem[] = [
  // Residente (User)
  {
    label: 'Mis Pagos',
    icon: faWallet,
    href: '/profile/payments',
    roles: [Role.RESIDENT],
  },
  {
    label: 'Anuncios',
    icon: faBell,
    href: '/announcements',
    roles: [Role.RESIDENT, Role.ADMIN],
  },

  // Administrador (Admin)
  {
    label: 'Dashboard',
    icon: faChartBar,
    href: '/admin',
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
  },
  {
    label: 'Gestión de Zonas y Reservas',
    icon: faCalendarAlt,
    href: '/admin/reservas',
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
  },
  {
    label: 'Cobranzas',
    icon: faWallet,
    href: '/admin/cobranzas',
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
  },
  {
    label: 'Comunicados',
    icon: faBell,
    href: '/admin/comunicados',
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
  },
  {
    label: 'Residentes',
    icon: faUsers,
    href: '/admin/residentes',
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
  },
  {
    label: 'Documentos',
    icon: faBuilding,
    href: '/admin/documentos',
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
  },
  {
    label: 'Historial de Acceso',
    icon: faShieldAlt,
    href: '/admin/historial',
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
  },

  // Super Administrador (SuperAdmin)
  {
    label: 'Panel Global',
    icon: faShieldAlt,
    href: '/super-admin',
    roles: [Role.SUPER_ADMIN],
  },
  {
    label: 'Conjuntos',
    icon: faBuilding,
    href: '/super-admin/complexes',
    roles: [Role.SUPER_ADMIN],
  },
  {
    label: 'Configuración',
    icon: faCog,
    href: '/super-admin/settings',
    roles: [Role.SUPER_ADMIN],
  },

  // Compartido
  {
    label: 'Mi Perfil',
    icon: faUser,
    href: '/profile',
    roles: [Role.RESIDENT, Role.ADMIN, Role.SUPER_ADMIN],
  },
];
