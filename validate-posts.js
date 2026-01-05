const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

const postsDir = './posts';
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let errors = 0;
let success = 0;

files.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const { data, content: markdown } = matter(content);
    
    if (!data.title || !data.date || !data.excerpt) {
      console.log(`❌ ${file}: Missing required frontmatter`);
      errors++;
    } else {
      success++;
    }
  } catch (err) {
    console.log(`❌ ${file}: Parse error - ${err.message}`);
    errors++;
  }
});

console.log(`\nResults: ${success} valid, ${errors} errors`);
process.exit(errors > 0 ? 1 : 0);
