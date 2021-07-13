import { World } from './world';

export abstract class System {
  /**
   *
   * @param world World
   * @param dt Delta time
   */
  public abstract update(world: World, dt: number): void;
}
