import { supabase } from './supabase'

export type PageStatus = 'draft' | 'published' | 'archived'

export interface ContentBlock {
  type: string
  data: Record<string, any>
}

export interface Page {
  id: string
  slug: string
  title: string
  description: string | null
  content: ContentBlock[]
  status: PageStatus
  meta_title: string | null
  meta_description: string | null
  featured_image: string | null
  order_index: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export type CreatePageInput = Omit<Page, 'id' | 'created_at' | 'updated_at' | 'created_by'>
export type UpdatePageInput = Partial<CreatePageInput>

/* ----------------------------------
   Fetch all pages (Admin)
---------------------------------- */
export async function fetchPages(status?: PageStatus) {
  console.log('Fetching pages...', { status })
  
  let query = supabase
    .from('pages')
    .select('*')
    .order('order_index', { ascending: true })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  
  console.log('Fetch pages result:', { data, error, count: data?.length })

  if (error) throw error
  return data as Page[]
}

/* ----------------------------------
   Fetch single page by slug (Public)
---------------------------------- */
export async function fetchPageBySlug(slug: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) throw error
  return data as Page
}

/* ----------------------------------
   Fetch single page by ID (Admin)
---------------------------------- */
export async function fetchPageById(id: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Page
}

/* ----------------------------------
   Create new page
---------------------------------- */
export async function createPage(input: CreatePageInput) {
  console.log('Creating page...', input)
  
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id
  console.log('Current user:', userId, userData?.user?.email)

  if (!userId) {
    throw new Error('Not authenticated with Supabase. Sign in before creating a page.')
  }

  const { data, error } = await supabase
    .from('pages')
    .insert({
      ...input,
      created_by: userId,
    })
    .select()
    .single()

  console.log('Create page result:', { data, error })
  
  if (error) throw error
  return data as Page
}

/* ----------------------------------
   Update existing page
---------------------------------- */
export async function updatePage(id: string, input: UpdatePageInput) {
  const { data, error } = await supabase
    .from('pages')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Page
}

/* ----------------------------------
   Delete page
---------------------------------- */
export async function deletePage(id: string) {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/* ----------------------------------
   Duplicate page
---------------------------------- */
export async function duplicatePage(id: string) {
  const page = await fetchPageById(id)
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id
  if (!userId) throw new Error('Not authenticated with Supabase.')

  const { data, error } = await supabase
    .from('pages')
    .insert({
      slug: `${page.slug}-copy`,
      title: `${page.title} (Copy)`,
      description: page.description,
      content: page.content,
      status: 'draft',
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      featured_image: page.featured_image,
      order_index: page.order_index + 1,
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw error
  return data as Page
}

/* ----------------------------------
   Reorder pages
---------------------------------- */
export async function reorderPages(pageIds: string[]) {
  const updates = pageIds.map((id, index) => ({
    id,
    order_index: index + 1,
  }))

  const { error } = await supabase
    .from('pages')
    .upsert(updates)

  if (error) throw error
}
