// Build-time adapter for the authored node subset of MDX, not an MDX evaluator.
// Unknown executable syntax FAILS the build instead of leaking code to agents.
// Literal fenced examples survive unchanged. No eval, network or new dependency.
function nodeContent(source, counts) {
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
  const output = [];
  let prose = [];
  let fence;
  function flush() {
    let text = prose.join('\n')
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
      .replace(/^import stats from ['"]\.\.\/\.\.\/data\/stats\.json['"];?\s*$/gm, '')
      .replace(/\{\s*stats\.counts\.(\w+)\s*\}/g, (_, key) => {
        if (!Number.isSafeInteger(counts[key]) || counts[key] < 0) {
          throw new Error(`Unresolved node count: ${key}`);
        }
        return String(counts[key]);
      });
    if (/^\s*(?:import|export)\s|(?<!\\)[{}]|<\/?[A-Z][\w.]*(?:\s|\/?>)/m.test(text)) {
      throw new Error('Unsupported MDX in node content; add an explicit, tested adapter');
    }
    text = text.replace(/\\\$/g, '$').replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n');
    output.push(text);
    prose = [];
  }
  for (const line of body.split(/\r?\n/)) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (!fence && marker) {
      flush();
      fence = { char: marker[1][0], length: marker[1].length };
      output.push(line);
    } else if (fence) {
      output.push(line);
      if (marker && marker[1][0] === fence.char && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
    } else prose.push(line);
  }
  if (fence) throw new Error('Unclosed code fence in node content');
  flush();
  return output.join('\n').trim();
}

module.exports = { nodeContent };
