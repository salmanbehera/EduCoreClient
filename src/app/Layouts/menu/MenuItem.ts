export interface MenuItem {
  title: string;
  icon: string;
  route?: string;  // optional for items that have routes
  children?: MenuItem[]; // Optional for nested items
  //actions?: MenuItem[]; // Optional for actions under menu items
  //showChildren?: boolean; // Track if children are expanded
}