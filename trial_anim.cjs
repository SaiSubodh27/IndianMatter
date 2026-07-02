
const fs = require("fs");
let code = fs.readFileSync("src/pages/Landing.tsx", "utf8");

// Animate the main <h2> in the Trial Experience section
const from1 = `<h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface mb-6">`;
const to1 = `<motion.h2 initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.6}} viewport={{once:true}} className="text-3xl md:text-5xl font-headline font-bold text-on-surface mb-6">`;

const from2 = `<p className="text-on-surface-variant max-w-2xl mx-auto">`;
const to2 = `<motion.p initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.6,delay:0.1}} viewport={{once:true}} className="text-on-surface-variant max-w-2xl mx-auto">`;

code = code.replace(from1, to1).replace(from2, to2);

// Animate the 3 step boxes
const stepRegex = /<div className="flex flex-col items-center text-center w-48">/g;
let count = 0;
code = code.replace(stepRegex, () => {
    const delay = count * 0.2;
    count++;
    return `<motion.div initial={{opacity:0,scale:0.9,y:20}} whileInView={{opacity:1,scale:1,y:0}} transition={{duration:0.5,delay:${delay}}} viewport={{once:true}} whileHover={{y:-5}} className="flex flex-col items-center text-center w-48">`;
});

// Have to change the closing tag for the step boxes manually to <motion.div>
// There are 3 instances
let currentPos = 0;
for (let i = 0; i < 3; i++) {
    const searchStr = `</motion.div>`; // we just replaced the opening tag, so the closing one is still </div>
    // The previous structure was: <div ...> ... </div> </div> </div> (approx)
    
    // Instead of regex, let us use exact chunks for the close
}

// Alternatively, since there are exactly 3 step blocks:
code = code.replace(/Crystal Data Input\s*<\/div>\s*<\/div>/, `Crystal Data Input\n              </div>\n            </motion.div>`);
code = code.replace(/Molecular Dynamics\s*<\/div>\s*<\/div>/, `Molecular Dynamics\n              </div>\n            </motion.div>`);
code = code.replace(/Band Gap: 2.4eV\s*<\/div>\s*<\/div>/, `Band Gap: 2.4eV\n              </div>\n            </motion.div>`);


// Animate "Begin Compute Trial" box
const fromBox = `<div className="glass-card rounded-2xl p-1 lg:p-2 mb-20 max-w-4xl mx-auto">`;
const toBox = `<motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{duration:0.7,delay:0.3}} viewport={{once:true}} className="glass-card rounded-2xl p-1 lg:p-2 mb-20 max-w-4xl mx-auto">`;
code = code.replace(fromBox, toBox);

// And close the main box - look for </button></div></div>
code = code.replace(/Run Simulation\s*<\/span>\s*<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/, `Run Simulation\n                  </span>\n                </button>\n              </div>\n            </div>\n          </motion.div>`);

fs.writeFileSync("src/pages/Landing.tsx", code);
