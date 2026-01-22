import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table'
import { statuses } from '../data/data'
import { type Challenge } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const challengesColumns: ColumnDef<Challenge>[] = [
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
    cell: ({ row }) => <div className='w-[80px] text-xs'>{row.getValue<string>('id').slice(0, 8)}...</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
        {row.getValue('title')}
      </span>
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <span className='max-w-48 truncate text-sm text-muted-foreground'>
        {row.getValue('description')}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return <Badge variant='outline'>{row.getValue('status')}</Badge>
      }

      return (
        <div className='flex w-[120px] items-center gap-2'>
          {status.icon && (
            <status.icon className='text-muted-foreground size-4' />
          )}
          <span className='text-sm'>{status.label}</span>
        </div>
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
    cell: ({ row }) => (
      <span className='text-sm'>{row.getValue('prize_pool') || 'N/A'}</span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue<string>('created_at'))
      return <span className='text-sm'>{date.toLocaleDateString()}</span>
    },
  },
  {
    id: 'view',
    header: () => <span className='text-sm'>Actions</span>,
    cell: ({ row }) => {
      const navigate = useNavigate()
      const challenge = row.original

      return (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => {
            navigate({
              to: '/challenges/$id/submissions',
              params: { id: challenge.id },
            })
          }}
        >
          <Eye className='mr-2 h-4 w-4' />
          View
        </Button>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]