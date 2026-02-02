import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { createPage, updatePage, fetchPageById } from '@/services/pages'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, Trash, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { ContentBlock } from '@/services/pages'
import { supabase } from '@/services/supabase'
import { Upload } from 'lucide-react'

const pageFormSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  featured_image: z.string().optional(),
  order_index: z.number().int().min(0),
  content: z.array(z.object({
    type: z.string(),
    data: z.record(z.string(), z.any()),
  })),
})

type PageFormValues = z.infer<typeof pageFormSchema>

const BLOCK_TYPES = [
  { value: 'header', label: 'Header' },
  { value: 'hero', label: 'Hero Section' },
  { value: 'text', label: 'Text Block' },
  { value: 'image', label: 'Image' },
  { value: 'features', label: 'Features Grid' },
  { value: 'steps', label: 'Steps/Process' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'faq_list', label: 'FAQ List' },
  { value: 'team_grid', label: 'Team Grid' },
  { value: 'contact_form', label: 'Contact Form' },
  { value: 'custom', label: 'Custom JSON' },
]

// Separate component to handle block editing with local state
function ContentBlockEditor({
  block,
  index,
  pageId,
  onUpdate,
  onRemove,
}: {
  block: { type: string; data: Record<string, any> }
  index: number
  pageId?: string
  onUpdate: (block: { type: string; data: Record<string, any> }) => void
  onRemove: () => void
}) {
  const [jsonText, setJsonText] = useState(JSON.stringify(block.data || {}, null, 2))
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(block.data?.src || '')

  // helpers for common block types
  const setField = (key: string, value: any) => {
    const newData = { ...(block.data || {}), [key]: value }
    // If setting title, also auto-generate a slug for the block
    if (key === 'title') {
      const generated = String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      newData.slug = generated
    }
    onUpdate({ type: block.type, data: newData })
    setJsonText(JSON.stringify(newData, null, 2))
  }

  const handleTypeChange = (value: string) => {
    // initialize shape based on type
    let data: Record<string, any> = {}
    if (value === 'text' || value === 'header' || value === 'cta') {
      data = { title: '', description: '' }
    } else if (value === 'image' || value === 'hero') {
      data = { src: '', alt: '', caption: '' }
    } else if (value === 'faq_list' || value === 'features' || value === 'steps' || value === 'team_grid') {
      data = { items: [] }
    } else if (value === 'custom') {
      data = {}
    }
    setJsonText(JSON.stringify(data, null, 2))
    setJsonError(null)
    onUpdate({ type: value, data })
  }

  const handleJsonChange = (value: string) => {
    setJsonText(value)
    try {
      const data = JSON.parse(value)
      setJsonError(null)
      onUpdate({ type: block.type, data })
    } catch (err) {
      setJsonError('Invalid JSON')
    }
  }

  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex items-start gap-4'>
          <Button type='button' variant='ghost' size='sm' className='cursor-move'>
            <GripVertical className='h-4 w-4' />
          </Button>
          <div className='flex-1 space-y-4'>
            <Select value={block.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOCK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Render friendly editors for common block types */}
            {['text', 'header', 'cta'].includes(block.type) && (
              <div className='space-y-2'>
                <Input
                  placeholder='Title'
                  value={block.data?.title || ''}
                  onChange={(e) => setField('title', e.target.value)}
                />
                <Textarea
                  placeholder='Description'
                  rows={4}
                  value={block.data?.description || ''}
                  onChange={(e) => setField('description', e.target.value)}
                />
              </div>
            )}

            {block.type === 'image' && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Input
                    placeholder='Image URL'
                    value={block.data?.src || ''}
                    onChange={(e) => {
                      setField('src', e.target.value)
                      setImagePreview(e.target.value)
                    }}
                  />
                  <input
                    id={`block-image-file-${index}`}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('Image must be smaller than 5MB')
                        return
                      }
                      const reader = new FileReader()
                      reader.onloadend = () => setImagePreview(reader.result as string)
                      reader.readAsDataURL(file)

                      try {
                        const fileExt = file.name.split('.').pop()
                        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
                        const filePath = `${pageId || 'draft-pages'}/blocks/${fileName}`

                        const { error: uploadError } = await supabase.storage
                          .from('pages')
                          .upload(filePath, file, { upsert: true })

                        if (uploadError) throw uploadError

                        const { data: urlData } = supabase.storage
                          .from('pages')
                          .getPublicUrl(filePath)

                        const publicUrl = urlData.publicUrl
                        setField('src', publicUrl)
                        toast.success('Block image uploaded')
                      } catch (err: any) {
                        console.error('Upload error', err)
                        toast.error(err?.message || 'Failed to upload image')
                      }
                    }}
                  />
                  <Button type='button' size='sm' variant='outline' onClick={() => document.getElementById(`block-image-file-${index}`)?.click()}>
                    <Upload className='mr-2 h-4 w-4' />
                    Upload
                  </Button>
                </div>

                <Input
                  placeholder='Alt text'
                  value={block.data?.alt || ''}
                  onChange={(e) => setField('alt', e.target.value)}
                />
                <Input
                  placeholder='Caption'
                  value={block.data?.caption || ''}
                  onChange={(e) => setField('caption', e.target.value)}
                />

                {imagePreview && (
                  <div>
                    <img src={imagePreview} alt='preview' className='max-w-full rounded' />
                  </div>
                )}
              </div>
            )}

            {['features', 'faq_list', 'steps', 'team_grid'].includes(block.type) && (
              <div className='space-y-2'>
                <div className='space-y-2'>
                  {(block.data?.items || []).map((item: any, idx: number) => (
                    <div key={idx} className='flex gap-2'>
                      <Input
                        placeholder='Item title'
                        value={item.title || ''}
                        onChange={(e) => {
                          const items = [...(block.data?.items || [])]
                          items[idx] = { ...items[idx], title: e.target.value }
                          setField('items', items)
                        }}
                      />
                      <Input
                        placeholder='Item description'
                        value={item.description || ''}
                        onChange={(e) => {
                          const items = [...(block.data?.items || [])]
                          items[idx] = { ...items[idx], description: e.target.value }
                          setField('items', items)
                        }}
                      />
                      <Button type='button' variant='ghost' onClick={() => {
                        const items = [...(block.data?.items || [])]
                        items.splice(idx, 1)
                        setField('items', items)
                      }}>
                        <Trash className='h-4 w-4 text-destructive' />
                      </Button>
                    </div>
                  ))}
                  <Button type='button' onClick={() => {
                    const items = [...(block.data?.items || [])]
                    items.push({ title: '', description: '' })
                    setField('items', items)
                  }}>
                    Add Item
                  </Button>
                </div>
              </div>
            )}

            {block.type === 'custom' && (
              <div className='space-y-2'>
                <Textarea
                  value={jsonText}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  rows={6}
                  className='font-mono text-sm'
                  placeholder='{"key": "value"}'
                />
                {jsonError && <p className='text-sm text-destructive'>{jsonError}</p>}
              </div>
            )}
          </div>
          <Button type='button' variant='ghost' size='sm' onClick={onRemove}>
            <Trash className='h-4 w-4 text-destructive' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface PageEditorProps {
  pageId?: string
}

