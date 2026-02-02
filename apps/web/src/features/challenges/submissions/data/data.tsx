import { CheckCircle, Clock, XCircle } from 'lucide-react'

export const submissionStatuses = [
  {
    label: 'Pending',
    value: 'pending',
    icon: Clock,
  },
  {
    label: 'Approved',
    value: 'approved',
    icon: CheckCircle,
  },
  {
    label: 'Rejected',
    value: 'rejected',
    icon: XCircle,
  },
]
