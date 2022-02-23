import { Registration } from './dependency-container';
import { InjectionToken } from './providers';

export default class ResolutionContext {
  scopedResolutions: Map<Registration, any> = new Map();
  workingToken = new Set<InjectionToken>();
}
