import {
  ClassProvider,
  FactoryProvider,
  InjectionToken,
  TokenProvider,
  ValueProvider,
} from '../providers';
import constructor from './constructor';
import RegistrationOptions from './registration-options';

export type ResolutionType = 'Single' | 'All';

export interface PreResolutionInterceptorCallback<T = any> {
  /**
   * @param token The InjectionToken that was intercepted
   * @param resolutionType The type of resolve that was called (i.e. All or Single)
   */
  (token: InjectionToken<T>, resolutionType: ResolutionType): void;
}

export interface PostResolutionInterceptorCallback<T = any> {
  /**
   * @param token The InjectionToken that was intercepted
   * @param result The object that was resolved from the container
   * @param resolutionType The type of resolve that was called (i.e. All or Single)
   */
  (
    token: InjectionToken<T>,
    result: T | T[],
    resolutionType: ResolutionType
  ): void;
}

export default interface DependencyContainer {
  register<T>(
    token: InjectionToken<T>,
    provider: ValueProvider<T>
  ): DependencyContainer;
  register<T>(
    token: InjectionToken<T>,
    provider: FactoryProvider<T>
  ): DependencyContainer;
  register<T>(
    token: InjectionToken<T>,
    provider: TokenProvider<T>,
    options?: RegistrationOptions
  ): DependencyContainer;
  register<T>(
    token: InjectionToken<T>,
    provider: ClassProvider<T>,
    options?: RegistrationOptions
  ): DependencyContainer;
  register<T>(
    token: InjectionToken<T>,
    provider: constructor<T>,
    options?: RegistrationOptions
  ): DependencyContainer;

  registerSingleton<T>(
    from: InjectionToken<T>,
    to: InjectionToken<T>
  ): DependencyContainer;
  registerSingleton<T>(token: constructor<T>): DependencyContainer;

  registerType<T>(
    from: InjectionToken<T>,
    to: InjectionToken<T>
  ): DependencyContainer;

  registerInstance<T>(
    token: InjectionToken<T>,
    instance: T
  ): DependencyContainer;

  /**
   * Resolve a token into an instance
   *
   * @param token The dependency token
   * @return An instance of the dependency
   */
  resolve<T>(token: InjectionToken<T>): T;

  /**
   * Check if the given dependency is registered
   *
   * @param token The token to check
   * @param recursive Should parent containers be checked?
   * @return Whether or not the token is registered
   */
  isRegistered<T>(token: InjectionToken<T>, recursive?: boolean): boolean;

  /**
   * Clears all registered tokens
   */
  reset(): void;

  clearInstances(): void;
  createChildContainer(): DependencyContainer;
}