export function PageEditor({ pageId }: PageEditorProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editingBlock, setEditingBlock] = useState<number | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const autoSlugRef = useRef<string>('')
  const { data: page, isLoading } = useQuery({
    queryKey: ['page', pageId],
    queryFn: () => fetchPageById(pageId!),
    enabled: !!pageId,
  })

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      slug: '',
      title: '',
      description: '',
      status: 'draft',
      meta_title: '',
      meta_description: '',
      featured_image: '',
      order_index: 0,
      content: [],
    },
    values: page ? {
      slug: page.slug,
      title: page.title,
      description: page.description || '',
      status: page.status,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      featured_image: page.featured_image || '',
      order_index: page.order_index,
      content: page.content,
    } : undefined,
  })

  const titleValue = form.watch('title')
  const slugValue = form.watch('slug')

  useEffect(() => {
    // Auto-generate slug from title when slug is empty or was previously auto-generated
    if (!titleValue) return
    const shouldAuto = !slugValue || slugValue === autoSlugRef.current
    if (shouldAuto) {
      const generated = titleValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      form.setValue('slug', generated)
      autoSlugRef.current = generated
    }
  }, [titleValue])

  useEffect(() => {
    // initialize preview when loading an existing page
    if (page?.featured_image) setImagePreview(page.featured_image)
  }, [page])

  const saveMutation = useMutation({
    mutationFn: async (values: PageFormValues) => {
      if (pageId) {
        return updatePage(pageId, values)
      } else {
        return createPage({
          ...values,
          description: values.description ?? null,
          meta_title: values.meta_title ?? null,
          meta_description: values.meta_description ?? null,
          featured_image: values.featured_image ?? null,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] })
      toast.success(`Page ${pageId ? 'updated' : 'created'} successfully`)
      navigate({ to: '/admin/pages' })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const addBlock = () => {
    const currentContent = form.getValues('content')
    form.setValue('content', [
      ...currentContent,
      { type: 'text', data: {} },
    ])
  }

  const removeBlock = (index: number) => {
    const currentContent = form.getValues('content')
    form.setValue('content', currentContent.filter((_, i) => i !== index))
  }

  const updateBlockData = (index: number, data: any) => {
    const currentContent = form.getValues('content')
    const newContent = [...currentContent]
    newContent[index] = { ...newContent[index], data }
    form.setValue('content', newContent)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>
            {pageId ? 'Edit Page' : 'Create New Page'}
          </h2>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate({ to: '/admin/pages' })}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Save Page
            </Button>
          </div>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          <div className='md:col-span-2 space-y-6'>
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='e.g., about-us' />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version (lowercase, hyphens only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ''}
                          rows={3} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Content Blocks */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle>Content Blocks</CardTitle>
                  <Button type='button' variant='outline' size='sm' onClick={addBlock}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Block
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {form.watch('content').map((block, index) => (
                  <ContentBlockEditor
                    key={index}
                    block={block}
                    index={index}
                    pageId={pageId}
                    onUpdate={(newBlock) => {
                      const currentContent = form.getValues('content')
                      const newContent = [...currentContent]
                      newContent[index] = newBlock
                      form.setValue('content', newContent)
                    }}
                    onRemove={() => removeBlock(index)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='draft'>Draft</SelectItem>
                          <SelectItem value='published'>Published</SelectItem>
                          <SelectItem value='archived'>Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='order_index'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='meta_title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='meta_description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='featured_image'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                          <FormControl>
                            <div>
                              <div className='flex items-center gap-4'>
                                <div className='flex-1'>
                                  <Input {...field} />
                                </div>
                                <div className='flex items-center gap-2'>
                                  <input
                                    id='featured_image_file'
                                    type='file'
                                    accept='image/*'
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (!file) return
                                      if (file.size > 5 * 1024 * 1024) {
                                        toast.error('Image must be smaller than 5MB')
                                        return
                                      }
                                      setImageFile(file)
                                      const reader = new FileReader()
                                      reader.onloadend = () => setImagePreview(reader.result as string)
                                      reader.readAsDataURL(file)

                                      // upload to supabase storage bucket 'pages' (create if needed)
                                      try {
                                        const fileExt = file.name.split('.').pop()
                                        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
                                        const filePath = `${pageId || 'draft-pages'}/${fileName}`

                                        const { error: uploadError } = await supabase.storage
                                          .from('pages')
                                          .upload(filePath, file, { upsert: true })

                                        if (uploadError) throw uploadError

                                        const { data: urlData } = supabase.storage
                                          .from('pages')
                                          .getPublicUrl(filePath)

                                        const publicUrl = urlData.publicUrl
                                        form.setValue('featured_image', publicUrl)
                                        toast.success('Image uploaded')
                                      } catch (err: any) {
                                        console.error('Upload error', err)
                                        toast.error(err?.message || 'Failed to upload image')
                                      }
                                    }}
                                    className='hidden'
                                  />
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => document.getElementById('featured_image_file')?.click()}
                                  >
                                    <Upload className='mr-2 h-4 w-4' />
                                    Upload
                                  </Button>
                                </div>
                              </div>
                              {imagePreview && (
                                <div className='mt-2'>
                                  <img src={imagePreview} alt='preview' className='max-w-full rounded' />
                                </div>
                              )}
                            </div>
                          </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
