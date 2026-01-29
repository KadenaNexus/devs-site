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

  // Get current user role (normalize to lowercase for safety)
  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return (user?.user_metadata?.role as string | undefined)?.toLowerCase() || null
    },
    staleTime: 5 * 60 * 1000,
  })

  // Determine which nav items to show based on role
  const navGroups = isAdmin || userRole === 'admin'
    ? adminNavItems
    : userRole === 'judge'
    ? judgeNavItems
    : userRole === 'public'
    ? publicNavItems
    : sidebarData.navGroups

  // Avoid flashing the wrong menu while role is loading
  const safeNavGroups = roleLoading && !isAdmin ? [] : navGroups

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {safeNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
