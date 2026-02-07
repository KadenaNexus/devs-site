import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type SubmissionWithDetails } from '../types/submission'
import { AdminSubmissionsRowActions } from './admin-submissions-row-actions'

export const createAdminSubmissionsColumns = (
  onViewDetails?: (submission: SubmissionWithDetails) => void
): ColumnDef<SubmissionWithDetails>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'project_title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[400px] truncate font-medium'>
            {row.getValue('project_title')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'challenge_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Challenge' />
    ),
    cell: ({ row }) => {
      return (
        <div className='text-sm'>
          {row.getValue('challenge_name')}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variants: Record<
        string,
        'default' | 'secondary' | 'destructive' | 'outline'
      > = {
        approved: 'default',
        pending: 'secondary',
        rejected: 'destructive',
      }
      return (
        <Badge variant={variants[status] || 'outline'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'average_score',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Avg Score' />
    ),
    cell: ({ row }) => {
      const score = row.getValue('average_score') as number
      return (
        <div className='text-sm font-medium'>
          {score > 0 ? score.toFixed(2) : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'judge_names',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Judges' />
    ),
    cell: ({ row }) => {
      return (
        <div className='max-w-[200px] truncate text-sm'>
          {row.getValue('judge_names')}
        </div>
      )
    },
  },
  {
    accessorKey: 'is_public',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Visibility' />
    ),
    cell: ({ row }) => {
      const isPublic = row.getValue('is_public') as boolean
      return (
        <Badge variant={isPublic ? 'default' : 'outline'}>
          {isPublic ? 'Public' : 'Private'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Submitted' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className='text-sm'>
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <AdminSubmissionsRowActions row={row} onViewDetails={onViewDetails} />,
  },
]
