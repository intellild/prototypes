import { createMacro, MacroHandler } from 'babel-plugin-macros';
import * as t from '@babel/types';
import { serializeType } from './serializeTypeReference';

type TokenNode =
  | t.Identifier
  | t.UnaryExpression
  | t.ConditionalExpression
  | t.Expression;

function createFactory(tokens: TokenNode[], klassName: string) {
  const args = tokens.map((token) =>
    t.callExpression(
      t.memberExpression(t.identifier('container'), t.identifier('resolve')),
      [token, t.identifier('context')]
    )
  );

  return t.classMethod(
    'method',
    t.identifier('ɵfac'),
    [t.identifier('container'), t.identifier('context')],
    t.blockStatement([
      t.returnStatement(t.newExpression(t.identifier(klassName), args)),
    ]),
    false,
    true
  );
}

const injectableMacro: MacroHandler = ({ references }) => {
  for (const reference of references.default) {
    const decorator = reference.findParent((parentPath) =>
      parentPath.isDecorator()
    );
    if (!decorator) {
      throw new Error();
    }
    const klass = decorator.parentPath;
    if (!klass) {
      throw new Error();
    }
    if (!klass.isClassDeclaration()) {
      throw new Error();
    }
    if (!klass.node.id) {
      throw new Error();
    }
    klass.node.decorators = klass.node.decorators?.filter(
      (it) => it !== decorator.node
    );
    const tokens: TokenNode[] = [];
    klass.traverse({
      ClassMethod(method) {
        if (method.node.kind !== 'constructor') {
          return;
        }
        for (const param of method.node.params) {
          if (param.type === 'RestElement') {
            throw new Error();
          }
          const reservedDecorator: t.Decorator[] = [];
          let resolvedByDecorator = false;
          param.decorators?.forEach((paramDecorator) => {
            if (paramDecorator) {
              resolvedByDecorator = true;
              if (paramDecorator.expression.type !== 'CallExpression') {
                throw new Error();
              }
              if (!paramDecorator.expression.arguments.length) {
                throw new Error();
              }
              const argument = paramDecorator.expression.arguments[0];
              if (!t.isExpression(argument)) {
                throw new Error();
              }
              tokens.push(argument);
            } else {
              reservedDecorator.push(paramDecorator);
            }
          });
          param.decorators = reservedDecorator;
          if (resolvedByDecorator) {
            continue;
          }
          const serialized = serializeType(klass, param);
          tokens.push(serialized);
        }
      },
    });
    klass.node.body.body.push(createFactory(tokens, klass.node.id.name));
  }
};

export = createMacro(injectableMacro);
