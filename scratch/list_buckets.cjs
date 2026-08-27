const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://cmhwszghtivzccdvedzj.supabase.co', 'sb_publishable_8o324bVMizZNPwnslDvriQ_frPiNYfd');

async function listBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  console.log('Buckets:', data);
  if (error) console.log('Error:', error);
}

listBuckets();
