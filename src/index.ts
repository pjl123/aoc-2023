import { downloadInput } from "./inputDownloader.js";

const year = "2023";
const day = process.argv[2].toString();

const input = await downloadInput({ year, day });

const solution = await import(`./days/${day}.ts`);
console.log(solution.default(input));
