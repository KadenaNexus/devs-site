import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type WinnerWithDetails } from '../types/winner'
import { AdminWinnersRowActions } from './admin-winners-row-actions'

export const adminWinnersColumns: ColumnDef<WinnerWithDetails>[] = [
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
    accessorKey: 'rank',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rank' />
    ),
    cell: ({ row }) => {
      const rank = row.getValue('rank') as number
      const config: Record<
        number,
        { label: string; variant: 'default' | 'secondary' | 'outline' }
      > = {
        1: { label: '🥇 1st Place', variant: 'default' },
        2: { label: '🥈 2nd Place', variant: 'secondary' },
        3: { label: '🥉 3rd Place', variant: 'outline' },
      }

      if (rank <= 3) {
        return <Badge variant={config[rank].variant}>{config[rank].label}</Badge>
      }

      return <Badge variant='outline'>{rank}th Place</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'challenge_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Challenge' />
    ),
    cell: ({ row }) => {
      return (
        <div className='max-w-[300px] truncate font-medium'>
          {row.getValue('challenge_name')}
        </div>
      )
    },
  },
  {
    accessorKey: 'project_title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project' />
    ),
    cell: ({ row }) => {
      return (
        <div className='max-w-[300px] truncate'>
          {row.getValue('project_title')}
        </div>
      )
    },
  },
  {
    accessorKey: 'developer_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Winner' />
    ),
    cell: ({ row }) => {
      return (
        <div className='text-sm'>
          {row.getValue('developer_name')}
        </div>
      )
    },
  },
  {
    accessorKey: 'prize_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Prize' />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('prize_amount') as number | undefined
      return (
        <div className='text-sm font-medium'>
          {amount ? `$${amount.toLocaleString()}` : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'announced_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Announced' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('announced_at'))
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
    cell: ({ row }) => <AdminWinnersRowActions row={row} />,
  },
]
