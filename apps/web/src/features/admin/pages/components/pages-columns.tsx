import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Copy, Trash } from 'lucide-react'
import { Page } from '../data/schema'
import { formatDistance } from 'date-fns'

export const columns: ColumnDef<Page>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const page = row.original
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{page.title}</span>
          <span className='text-xs text-muted-foreground'>/{page.slug}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return (
        <div className='max-w-md truncate text-sm text-muted-foreground'>
          {description || '—'}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge
          variant={
            status === 'published'
              ? 'default'
              : status === 'draft'
              ? 'secondary'
              : 'outline'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'))
      return (
        <div className='text-sm text-muted-foreground'>
          {formatDistance(date, new Date(), { addSuffix: true })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const page = row.original
      const meta = table.options.meta as any

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* View removed per request */}
            <DropdownMenuItem onClick={() => meta?.onEdit?.(page.id)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onDuplicate?.(page.id)}>
              <Copy className='mr-2 h-4 w-4' />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive'
              onClick={() => meta?.onDelete?.(page.id)}
            >
              <Trash className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
