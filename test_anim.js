
const fs = require("fs");
let code = fs.readFileSync("src/pages/Landing.tsx", "utf8");

const statsGridRegex = /<div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full">([\s\S]*?)<\/div>\s*<\/header>/m;
code = code.replace(statsGridRegex, `<motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full">$1</motion.div>\n      </header>`);

let newStatsMatch = code.match(/<motion\.div[^>]*className="mt-24[^>]*>([\s\S]*?)<\/motion\.div>/);

if (newStatsMatch) {
    let innerGrid = newStatsMatch[1];
    let modifiedGrid = innerGrid.replace(/<div className="text-center">/g, `<motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} whileHover={{scale: 1.05}} className="text-center">`);
    // close the tags
    modifiedGrid = modifiedGrid.replace(/<\/div>([^<]*?)<motion/g, `</motion.div>$1<motion`);
    modifiedGrid = modifiedGrid.replace(/<\/div>$/, `</motion.div>`);
    code = code.replace(innerGrid, modifiedGrid);
}

// 4 Grid cards
code = code.replace(/<div className="md:col-span-7 glass-card/g, `<motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.5 }} className="md:col-span-7 glass-card`);
code = code.replace(/<div className="md:col-span-5 glass-card/g, `<motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.5, delay: 0.2 }} className="md:col-span-5 glass-card`);

// Instead of regex fixing the close tags because they are nested, I rely on the knowledge of Landing.tsx.
// Let us replace all </div> inside the section with a custom closing. Wait, that breaks.
// Let us just replace the specific end divs manually.
fs.writeFileSync("src/pages/Landing.tsx", code);

