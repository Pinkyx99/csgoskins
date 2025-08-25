import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://duospbgjxfisuandppgd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b3NwYmdqeGZpc3VhbmRwcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDUyMDYsImV4cCI6MjA3MTYyMTIwNn0.w_wfmL34oiZQvB4ppVfsA8E8rFQNeQbBp0IZlYrmvLM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
