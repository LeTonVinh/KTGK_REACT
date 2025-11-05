import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cybfeijzktmbjmbteflu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5YmZlaWp6a3RtYmptYnRlZmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTQ3ODQsImV4cCI6MjA3Nzg5MDc4NH0.gbav4-O7-P8kdbt6Dfm-LP3mLtIRqxWs8S2LD77EOSc'

export const supabase = createClient(supabaseUrl, supabaseKey)
