const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient('https://cmhwszghtivzccdvedzj.supabase.co', 'sb_publishable_8o324bVMizZNPwnslDvriQ_frPiNYfd');

async function testUpload() {
  console.log('Testing upload...');
  
  if (!fs.existsSync('scratch')) {
    fs.mkdirSync('scratch');
  }
  fs.writeFileSync('scratch/dummy.txt', 'Hello world');
  const fileContent = fs.readFileSync('scratch/dummy.txt');
  
  const { data, error } = await supabase.storage
    .from('status_media')
    .upload('test/dummy.txt', fileContent, {
      contentType: 'text/plain',
      upsert: true
    });
    
  console.log('Result:', { data, error });
}

testUpload();
