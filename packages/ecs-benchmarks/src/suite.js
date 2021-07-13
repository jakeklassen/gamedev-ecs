import Benchmark from "benchmark";
import chalk from "chalk";

const { Suite } = Benchmark;
const { gray, red, white } = chalk;

/**
 * @param {string} name
 * @returns {Benchmark.Suite}
 */
export function suite(name) {
  return new Suite()
    .on("start", () => {
      console.log(white.bold(name));
    })
    .on("complete", () => {
      console.log();
    })
    .on("cycle", (event) => {
      let bench = event.target;
      if (bench.error) {
        console.log(`  ${bench.name}  ${red.inverse(" ERROR ")}`);
        console.log(red(bench.error.stack));
      } else {
        let ops = Math.floor(bench.hz).toLocaleString();
        let rme = bench.stats.rme.toFixed(2);
        console.log(`  ${bench.name}:`, gray(`${ops} op/s (±${rme}%)`));
      }
    });
}
