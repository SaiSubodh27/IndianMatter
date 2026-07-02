
const fs = require("fs");

let code = fs.readFileSync("src/pages/Landing.tsx", "utf8");

if (!code.includes("framer-motion")) {
    code = code.replace(`import { Link } from "react-router-dom";`, `import { Link } from "react-router-dom";\nimport { motion } from "framer-motion";`);
}

// 1. The main hero text section
const H1_START = `<h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter mb-6 leading-none">`;
const H1_ANIMATED = `<motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}} className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter mb-6 leading-none">`;
code = code.replace(H1_START, H1_ANIMATED);
code = code.replace(`          </h1>\n`, `          </motion.h1>\n`);

// 2. The four metrics: 10M+, 0.12A, 450x, 24/7
const METRIC_DIVS = `<div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full">`;
const METRIC_DIVS_ANIM = `<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.3, duration:0.6, staggerChildren: 0.1}} className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full">`;
code = code.replace(METRIC_DIVS, METRIC_DIVS_ANIM);
// We know these metric divs end naturally at the end of the header tag
code = code.replace(`        </div>\n      </header>`, `        </motion.div>\n      </header>`);

// Animate each metric to slide down as well by replacing its inner div. 
// "        <div className="text-center">" occurs exactly 4 times in that section
// Let us replace them with motion.divs
let headerSectionMatch = code.match(/<motion\.div[^>]*className="mt-24[^>]*>([\s\S]*?)<\/motion\.div>/);
if (headerSectionMatch) {
    let headerSect = headerSectionMatch[1];
    let newHeaderSect = headerSect.replace(/<div className="text-center">/g, `<motion.div whileHover={{scale: 1.05}} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.4}} className="text-center">`);
    newHeaderSect = newHeaderSect.replace(/<\/div>/g, `</motion.div>`);
    code = code.replace(headerSect, newHeaderSect);
}

// 3. The 4 main cards.
const CARD_1 = `<div className="md:col-span-7 glass-card rounded-xl p-8 group hover:bg-surface-container-high transition-all duration-500 overflow-hidden relative">`;
const CARD_2 = `<div className="md:col-span-5 glass-card rounded-xl p-8 flex flex-col justify-between group hover:bg-surface-container-high transition-all duration-500">`;
const CARD_3 = `<div className="md:col-span-5 glass-card rounded-xl p-8 group hover:bg-surface-container-high transition-all duration-500">`;
const CARD_4 = `<div className="md:col-span-7 glass-card rounded-xl p-8 group hover:bg-surface-container-high transition-all duration-500 flex flex-col md:flex-row gap-8">`;

const ANIM_CARD_1 = CARD_1.replace(`<div`, `<motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.5}} viewport={{once:true}} whileHover={{y:-5}}`);
const ANIM_CARD_2 = CARD_2.replace(`<div`, `<motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.5, delay:0.2}} viewport={{once:true}} whileHover={{y:-5}}`);
const ANIM_CARD_3 = CARD_3.replace(`<div`, `<motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.5}} viewport={{once:true}} whileHover={{y:-5}}`);
const ANIM_CARD_4 = CARD_4.replace(`<div`, `<motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.5, delay:0.2}} viewport={{once:true}} whileHover={{y:-5}}`);

code = code.replace(CARD_1, ANIM_CARD_1);
code = code.replace(CARD_2, ANIM_CARD_2);
code = code.replace(CARD_3, ANIM_CARD_3);
code = code.replace(CARD_4, ANIM_CARD_4);

// Now carefully fix exactly the 4 closing div tags. 
// CARD_1 ends right before CARD_2
code = code.replace(`            </div>\n          </div>\n\n          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}`, `            </div>\n          </motion.div>\n\n          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}`);

// CARD_2 ends right before CARD_3
code = code.replace(`            </div>\n          </div>\n\n          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.5}} viewport={{once:true}} whileHover={{y:-5}} className="md:col-span-5 glass-card rounded-xl p-8 group hover:bg-surface-container-high transition-all duration-500">`, `            </div>\n          </motion.div>\n\n          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.5}} viewport={{once:true}} whileHover={{y:-5}} className="md:col-span-5 glass-card rounded-xl p-8 group hover:bg-surface-container-high transition-all duration-500">`);

// CARD_3 ends right before CARD_4
code = code.replace(`            </p>\n          </div>\n\n          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.5, delay:0.2}} viewport={{once:true}} whileHover={{y:-5}} className="md:col-span-7 glass-card rounded-xl p-8 group hover:bg-surface-container-high transition-all duration-500 flex flex-col md:flex-row gap-8">`, `            </p>\n          </motion.div>\n\n          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.5, delay:0.2}} viewport={{once:true}} whileHover={{y:-5}} className="md:col-span-7 glass-card rounded-xl p-8 group hover:bg-surface-container-high transition-all duration-500 flex flex-col md:flex-row gap-8">`);

// CARD_4 ends right before the closing of the grid grid-cols-1 md:grid-cols-12 gap-6
code = code.replace(`            </div>\n          </div>\n        </div>\n      </section>`, `            </div>\n          </motion.div>\n        </div>\n      </section>`);

fs.writeFileSync("src/pages/Landing.tsx", code);

