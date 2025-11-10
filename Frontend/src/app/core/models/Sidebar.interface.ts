export interface MenuItem {
  name: string;
  path?: string;
  icon: string;
  submenu?: MenuItem[];
  expanded?: boolean;
  badge?: string;
  badgeColor?: string;
}
