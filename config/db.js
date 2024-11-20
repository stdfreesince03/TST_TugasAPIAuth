const supabase = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const db = supabase.createClient(supabaseUrl,supabaseKey);

module.exports = db;