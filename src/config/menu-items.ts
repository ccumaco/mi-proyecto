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
  faGlobe,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import { Role, type UserRole } from '@/lib/roles';

export interface MenuItem {
  labelKey: string;
  icon: IconDefinition;
  href: string;
  roles: UserRole[];
}

export const MENU_ITEMS: MenuItem[] = [
  // --- ROL: RESIDENTE ---
  {
    labelKey: 'payments',
    icon: faWallet,
    href: '/profile/payments',
    roles: [Role.RESIDENT],
  },
  {
    labelKey: 'announcements',
    icon: faBell,
    href: '/announcements',
    roles: [Role.RESIDENT],
  },

  // --- ROL: ADMINISTRADOR (Gestión Operativa del Conjunto) ---
  {
    labelKey: 'dashboard',
    icon: faChartBar,
    href: '/admin',
    roles: [Role.ADMIN],
  },
  {
    labelKey: 'towers',
    icon: faBuilding,
    href: '/admin/propiedad/torres',
    roles: [Role.ADMIN],
  },
  {
    labelKey: 'residents',
    icon: faUsers,
    href: '/admin/residentes',
    roles: [Role.ADMIN],
  },
  {
    labelKey: 'collections',
    icon: faWallet,
    href: '/admin/cobranzas',
    roles: [Role.ADMIN],
  },
  {
    labelKey: 'reservations',
    icon: faCalendarAlt,
    href: '/admin/reservas',
    roles: [Role.ADMIN],
  },
  {
    labelKey: 'announcements_admin',
    icon: faBell,
    href: '/admin/comunicados',
    roles: [Role.ADMIN],
  },
  {
    labelKey: 'documents',
    icon: faBuilding,
    href: '/admin/documentos',
    roles: [Role.ADMIN],
  },
  {
    labelKey: 'access_history',
    icon: faShieldAlt,
    href: '/admin/historial',
    roles: [Role.ADMIN],
  },

  // --- ROL: SUPER ADMINISTRADOR (Gestión de Plataforma y Negocio) ---
  {
    labelKey: 'global_panel',
    icon: faGlobe,
    href: '/super-admin',
    roles: [Role.SUPER_ADMIN],
  },
  {
    labelKey: 'complexes',
    icon: faBuilding,
    href: '/super-admin/complexes',
    roles: [Role.SUPER_ADMIN],
  },
  {
    labelKey: 'global_users',
    icon: faUsers,
    href: '/super-admin/users',
    roles: [Role.SUPER_ADMIN],
  },
  {
    labelKey: 'platform_subscriptions',
    icon: faCreditCard,
    href: '/super-admin/subscriptions',
    roles: [Role.SUPER_ADMIN],
  },
  {
    labelKey: 'settings',
    icon: faCog,
    href: '/super-admin/settings',
    roles: [Role.SUPER_ADMIN],
  },

  // --- COMPARTIDO ---
  {
    labelKey: 'profile',
    icon: faUser,
    href: '/profile',
    roles: [Role.RESIDENT, Role.ADMIN, Role.SUPER_ADMIN],
  },
];
