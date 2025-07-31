/**
 * Fabric.js Utility Functions
 * Simplified and standalone versions of essential Fabric.js utilities
 */

// Type definitions
export type TClassProperties<T = any> = Record<string, T> & {
  prototype?: any;
};

/**
 * Creates a class with inheritance support
 * Simplified version of Fabric's createClass
 */
export function createClass<T>(
  baseClass?: Function,
  properties?: TClassProperties<T>
): any {
  let klass = properties?.constructor || function(this: any) {};

  if (baseClass) {
    klass.prototype = Object.create(baseClass.prototype);
    klass.prototype.constructor = klass;
  }

  if (properties) {
    for (const propertyName in properties) {
      if (propertyName !== 'constructor') {
        klass.prototype[propertyName] = properties[propertyName];
      }
    }
  }

  return klass;
}

/**
 * Deep clone an object
 */
export function clone(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map(item => clone(item));
  }

  if (typeof obj === 'object') {
    const cloned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = clone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * Extend an object with properties from other objects
 */
export function extend(destination: any, ...sources: any[]): any {
  sources.forEach(source => {
    if (source) {
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          destination[key] = source[key];
        }
      }
    }
  });
  return destination;
}

/**
 * Check if value is an array
 */
export function isArray(value: any): value is Array<any> {
  return Array.isArray(value);
}

/**
 * Check if value is a function
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * Check if value is a string
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * Check if value is a number
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is undefined
 */
export function isUndefined(value: any): value is undefined {
  return value === undefined;
}

/**
 * Check if value is null
 */
export function isNull(value: any): value is null {
  return value === null;
}

/**
 * Check if value is null or undefined
 */
export function isNil(value: any): value is null | undefined {
  return value == null;
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Rotate a point around the origin
 */
export function rotatePoint(
  point: { x: number; y: number },
  origin: { x: number; y: number },
  radians: number
): { x: number; y: number } {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;

  return {
    x: dx * cos - dy * sin + origin.x,
    y: dx * sin + dy * cos + origin.y
  };
}

/**
 * Get array of object's own property names
 */
export function getObjectKeys(obj: any): string[] {
  return Object.keys(obj);
}

/**
 * Remove items from array
 */
export function removeFromArray<T>(array: T[], item: T): T[] {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

/**
 * Find index in array using predicate function
 */
export function findIndex<T>(array: T[], predicate: (item: T, index: number) => boolean): number {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i)) {
      return i;
    }
  }
  return -1;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Escape HTML entities
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Transform matrix multiplication
 * [a, b, c, d, e, f] represents the matrix:
 * [a c e]
 * [b d f]
 * [0 0 1]
 */
export function multiplyTransformMatrices(
  m1: number[],
  m2: number[]
): number[] {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],           // a
    m1[1] * m2[0] + m1[3] * m2[1],           // b
    m1[0] * m2[2] + m1[2] * m2[3],           // c
    m1[1] * m2[2] + m1[3] * m2[3],           // d
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],   // e
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5]    // f
  ];
}

/**
 * Get identity transform matrix
 */
export function getIdentityMatrix(): number[] {
  return [1, 0, 0, 1, 0, 0];
}

/**
 * Parse unit value (e.g., "10px" -> 10)
 */
export function parseUnit(value: string | number, fontSize = 16): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const num = parseFloat(value);
    if (value.includes('em')) {
      return num * fontSize;
    }
    if (value.includes('rem')) {
      return num * 16; // Default browser font size
    }
    if (value.includes('%')) {
      return (num / 100) * fontSize;
    }
    return num; // px or unitless
  }

  return 0;
}

/**
 * Simple event emitter implementation
 */
export class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback?: Function): void {
    if (!this.events[event]) return;
    
    if (callback) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    } else {
      delete this.events[event];
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }
    });
  }
}

/**
 * Object utilities
 */
export const object = {
  clone,
  extend
};

/**
 * Array utilities
 */
export const array = {
  removeFromArray,
  findIndex
};

/**
 * String utilities
 */
export const string = {
  capitalize,
  escapeXml
};

/**
 * Math utilities
 */
export const math = {
  degreesToRadians,
  radiansToDegrees,
  rotatePoint
};

/**
 * Type checking utilities
 */
export const typeOf = {
  isArray,
  isFunction,
  isString,
  isNumber,
  isUndefined,
  isNull,
  isNil
}; 