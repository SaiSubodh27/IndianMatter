const fs = require('fs');

let content = fs.readFileSync('src/pages/Landing.tsx', 'utf8');

// Add import
if (!content.includes('framer-motion')) {
  content = content.replace('import { Link } from \"react-router-dom\";', 'import { Link } from \"react-router-dom\";\nimport { motion } from \"framer-motion\";');
}

// Helper to inject motion
function replaceWithMotion(targetClass, motionTag, props) {
    const rx = new RegExp(\(<div\\\\b[^>]*className=\"[^>]*\[^>]*\")\\\\s*>\, 'g');
    content = content.replace(rx, (m, p1) => {
        // Change <div to <motion.div
        let newTag = p1.replace(/<div\\b/, '<' + motionTag);
        return newTag + \ \>\;
    });
}

// 1. Hero text fade in
content = content.replace(
    /(<h1 className=\"text-5xl md:text-7xl[^>]*>)/, 
    '<motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className=\"text-5xl md:text-7xl max-w-4xl mx-auto font-headline font-bold text-on-surface mb-8 tracking-tighter\">'
);
content = content.replace(
    /<\/h1>/, 
    '</motion.h1>'
);

// 2. Stats hero grid staggered entrance
content = content.replace(
    /(<div className=\"grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-outline-variant\/20 pt-12\">)/,
    '<motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className=\"grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-outline-variant/20 pt-12\">'
);
content = content.replace(
    /<\/div>\s*<\/header>/,
    '</motion.div>\n      </header>'
);

// 3. Grid cards (col-span-7, col-span-5) replacement
// Replace exactly the 4 structural cards
['md:col-span-7 ', 'md:col-span-5 '].forEach(cardClass => {
    const rxStart = new RegExp(\(<div className=\"\glass-card [^>]*>)\, 'g');
    content = content.replace(rxStart, (m, p1) => {
        let newTag = p1.replace('<div', '<motion.div');
        return newTag.slice(0, -1) + \ initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: \\\"-100px\\\" }} whileHover={{ y: -5, boxShadow: \\\"0 25px 50px -12px rgba(255, 102, 0, 0.25)\\\" }} transition={{ duration: 0.5 }}>\;
    });
});

// Since we replaced <div with <motion.div for the glass-cards, we must fix the closing tags ONLY for these specific divs.
// Wait, regex replacing matching closing tags of nested divs is notoriously hard in string replacements.
// Let's do it manually on a case by case basis, or inject wrap them, or just use regular replace on the specific blocks.
