import { NextApiRequest, NextApiResponse } from 'next';

const minify = require('bash-minifier')

const minifyShellScript = (script: string): string => {
  const lines = script.split('\n');
  const trimmedLines = lines.map(line => line.trim());
  const nonEmptyLines = trimmedLines.filter(line => line && !line.startsWith('#'));

  // Join the lines into a single string
  let minifiedScript = nonEmptyLines.join(' ');

  // Regex patterns
  const variableRegex = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;
  const stringRegex = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;

  // Array to hold the strings temporarily
  const strings: string[] = [];

  // Replace strings with placeholders and store them in array
  minifiedScript = minifiedScript.replace(stringRegex, (match) => {
    strings.push(match);
    return `__STRING_${strings.length - 1}__`;
  });

  // Replace variables while skipping inside strings
  minifiedScript = minifiedScript.replace(variableRegex, (match) => {
    // Check if the match is inside any string
    for (let i = 0; i < strings.length; i++) {
      const placeholder = `__STRING_${i}__`;
      if (minifiedScript.includes(placeholder) && minifiedScript.indexOf(match) > minifiedScript.indexOf(placeholder) && minifiedScript.indexOf(match) < minifiedScript.indexOf(placeholder) + placeholder.length) {
        return match;
      }
    }
    return `v${match}`;
  });

  // Restore the strings
  strings.forEach((str, index) => {
    const placeholder = `__STRING_${index}__`;
    minifiedScript = minifiedScript.replace(placeholder, str);
  });

  return minifiedScript;
};

export async function POST(req: Request) {
  const body = await req.json();
  const {script} = body
  const minifiedScript = minify(script);
  // const minifiedScript = script
  //     .split('\n')
  //     .map((line: any) => line.trim())
  //     .filter((line: any) => line && !line.startsWith('#'))
  //     .join(' ');
  return Response.json({minifiedScript})
}
