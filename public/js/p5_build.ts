function builder(sketch){return (p) => {for (let key in sketch)if (typeof (sketch[key]) == "function")p[key] = sketch[key].bind(p); else p[key] = sketch[key];};};
