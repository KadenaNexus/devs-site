import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Challenge } from '../data/schema'

type ChallengesDialogType = 'create' | 'update' | 'delete' | 'import'

type ChallengesContextType = {
  open: ChallengesDialogType | null
  setOpen: (str: ChallengesDialogType | null) => void
  currentRow: Challenge | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Challenge | null>>
}

const ChallengesContext = React.createContext<ChallengesContextType | null>(null)

export function ChallengesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ChallengesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Challenge | null>(null)

  return (
    <ChallengesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ChallengesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useChallenges = () => {
  const challengesContext = React.useContext(ChallengesContext)

  if (!challengesContext) {
    throw new Error('useChallenges has to be used within <ChallengesContext>')
  }

  return challengesContext
}