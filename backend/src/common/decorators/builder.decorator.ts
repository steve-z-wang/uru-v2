import 'reflect-metadata';

/**
 * Builder decorator that automatically generates a builder pattern for a class
 * @param target The class constructor
 */
export function Builder<T extends { new (...args: any[]): {} }>(target: T) {
  // Get property metadata
  const properties = Reflect.getMetadataKeys(target.prototype)
    .filter(key => key.startsWith('design:type'))
    .map(key => key.replace('design:type:', ''));

  // Create builder class
  class DynamicBuilder {
    private instance: InstanceType<T>;

    constructor() {
      this.instance = new target() as InstanceType<T>;
    }

    build(): InstanceType<T> {
      return this.instance;
    }
  }

  // Add property methods to builder
  Object.getOwnPropertyNames(target.prototype).forEach(propName => {
    if (propName !== 'constructor') {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propName);
      if (descriptor && typeof descriptor.value !== 'function') {
        (DynamicBuilder.prototype as any)[propName] = function(value: any) {
          (this.instance as any)[propName] = value;
          return this;
        };
      }
    }
  });

  // Add static builder method to the original class
  (target as any).builder = () => new DynamicBuilder();

  return target;
}

/**
 * Property decorator to mark fields as builder properties
 */
export function BuilderProperty(target: any, propertyKey: string) {
  Reflect.defineMetadata(`builder:property:${propertyKey}`, true, target);
}
