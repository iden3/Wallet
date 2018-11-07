import * as ICONS from './icons';

export const DASHBOARD = {
  MAIN: '/dashboard',
  KEY: 'Dashboard',
  ICON: ICONS.DASHBOARD,
  CHILDREN: [],
  ORDER: 1,
};
export const CLAIMS = {
  MAIN: '/claims',
  KEY: 'Claims',
  ICON: ICONS.CLAIMS,
  CHILDREN: [],
  ORDER: 0,
};
export const HISTORY = {
  MAIN: '/history',
  KEY: 'History',
  ICON: ICONS.HISTORY,
  CHILDREN: [],
  ORDER: 3,
};
export const IDENTITIES = {
  MAIN: '/identities',
  KEY: 'Identities',
  CHILDREN: [],
  ORDER: -1, // not shown in main nav-bar
};
export const CREATE_IDENTITY = {
  MAIN: '/create-identity',
  KEY: 'Create identity',
  CHILDREN: [],
  ORDER: -1, // not shown in main nav-bar
};