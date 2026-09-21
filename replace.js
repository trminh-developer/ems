const fs = require('fs');
let code = fs.readFileSync('backend/src/features/admin/AdminController.ts', 'utf8');
code = code.replace(/catch \((?:error|e)\) \{\s*return res\.status\(500\)\.json\(\{ error: 'Internal server error' \}\);\s*\}/g, "catch (error: any) { return res.status(500).json({ error: error.message, stack: error.stack }); }");
fs.writeFileSync('backend/src/features/admin/AdminController.ts', code);
