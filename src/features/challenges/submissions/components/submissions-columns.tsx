import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table'
import { submissionStatuses } from '../data/data'
import { type Submission } from '../../data/submissions-schema'

export const submissionsColumns: ColumnDef<Submission>[] = [
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
    accessorKey: 'developer_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Developer' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('developer_name')}</span>
    ),
  },
  {
    accessorKey: 'project_title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project Title' />
    ),
    cell: ({ row }) => (
      <span className='max-w-48 truncate'>{row.getValue('project_title')}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>{row.getValue('email')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = submissionStatuses.find(
        (s) => s.value === row.getValue('status')
      )

      if (!status) {
        return <Badge variant='outline'>{row.getValue('status')}</Badge>
      }

      return (
        <div className='flex items-center gap-2'>
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
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Submitted' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue<string>('created_at'))
      return <span className='text-sm'>{date.toLocaleDateString()}</span>
    },
  },
  {
    accessorKey: 'github_url',
    header: () => <span className='text-sm'>GitHub</span>,
    cell: ({ row }) => {
      const url = row.getValue<string>('github_url')
      return url ? (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1 text-blue-500 hover:underline'
        >
          <ExternalLink className='h-4 w-4' />
        </a>
      ) : (
        <span className='text-muted-foreground text-sm'>N/A</span>
      )
    },
  },
  {
    accessorKey: 'demo_url',
    header: () => <span className='text-sm'>Demo</span>,
    cell: ({ row }) => {
      const url = row.getValue<string>('demo_url')
      return url ? (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1 text-blue-500 hover:underline'
        >
          <ExternalLink className='h-4 w-4' />
        </a>
      ) : (
        <span className='text-muted-foreground text-sm'>N/A</span>
      )
    },
  },
]