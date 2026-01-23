import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { upsertScore, fetchScoreBySubmissionAndJudge } from '@/services/judges'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { type Submission } from '../../data/submissions-schema'

type SubmissionMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Submission
  userId?: string | null
}

const formSchema = z.object({
  impact: z
    .number()
    .min(0, 'Impact score must be at least 0')
    .max(100, 'Impact score cannot exceed 100'),
  execution: z
    .number()
    .min(0, 'Execution score must be at least 0')
    .max(100, 'Execution score cannot exceed 100'),
  innovation: z
    .number()
    .min(0, 'Innovation score must be at least 0')
    .max(100, 'Innovation score cannot exceed 100'),
  security: z
    .number()
    .min(0, 'Security score must be at least 0')
    .max(100, 'Security score cannot exceed 100'),
  ux_clarity: z
    .number()
    .min(0, 'UX/Clarity score must be at least 0')
    .max(100, 'UX/Clarity score cannot exceed 100'),
  notes: z.string().optional(),
  is_final: z.boolean(),
})

type SubmissionForm = z.infer<typeof formSchema>

export function SubmissionsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  userId,
}: SubmissionMutateDrawerProps) {
  const form = useForm<SubmissionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      impact: 0,
      execution: 0,
      innovation: 0,
      security: 0,
      ux_clarity: 0,
      notes: '',
      is_final: false,
    },
  })

  // Fetch existing score for this submission and judge
  const { data: existingScore, isLoading: scoreLoading } = useQuery({
    queryKey: ['score', currentRow?.id, userId],
    queryFn: () => {
      if (!currentRow?.id || !userId) return null
      return fetchScoreBySubmissionAndJudge(currentRow.id, userId)
    },
    enabled: open && !!currentRow?.id && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 1,
  })

  // Pre-fill form when existing score is loaded
  useEffect(() => {
    if (!scoreLoading && existingScore) {
      form.reset({
        impact: existingScore.impact ?? 0,
        execution: existingScore.execution ?? 0,
        innovation: existingScore.innovation ?? 0,
        security: existingScore.security ?? 0,
        ux_clarity: existingScore.ux_clarity ?? 0,
        notes: existingScore.notes ?? '',
        is_final: existingScore.is_final ?? false,
      })
    } else if (!scoreLoading && !existingScore && open) {
      // Reset form when opening for a new submission
      form.reset({
        impact: 0,
        execution: 0,
        innovation: 0,
        security: 0,
        ux_clarity: 0,
        notes: '',
        is_final: false,
      })
    }
  }, [existingScore, scoreLoading, open, form])

  const { mutate: submitScore, isPending } = useMutation({
    mutationFn: async (data: SubmissionForm) => {
      if (!currentRow) throw new Error('No submission selected')
      if (!userId)
        throw new Error(
          'Unable to identify user. Please refresh and try again.'
        )

      console.log('=== RAW FORM DATA RECEIVED ===', data)
      console.log('Form data types:', {
        impact: { type: typeof data.impact, value: data.impact },
        execution: { type: typeof data.execution, value: data.execution },
        innovation: { type: typeof data.innovation, value: data.innovation },
        security: { type: typeof data.security, value: data.security },
        ux_clarity: { type: typeof data.ux_clarity, value: data.ux_clarity },
      })

      // Ensure every single value is a proper integer 0-100
      const validateScore = (score: unknown, fieldName: string): number => {
        console.log(`[validateScore] Input for ${fieldName}:`, {
          value: score,
          type: typeof score,
        })

        let num: number

        if (typeof score === 'number') {
          num = score
        } else if (typeof score === 'string') {
          num = parseInt(score, 10)
        } else if (score === null || score === undefined) {
          console.warn(`${fieldName} is null/undefined, defaulting to 0`)
          num = 0
        } else {
          console.warn(`${fieldName} has unexpected type, defaulting to 0`)
          num = 0
        }

        if (isNaN(num)) {
          console.warn(`${fieldName} parsed to NaN, defaulting to 0`)
          num = 0
        }

        // Round and clamp
        const rounded = Math.round(num)
        const clamped = Math.max(0, Math.min(100, rounded))

        console.log(`[validateScore] Output for ${fieldName}:`, {
          original: score,
          parsed: num,
          rounded,
          clamped,
          isInteger: Number.isInteger(clamped),
        })

        return clamped
      }

      const scoreData = {
        submission_id: currentRow.id,
        judge_user_id: userId,
        impact: validateScore(data.impact, 'impact'),
        execution: validateScore(data.execution, 'execution'),
        innovation: validateScore(data.innovation, 'innovation'),
        security: validateScore(data.security, 'security'),
        ux_clarity: validateScore(data.ux_clarity, 'ux_clarity'),
        notes:
          data.notes && typeof data.notes === 'string' && data.notes.trim()
            ? data.notes.trim()
            : null,
        is_final: data.is_final === true,
      }

      console.log('=== FINAL SCORE DATA ===', scoreData)
      console.log('=== FINAL TYPE CHECK ===', {
        submission_id: {
          type: typeof scoreData.submission_id,
          value: scoreData.submission_id,
        },
        judge_user_id: {
          type: typeof scoreData.judge_user_id,
          value: scoreData.judge_user_id,
        },
        impact: {
          type: typeof scoreData.impact,
          isInteger: Number.isInteger(scoreData.impact),
          value: scoreData.impact,
        },
        execution: {
          type: typeof scoreData.execution,
          isInteger: Number.isInteger(scoreData.execution),
          value: scoreData.execution,
        },
        innovation: {
          type: typeof scoreData.innovation,
          isInteger: Number.isInteger(scoreData.innovation),
          value: scoreData.innovation,
        },
        security: {
          type: typeof scoreData.security,
          isInteger: Number.isInteger(scoreData.security),
          value: scoreData.security,
        },
        ux_clarity: {
          type: typeof scoreData.ux_clarity,
          isInteger: Number.isInteger(scoreData.ux_clarity),
          value: scoreData.ux_clarity,
        },
        notes: { type: typeof scoreData.notes, value: scoreData.notes },
        is_final: {
          type: typeof scoreData.is_final,
          value: scoreData.is_final,
        },
      })

      // FINAL verification - if ANY score is not an integer, throw
      const scoreFields = [
        'impact',
        'execution',
        'innovation',
        'security',
        'ux_clarity',
      ] as const
      for (const field of scoreFields) {
        const value = scoreData[field]
        if (!Number.isInteger(value)) {
          throw new Error(
            `VALIDATION FAILED: ${field} is not an integer. Value: ${value}, Type: ${typeof value}`
          )
        }
        if (value < 0 || value > 100) {
          throw new Error(
            `VALIDATION FAILED: ${field} out of range [0-100]. Value: ${value}`
          )
        }
      }

      console.log('✓ All validations passed, submitting to database...')
      await upsertScore(scoreData)
      return scoreData
    },
    onSuccess: () => {
      const message = existingScore
        ? 'Score updated successfully!'
        : 'Score submitted successfully!'
      console.log('✓ Success:', message)
      toast.success(message)
      onOpenChange(false)
      form.reset()
    },
    onError: (error: any) => {
      console.error('=== SCORE SUBMISSION ERROR ===')
      console.error('Full error object:', error)
      console.error('Error code:', error?.code)
      console.error('Error message:', error?.message)
      console.error('Error details:', error?.details)
      const errorMessage =
        error?.message || error?.details || 'Failed to submit score'
      toast.error(errorMessage)
    },
  })

  const onSubmit = (data: SubmissionForm) => {
    submitScore(data)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col overflow-y-auto'>
        <SheetHeader className='text-start'>
          <SheetTitle>
            {existingScore ? 'Edit Score' : 'Review Submission'}
          </SheetTitle>
          <SheetDescription>
            {existingScore
              ? 'Update your score for this submission.'
              : 'Review the submission details and add a score.'}
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 space-y-6 overflow-y-auto px-4'>
          {/* Previous Score (if editing) */}
          {existingScore && (
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950'>
              <h3 className='mb-3 text-sm font-semibold text-blue-900 dark:text-blue-100'>
                Previous Score
              </h3>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Impact:</span>
                  <p className='font-medium'>{existingScore.impact}/100</p>
                </div>
                <div>
                  <span className='text-muted-foreground'>Execution:</span>
                  <p className='font-medium'>{existingScore.execution}/100</p>
                </div>
                <div>
                  <span className='text-muted-foreground'>Innovation:</span>
                  <p className='font-medium'>{existingScore.innovation}/100</p>
                </div>
                <div>
                  <span className='text-muted-foreground'>Security:</span>
                  <p className='font-medium'>{existingScore.security}/100</p>
                </div>
                <div className='col-span-2'>
                  <span className='text-muted-foreground'>UX/Clarity:</span>
                  <p className='font-medium'>{existingScore.ux_clarity}/100</p>
                </div>
              </div>
              {existingScore.notes && (
                <div className='mt-3 border-t border-blue-200 pt-3 dark:border-blue-900'>
                  <span className='text-muted-foreground text-sm'>
                    Previous Notes:
                  </span>
                  <p className='text-sm'>{existingScore.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Submission Details */}
          <div className='space-y-4'>
            <div>
              <h3 className='text-muted-foreground text-sm font-semibold'>
                Developer
              </h3>
              <p className='mt-1 text-sm'>{currentRow?.developer_name}</p>
            </div>

            <div>
              <h3 className='text-muted-foreground text-sm font-semibold'>
                Email
              </h3>
              <p className='mt-1 text-sm'>{currentRow?.email}</p>
            </div>

            {currentRow?.discord && (
              <div>
                <h3 className='text-muted-foreground text-sm font-semibold'>
                  Discord
                </h3>
                <p className='mt-1 text-sm'>{currentRow.discord}</p>
              </div>
            )}

            <div>
              <h3 className='text-muted-foreground text-sm font-semibold'>
                Project Title
              </h3>
              <p className='mt-1 text-sm'>{currentRow?.project_title}</p>
            </div>

            {currentRow?.problem_statement && (
              <div>
                <h3 className='text-muted-foreground text-sm font-semibold'>
                  Problem Statement
                </h3>
                <p className='text-muted-foreground mt-1 text-sm'>
                  {currentRow.problem_statement}
                </p>
              </div>
            )}

            {currentRow?.solution_description && (
              <div>
                <h3 className='text-muted-foreground text-sm font-semibold'>
                  Solution Description
                </h3>
                <p className='text-muted-foreground mt-1 text-sm'>
                  {currentRow.solution_description}
                </p>
              </div>
            )}

            {currentRow?.smart_contract_details && (
              <div>
                <h3 className='text-muted-foreground text-sm font-semibold'>
                  Smart Contract Details
                </h3>
                <p className='text-muted-foreground mt-1 text-sm'>
                  {currentRow.smart_contract_details}
                </p>
              </div>
            )}

            {currentRow?.github_url && (
              <div>
                <h3 className='text-muted-foreground text-sm font-semibold'>
                  GitHub URL
                </h3>
                <a
                  href={currentRow.github_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-1 block text-sm text-blue-500 hover:underline'
                >
                  {currentRow.github_url}
                </a>
              </div>
            )}

            {currentRow?.demo_url && (
              <div>
                <h3 className='text-muted-foreground text-sm font-semibold'>
                  Demo URL
                </h3>
                <a
                  href={currentRow.demo_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-1 block text-sm text-blue-500 hover:underline'
                >
                  {currentRow.demo_url}
                </a>
              </div>
            )}
          </div>

          {/* Scoring Form */}
          <Form {...form}>
            <form
              id='submission-score-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <div className='space-y-4'>
                <h3 className='text-sm font-semibold'>
                  Scoring Criteria (0-100)
                </h3>

                <FormField
                  control={form.control}
                  name='impact'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : 0
                            )
                          }
                          type='number'
                          min='0'
                          max='100'
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='execution'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Execution</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : 0
                            )
                          }
                          type='number'
                          min='0'
                          max='100'
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='innovation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Innovation</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : 0
                            )
                          }
                          type='number'
                          min='0'
                          max='100'
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='security'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : 0
                            )
                          }
                          type='number'
                          min='0'
                          max='100'
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='ux_clarity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UX/Clarity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : 0
                            )
                          }
                          type='number'
                          min='0'
                          max='100'
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Add any additional feedback or notes...'
                        className='resize-none'
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline'>Cancel</Button>
          </SheetClose>
          <Button
            form='submission-score-form'
            type='submit'
            disabled={isPending}
          >
            {isPending
              ? 'Saving...'
              : existingScore
                ? 'Update Score'
                : 'Save Score'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
