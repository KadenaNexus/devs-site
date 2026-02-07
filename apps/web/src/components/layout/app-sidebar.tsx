import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData, adminNavItems, judgeNavItems, publicNavItems } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { useAdminStore } from '@/stores/admin-store'
import { supabase } from '@/services/supabase'
import { useQuery } from '@tanstack/react-query'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { isAuthenticated: isAdmin } = useAdminStore()

  // Get current user data
  const { data: user, isLoading: roleLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user
    },
    staleTime: 5 * 60 * 1000,
  })

  const userRole = (user?.user_metadata?.role as string | undefined)?.toLowerCase() || null

  // Determine which nav items to show based on role
  // Default to public navigation for regular users
  const navGroups = isAdmin || userRole === 'admin'
    ? adminNavItems
    : userRole === 'judge'
    ? judgeNavItems
    : publicNavItems

  // Avoid flashing the wrong menu while role is loading
  const safeNavGroups = roleLoading && !isAdmin ? [] : navGroups

  // Dynamic team name based on user role
  const teamName = userRole === 'admin' 
    ? 'Admin Panel' 
    : userRole === 'judge' 
    ? 'Judge Dashboard' 
    : 'Challenge Platform'

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={[{
          name: teamName,
          logo: sidebarData.teams[0].logo,
          plan: userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : '',
        }]} />
      </SidebarHeader>
      <SidebarContent>
        {safeNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.user_metadata?.username || user?.email?.split('@')[0] || 'User',
          email: user?.email || '',
          avatar: user?.user_metadata?.avatar_url || '',
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
