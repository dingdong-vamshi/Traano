const mergeMultilineRows = (rows, mapping) => {
  const merged = [];
  let currentTx = null;

  for (const row of rows) {
    const rawDate = row[mapping.date]?.toString()?.trim();
    
    if (rawDate) {
      // Start a new transaction row
      if (currentTx) merged.push(currentTx);
      currentTx = { ...row };
    } else {
      // No date found, append description to the previous row
      if (currentTx && mapping.description) {
        const extraText = row[mapping.description]?.toString()?.trim();
        if (extraText) {
          currentTx[mapping.description] = `${currentTx[mapping.description]} ${extraText}`.trim();
        }
      }
    }
  }
  if (currentTx) merged.push(currentTx);
  
  return merged;
};

module.exports = { mergeMultilineRows };
