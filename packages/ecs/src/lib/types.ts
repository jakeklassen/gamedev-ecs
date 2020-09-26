import { ComponentFactory } from './entity-manager';

export type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never;

export type ComponentFilter<T> = UnionToIntersection<
  T extends ComponentFactory<infer U> ? Record<T['componentName'], U> : never
>;
