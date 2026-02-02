import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { fetchChallenges } from '@/services/challenges'
import { getAssignedChallenges } from '@/services/judges'
import { fetchPages, deletePage, duplicatePage } from '@/services/pages'
import { supabase } from '@/services/supabase'
import { Plus, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminStore } from '@/stores/admin-store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/pages-columns'

export function PagesManagement() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [globalFilter, setGlobalFilter] = useState('')

  const {
    data: pages = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: () => fetchPages(),
  })

  // Debug logging
  console.log('Pages query:', { pages, isLoading, error })

  const deleteMutation = useMutation({
    mutationFn: deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] })
      toast.success('Page deleted successfully')
      setDeleteId(null)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const duplicateMutation = useMutation({
    mutationFn: duplicatePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] })
      toast.success('Page duplicated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleView = (id: string) => {
    const page = pages.find((p) => p.id === id)
    if (page) {
      window.open(`/page/${page.slug}`, '_blank')
    }
  }

  const handleEdit = (id: string) => {
    navigate({ to: '/admin/pages/$id/edit', params: { id } })
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate(id)
  }

  const table = useReactTable({
    data: pages,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    meta: {
      onView: handleView,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onDuplicate: handleDuplicate,
    },
  })

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <Trophy className='h-5 w-5' />
          <span className='font-semibold'>Admin Dashboard</span>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pages Management
              </h2>
              <p className='text-muted-foreground'>
                Manage your website pages and content
              </p>
            </div>
            <Button onClick={() => navigate({ to: '/admin/pages/new' })}>
              <Plus className='mr-2 h-4 w-4' />
              Create Page
            </Button>
          </div>

          <div className='flex items-center gap-4'>
            <Input
              placeholder='Search pages...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='max-w-sm'
            />
          </div>

          {error && (
            <div className='rounded-md border p-4 bg-red-50 text-sm text-red-700'>
              <div className='flex items-start justify-between'>
                <div>
                  <strong className='block'>Failed to load pages</strong>
                  <div className='mt-1'>{String((error as Error)?.message || error)}</div>
                </div>
                <div className='ms-4 flex-shrink-0'>
                  <Button variant='outline' onClick={() => refetch()}>
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No pages found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Main>
    </>
  )
}
