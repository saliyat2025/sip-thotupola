const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qowhadnyjtvzkevniyrl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvd2hhZG55anR2emtldm5peXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNjMwMzAsImV4cCI6MjA4NjkzOTAzMH0.sD0RaUmYooCaLZB_LMhdY3Bhnchk2CA58VtJ-TOREzc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listCategories() {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

listCategories();
