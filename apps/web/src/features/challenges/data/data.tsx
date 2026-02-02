import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  AlertCircle,
  Timer,
  HelpCircle,
  CircleOff,
} from 'lucide-react'

export const statuses = [
  {
    label: 'Open',
    value: 'open' as const,
    icon: Circle,
  },
  {
    label: 'In Progress',
    value: 'in_progress' as const,
    icon: Timer,
  },
  {
    label: 'Completed',
    value: 'completed' as const,
    icon: CheckCircle,
  },
  {
    label: 'Closed',
    value: 'closed' as const,
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low' as const,
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium' as const,
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'high' as const,
    icon: ArrowUp,
  },
  {
    label: 'Critical',
    value: 'critical' as const,
    icon: AlertCircle,
  },
]
