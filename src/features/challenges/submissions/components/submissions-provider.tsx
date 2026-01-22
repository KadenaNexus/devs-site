import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Submission } from '../../data/submissions-schema'

type SubmissionsDialogType = 'view' | 'delete'

type SubmissionsContextType = {
  open: SubmissionsDialogType | null
  setOpen: (str: SubmissionsDialogType | null) => void
  currentRow: Submission | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Submission | null>>
}

const SubmissionsContext = React.createContext<SubmissionsContextType | null>(null)

export function SubmissionsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SubmissionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Submission | null>(null)

  return (
    <SubmissionsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SubmissionsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSubmissions = () => {
  const submissionsContext = React.useContext(SubmissionsContext)

  if (!submissionsContext) {
    throw new Error('useSubmissions has to be used within <SubmissionsContext>')
  }

  return submissionsContext
}