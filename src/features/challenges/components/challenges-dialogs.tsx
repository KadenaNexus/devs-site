import { showSubmittedData } from '@/lib/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ChallengesImportDialog } from './challenges-import-dialog'
import { ChallengesMutateDrawer } from './challenges-mutate-drawer'
import { useChallenges } from './challenges-provider'

export function ChallengesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useChallenges()
  return (
    <>
      <ChallengesMutateDrawer
        key='challenge-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <ChallengesImportDialog
        key='challenges-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <ChallengesMutateDrawer
            key={`challenge-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='challenge-delete'
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
                'The following challenge has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete this challenge: ${currentRow.title} ?`}
            desc={
              <>
                You are about to delete a challenge <strong>{currentRow.title}</strong>. <br />
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