import injectable from './lib.proxy.macro';

@injectable()
class B {}

@injectable()
class A {
  constructor(b: B) {}
}
