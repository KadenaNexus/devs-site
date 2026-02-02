import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Trophy,
  FileCheck,
  FileText,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

// Admin menu items
export const adminNavItems: SidebarData['navGroups'] = [
  {
    title: 'Admin',
    items: [
      {
        title: 'Admin Dashboard',
        url: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Pages Management',
        url: '/admin/pages',
        icon: FileText,
      },
      {
        title: 'Challenges Management',
        url: '/admin/challenges',
        icon: ListTodo,
      },
      {
        title: 'Judges Management',
        url: '/admin/judges',
        icon: Users,
      },
      {
        title: 'Submissions Management',
        url: '/admin/submissions',
        icon: FileCheck,
      },
      {
        title: 'Winners Management',
        url: '/admin/winners',
        icon: Trophy,
      },
    ],
  },
]

// Judge menu items
export const judgeNavItems: SidebarData['navGroups'] = [
  {
    title: 'Judge',
    items: [
      {
        title: 'Dashboard',
        url: '/judge-dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Assigned Challenges',   // <- rename
        url: '/challenges',             // kept same route; list will be filtered
        icon: ListTodo,
      },
    ],
  },
]

// Public user menu items
export const publicNavItems: SidebarData['navGroups'] = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Home',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Browse Challenges',
        url: '/public-challenges',
        icon: ListTodo,
      },
      {
        title: 'My Submissions',
        url: '/my-submissions',
        icon: FileCheck,
      },
      {
        title: 'Approved Submissions',
        url: '/approved-submissions',
        icon: ShieldCheck,
      },
      {
        title: 'Winners',
        url: '/winners',
        icon: Trophy,
      },
    ],
  },
]

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Admin',
      logo: Command,
      plan: '',
    },
    {
      name: 'Acme Inc1212',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/judge-dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Challenges',
          url: '/challenges',
          icon: ListTodo,
        },
        // {
        //   title: 'Dashboard',
        //   url: '/',
        //   icon: LayoutDashboard,
        // },
        // {
        //   title: 'Tasks',
        //   url: '/tasks',
        //   icon: ListTodo,
        // },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: Package,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: MessagesSquare,
        // },
        // {
        //   title: 'Users',
        //   url: '/users',
        //   icon: Users,
        // },
        // {
        //   title: 'Secured by Clerk',
        //   icon: ClerkLogo,
        //   items: [
        //     {
        //       title: 'Sign In',
        //       url: '/clerk/sign-in',
        //     },
        //     {
        //       title: 'Sign Up',
        //       url: '/clerk/sign-up',
        //     },
        //     {
        //       title: 'User Management',
        //       url: '/clerk/user-management',
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   title: 'Pages',
    //   items: [
    //     {
    //       title: 'Auth',
    //       icon: ShieldCheck,
    //       items: [
    //         {
    //           title: 'Sign In',
    //           url: '/sign-in',
    //         },
    //         {
    //           title: 'Sign In (2 Col)',
    //           url: '/sign-in-2',
    //         },
    //         {
    //           title: 'Sign Up',
    //           url: '/sign-up',
    //         },
    //         {
    //           title: 'Forgot Password',
    //           url: '/forgot-password',
    //         },
    //         {
    //           title: 'OTP',
    //           url: '/otp',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Errors',
    //       icon: Bug,
    //       items: [
    //         {
    //           title: 'Unauthorized',
    //           url: '/errors/unauthorized',
    //           icon: Lock,
    //         },
    //         {
    //           title: 'Forbidden',
    //           url: '/errors/forbidden',
    //           icon: UserX,
    //         },
    //         {
    //           title: 'Not Found',
    //           url: '/errors/not-found',
    //           icon: FileX,
    //         },
    //         {
    //           title: 'Internal Server Error',
    //           url: '/errors/internal-server-error',
    //           icon: ServerOff,
    //         },
    //         {
    //           title: 'Maintenance Error',
    //           url: '/errors/maintenance-error',
    //           icon: Construction,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: 'Other',
    //   items: [
    //     {
    //       title: 'Settings',
    //       icon: Settings,
    //       items: [
    //         {
    //           title: 'Profile',
    //           url: '/settings',
    //           icon: UserCog,
    //         },
    //         {
    //           title: 'Account',
    //           url: '/settings/account',
    //           icon: Wrench,
    //         },
    //         {
    //           title: 'Appearance',
    //           url: '/settings/appearance',
    //           icon: Palette,
    //         },
    //         {
    //           title: 'Notifications',
    //           url: '/settings/notifications',
    //           icon: Bell,
    //         },
    //         {
    //           title: 'Display',
    //           url: '/settings/display',
    //           icon: Monitor,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Help Center',
    //       url: '/help-center',
    //       icon: HelpCircle,
    //     },
    //     {
    //       title: 'Judge',
    //       url: '/judge',
    //       icon: HelpCircle,
    //     }
    //   ],
    // },
  ],
}
