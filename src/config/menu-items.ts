import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { 
  faHome, 
  faUser, 
  faUsers, 
  faBuilding, 
  faWallet, 
  faBell, 
  faCog, 
  faShieldAlt, 
  faChartBar 
} from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  label: string;
  icon: IconDefinition;
  href: string;
  roles: ('user' | 'admin' | 'super-admin')[];
}

export const MENU_ITEMS: MenuItem[] = [
  // Residente (User)
  { label: 'Dashboard', icon: faHome, href: '/profile', roles: ['user'] },
  { label: 'Mis Pagos', icon: faWallet, href: '/profile/payments', roles: ['user'] },
  { label: 'Anuncios', icon: faBell, href: '/announcements', roles: ['user', 'admin'] },
  
  // Administrador (Admin)
  { label: 'Panel Admin', icon: faChartBar, href: '/admin', roles: ['admin'] },
  { label: 'Residentes', icon: faUsers, href: '/admin/residents', roles: ['admin'] },
  { label: 'Unidades', icon: faBuilding, href: '/admin/units', roles: ['admin'] },
  
  // Super Administrador (SuperAdmin)
  { label: 'Panel Global', icon: faShieldAlt, href: '/super-admin', roles: ['super-admin'] },
  { label: 'Conjuntos', icon: faBuilding, href: '/super-admin/complexes', roles: ['super-admin'] },
  { label: 'Configuración', icon: faCog, href: '/super-admin/settings', roles: ['super-admin'] },

  // Compartido
  { label: 'Mi Perfil', icon: faUser, href: '/profile', roles: ['user', 'admin', 'super-admin'] },
];
