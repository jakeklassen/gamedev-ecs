import { suite } from "./suite.js";

const NUM_ENTITIES = 1000;

const create_and_delete_suite = suite(
  `Create and delete (entities: ${4 * NUM_ENTITIES})`
);

const update_3_queries_suite = suite(
  `Update (entities: ${4 * NUM_ENTITIES}, queries: 3)`
);

await add_implementation("@jakeklassen/ecs");
await add_implementation("@gamedev/ecs");
// await add_implementation("ecsy");
// await add_implementation("ent-comp");
// await add_implementation("flock-ecs");
// await add_implementation("makr");
// await add_implementation("modecs");
await add_implementation("perform-ecs");
// await add_implementation("picoes");
// await add_implementation("tiny-ecs");

create_and_delete_suite.run();
update_3_queries_suite.run();

async function add_implementation(pkg) {
  let { version } = await import(`${pkg}/package.json`).then(
    (module) => module.default
  );
  let name = `${pkg}@${version}`;

  let normalized_pkg = pkg.replace(/^@/, "").replace(/\//, "-");
  let impl = await import(`./cases/${normalized_pkg}.js`);

  // create_and_delete_suite.add(name, impl.bench_create_delete(NUM_ENTITIES));
  update_3_queries_suite.add(name, impl.bench_update(NUM_ENTITIES));
}
