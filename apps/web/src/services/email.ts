import { supabase } from './supabase'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  category: string
  message: string
}

export interface ContactMessage extends ContactFormData {
  id: string
  admin_email: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
  updated_at: string
}

/**
 * Send contact form email to admin
 * For testing: sends to dekatediksha@gmail.com
 * TODO: Change to admin email later
 */
export async function sendContactEmail(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    // For now, we'll store in a contact_messages table and send email notification
    // Insert contact message into database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          category: formData.category,
          message: formData.message,
          admin_email: 'dekatediksha@gmail.com', // Static for testing
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Error saving contact message:', error)
      return { success: false, error: error.message }
    }

    // TODO: Implement actual email sending via Supabase Edge Function or external service
    // For now, we'll just save to database
    console.log('Contact form submitted:', formData)
    
    return { success: true }
  } catch (error: any) {
    console.error('Error in sendContactEmail:', error)
    return { success: false, error: error.message || 'Failed to send message' }
  }
}

/**
 * Fetch all contact messages (Admin only)
 */
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact messages:', error)
    throw new Error('Failed to fetch contact messages')
  }

  return data || []
}

/**
 * Update contact message status (Admin only)
 */
export async function updateContactMessageStatus(
  id: string,
  status: 'unread' | 'read' | 'replied'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error updating contact message:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in updateContactMessageStatus:', error)
    return { success: false, error: error.message || 'Failed to update status' }
  }
}

/**
 * Delete contact message (Admin only)
 */
export async function deleteContactMessage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact message:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in deleteContactMessage:', error)
    return { success: false, error: error.message || 'Failed to delete message' }
  }
}
