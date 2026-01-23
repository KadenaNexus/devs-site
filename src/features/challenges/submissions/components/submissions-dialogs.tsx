import { showSubmittedData } from '@/lib/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { SubmissionsMutateDrawer } from './submissions-mutate-drawer'
import { useSubmissions } from './submissions-provider'

export function SubmissionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, userId } = useSubmissions()
  return (
    <>
      <SubmissionsMutateDrawer
        key='submission-view-score'
        open={open === 'view-score'}
        onOpenChange={() => setOpen('view-score')}
        currentRow={currentRow ?? undefined}
        userId={userId}
      />

      {currentRow && (
        <>
          <ConfirmDialog
            key='submission-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following submission has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete submission by ${currentRow.developer_name}?`}
            desc={
              <>
                You are about to delete a submission by{' '}
                <strong>{currentRow.developer_name}</strong> for project{' '}
                <strong>{currentRow.project_title}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
