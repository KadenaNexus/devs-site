'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchContactMessages, 
  updateContactMessageStatus, 
  deleteContactMessage,
  type ContactMessage 
} from '@/services/email'
import { Loader2, Mail, Trash2, CheckCircle, Clock, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

export function ContactMessagesManagement() {
  const queryClient = useQueryClient()
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: fetchContactMessages,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'unread' | 'read' | 'replied' }) =>
      updateContactMessageStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] })
      setSelectedMessage(null)
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'read':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'replied':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-red-500/10 text-red-500'
      case 'partnership':
        return 'bg-purple-500/10 text-purple-500'
      case 'submission':
        return 'bg-blue-500/10 text-blue-500'
      case 'judging':
        return 'bg-orange-500/10 text-orange-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-[var(--ft-primary)]' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold text-white'>Contact Messages</h2>
          <p className='text-[var(--ft-only-gray)]'>
            Manage contact form submissions ({messages.length} total)
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-xl bg-[var(--ft-light)] p-6'>
          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10'>
              <Clock className='h-6 w-6 text-yellow-500' />
            </div>
            <div>
              <p className='text-2xl font-bold text-white'>
                {messages.filter((m) => m.status === 'unread').length}
              </p>
              <p className='text-sm text-[var(--ft-only-gray)]'>Unread</p>
            </div>
          </div>
        </div>

        <div className='rounded-xl bg-[var(--ft-light)] p-6'>
          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10'>
              <Mail className='h-6 w-6 text-blue-500' />
            </div>
            <div>
              <p className='text-2xl font-bold text-white'>
                {messages.filter((m) => m.status === 'read').length}
              </p>
              <p className='text-sm text-[var(--ft-only-gray)]'>Read</p>
            </div>
          </div>
        </div>

        <div className='rounded-xl bg-[var(--ft-light)] p-6'>
          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10'>
              <CheckCircle className='h-6 w-6 text-green-500' />
            </div>
            <div>
              <p className='text-2xl font-bold text-white'>
                {messages.filter((m) => m.status === 'replied').length}
              </p>
              <p className='text-sm text-[var(--ft-only-gray)]'>Replied</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className='space-y-4'>
        {messages.length === 0 ? (
          <div className='rounded-xl bg-[var(--ft-light)] p-12 text-center'>
            <MessageSquare className='mx-auto mb-4 h-12 w-12 text-[var(--ft-only-gray)]' />
            <p className='text-[var(--ft-only-gray)]'>No contact messages yet</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className='rounded-xl bg-[var(--ft-light)] p-6 transition-all hover:bg-[var(--ft-light)]/80'
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1 space-y-3'>
                  {/* Header */}
                  <div className='flex items-start gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ft-primary)]/10'>
                      <Mail className='h-5 w-5 text-[var(--ft-primary)]' />
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold text-white'>{message.name}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-xs ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${getCategoryColor(message.category)}`}>
                          {message.category}
                        </span>
                      </div>
                      <p className='text-sm text-[var(--ft-only-gray)]'>{message.email}</p>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <h4 className='font-medium text-white'>{message.subject}</h4>
                  </div>

                  {/* Message */}
                  <div className='rounded-lg bg-[var(--ft-dark-bg)] p-4'>
                    <p className='text-sm text-[var(--ft-only-gray)] whitespace-pre-wrap'>
                      {message.message}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className='flex items-center justify-between'>
                    <p className='text-xs text-[var(--ft-only-gray)]'>
                      {format(new Date(message.created_at), 'PPp')}
                    </p>
                    <div className='flex gap-2'>
                      {message.status === 'unread' && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: message.id, status: 'read' })}
                          className='rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/20'
                        >
                          Mark as Read
                        </button>
                      )}
                      {message.status === 'read' && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: message.id, status: 'replied' })}
                          className='rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-500 transition-colors hover:bg-green-500/20'
                        >
                          Mark as Replied
                        </button>
                      )}
                      {message.status === 'replied' && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: message.id, status: 'unread' })}
                          className='rounded-lg bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-500 transition-colors hover:bg-yellow-500/20'
                        >
                          Mark as Unread
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this message?')) {
                            deleteMutation.mutate(message.id)
                          }
                        }}
                        className='rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
