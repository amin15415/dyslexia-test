export const importWords = async (test) => {
    let testWords;
    
    if (test === "ADT") {
      const module = await import('../data/TestWords');
      testWords = module.adtWords;
    } else if (test === "DESD") {
      const module = await import('../data/TestWords');
      testWords = module.desdWords;
    }
    
    return testWords;
  };