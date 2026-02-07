import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Challenge } from '@/features/challenges/data/schema'
import { AdminChallengesRowActions } from './admin-challenges-row-actions'

export const createAdminChallengesColumns = (
  onEdit?: (challenge: Challenge) => void
): ColumnDef<Challenge>[] => [
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
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px] truncate font-mono text-xs'>
        {row.getValue('id')}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('title')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      return (
        <div className='max-w-[400px] truncate text-sm text-muted-foreground'>
          {row.getValue('description')}
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
        open: 'default',
        closed: 'secondary',
        draft: 'outline',
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
    accessorKey: 'prize_pool',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Prize Pool' />
    ),
    cell: ({ row }) => {
      return (
        <div className='text-sm'>
          {row.getValue('prize_pool') || 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className='text-sm'>
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )
    },
  },
  {
    accessorKey: 'timeline',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Timeline' />
    ),
    cell: ({ row }) => {
      return (
        <div className='text-sm'>
          {row.getValue('timeline') || 'N/A'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <AdminChallengesRowActions row={row} onEdit={onEdit} />,
  },
]
