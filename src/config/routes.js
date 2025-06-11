import Home from '../pages/Home';
import BrowseSkills from '../pages/BrowseSkills';
import MySkills from '../pages/MySkills';
import Messages from '../pages/Messages';
import Schedule from '../pages/Schedule';
import Profile from '../pages/Profile';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  browse: {
    id: 'browse',
    label: 'Browse Skills',
    path: '/browse',
    icon: 'Search',
    component: BrowseSkills
  },
  mySkills: {
    id: 'mySkills',
    label: 'My Skills',
    path: '/my-skills',
    icon: 'Star',
    component: MySkills
  },
  messages: {
    id: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: 'MessageCircle',
    component: Messages
  },
  schedule: {
    id: 'schedule',
    label: 'Schedule',
    path: '/schedule',
    icon: 'Calendar',
    component: Schedule
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  }
};

export const routeArray = Object.values(routes);
export const mainNavRoutes = [routes.browse, routes.mySkills, routes.messages, routes.schedule, routes.profile];