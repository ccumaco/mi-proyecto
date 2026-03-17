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

export interface MenuItem {
  label: string;
  icon: IconDefinition;
  href: string;
  roles: ('user' | 'admin' | 'super-admin')[];
}

export const MENU_ITEMS: MenuItem[] = [
  // Residente (User)
  {
    label: 'Mis Pagos',
    icon: faWallet,
    href: '/profile/payments',
    roles: ['user'],
  },
  {
    label: 'Anuncios',
    icon: faBell,
    href: '/announcements',
    roles: ['user', 'admin'],
  },

  // Administrador (Admin)
  {
    label: 'Dashboard',
    icon: faChartBar,
    href: '/admin',
    roles: ['admin', 'super-admin'],
  },
  {
    label: 'Gestión de Zonas y Reservas',
    icon: faCalendarAlt,
    href: '/admin/reservas',
    roles: ['admin', 'super-admin'],
  },
  {
    label: 'Cobranzas',
    icon: faWallet,
    href: '/admin/cobranzas',
    roles: ['admin', 'super-admin'],
  },
  {
    label: 'Comunicados',
    icon: faBell,
    href: '/admin/comunicados',
    roles: ['admin', 'super-admin'],
  },
  {
    label: 'Residentes',
    icon: faUsers,
    href: '/admin/residentes',
    roles: ['admin', 'super-admin'],
  },
  {
    label: 'Documentos',
    icon: faBuilding,
    href: '/admin/documentos',
    roles: ['admin', 'super-admin'],
  },
  {
    label: 'Historial de Acceso',
    icon: faShieldAlt,
    href: '/admin/historial',
    roles: ['admin', 'super-admin'],
  },

  // Super Administrador (SuperAdmin)
  {
    label: 'Panel Global',
    icon: faShieldAlt,
    href: '/super-admin',
    roles: ['super-admin'],
  },
  {
    label: 'Conjuntos',
    icon: faBuilding,
    href: '/super-admin/complexes',
    roles: ['super-admin'],
  },
  {
    label: 'Configuración',
    icon: faCog,
    href: '/super-admin/settings',
    roles: ['super-admin'],
  },

  // Compartido
  {
    label: 'Mi Perfil',
    icon: faUser,
    href: '/profile',
    roles: ['user', 'admin', 'super-admin'],
  },
];
