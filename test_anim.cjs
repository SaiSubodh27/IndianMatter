
const fs = require("fs");
let code = fs.readFileSync("src/pages/Landing.tsx", "utf8");

const statsGridRegex = /<div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full">([\s\S]*?)<\/div>\s*<\/header>/m;
code = code.replace(statsGridRegex, `<motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full">$1</motion.div>\n      </header>`);

let newStatsMatch = code.match(/<motion\.div[^>]*className="mt-24[^>]*>([\s\S]*?)<\/motion\.div>/);

if (newStatsMatch) {
    let innerGrid = newStatsMatch[1];
    let modifiedGrid = innerGrid.replace(/<div className="text-center">/g, `<motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} whileHover={{scale: 1.05}} className="text-center">`);
    // close the tags
    modifiedGrid = modifiedGrid.replace(/<\/div>\s*<motion/g, `</motion.div>\n          <motion`);
    modifiedGrid = modifiedGrid.replace(/<\/div>([^<]*)$/, `</motion.div>$1`); // last one
    code = code.replace(innerGrid, modifiedGrid);
}

// 4 Grid cards
code = code.replace(/<div className="md:col-span-7 glass-card/g, `<motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.5 }} className="md:col-span-7 glass-card`);
code = code.replace(/<div className="md:col-span-5 glass-card/g, `<motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.5, delay: 0.2 }} className="md:col-span-5 glass-card`);

// Instead of pure replace we are just doing it line by line to inject the closing tags safely.
const lines = code.split("\n");
const newLines = [];
let insideColSpan7 = false;
let insideColSpan5 = false;

for (let i =0; i < lines.length; i++) {
    // we just know exactly where they are based on the original html
    if (lines[i].includes(`src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSqGp`)) {
        newLines.push(lines[i]);
        newLines.push(lines[i+1]);
        newLines.push(lines[i+2].replace("</div>", "</motion.div>")); // Close the col-7
        i += 2;
        continue;
    }
    
    if (lines[i].includes(`shadow-[0_0_8px_#ff6600]"></div>`)) {
        newLines.push(lines[i]);
        newLines.push(lines[i+1]);
        newLines.push(lines[i+2].replace("</div>", "</motion.div>")); // Close col-5
        i += 2;
        continue;
    }
    
    // the third card is short
    if (lines[i].includes(`Optimize carrier concentration by exploring combinatorial chemical`)) {
        newLines.push(lines[i]);
        newLines.push(lines[i+1]);
        newLines.push(lines[i+2].replace("</div>", "</motion.div>")); // Close col-5
        i += 2;
        continue;
    }
    
    // the fourth card
    if (lines[i].includes(`src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC6yC`)) {
        newLines.push(lines[i]);
        newLines.push(lines[i+1]);
        newLines.push(lines[i+2].replace("</div>", "</motion.div>")); // Close col-7
        i += 2;
        continue;
    }
    
    newLines.push(lines[i]);
}


fs.writeFileSync("src/pages/Landing.tsx", newLines.join("\n"));
console.log("Written!");

