export {};

type UnionToIntersection<Union> = (
  // `extends unknown` is always going to be the case and is used to convert the
  // `Union` into a [distributive conditional
  // type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  Union extends unknown // The union type is used as the only argument to a function since the union // of function arguments is an intersection.
    ? (distributedUnion: Union) => void // This won't happen.
    : never
      // Infer the `Intersection` type since TypeScript represents the positional
      // arguments of unions of functions as an intersection of the union.
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never;

// https://stackoverflow.com/a/43674389
interface MyType {
  instanceMethod(): void;
}

interface MyTypeStatic {
  new (): MyType;
  staticMethod(): void;
}

function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

@staticImplements<MyTypeStatic>()
class MyTypeClass {
  static staticMethod() {}
  instanceMethod() {}
}

abstract class Component {
  readonly #component = true;
}

// TEST

interface ComponentStatic {
  readonly componentName: string;
}

@staticImplements<ComponentStatic>()
class C {
  static readonly componentName = 'C';
}

C.componentName;

// TEST

type GenericComponentConstructor<T extends Component> = {
  new (...args: any): T;
  readonly componentName: string;
};

class Position extends Component {
  static readonly componentName = 'position';

  constructor(public x = 0, public y = 0) {
    super();
  }
}

class Velocity extends Component {
  static readonly componentName = 'velocity';

  constructor(public vx = 0, public vy = 0) {
    super();
  }
}

type ComponentFilter<T> = UnionToIntersection<
  T extends GenericComponentConstructor<infer U>
    ? Record<T['componentName'], U>
    : never
>;

function ecsFilter<T extends GenericComponentConstructor<Component>[]>(
  ...components: T
): // @ts-ignore
ComponentFilter<T[number]> {}

const filter = ecsFilter(Position, Velocity);
