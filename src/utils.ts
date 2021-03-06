import * as Debug from 'debug';
const debug = Debug('dtsgen');

export function toTSType(type: string, debugSource?: any): string {
    switch (type) {
        case 'integer':
            return 'number';
        case 'number':
        case 'any':
        case 'null':
        case 'string':
        case 'boolean':
            return type;
        case 'object':
        case 'array':
            return null;
        default:
            if (debugSource) {
                console.error('  debugSource=' + debugSource);
            }
            throw new Error('unknown type: ' + type);
    }
}

export type CorrectTypeName = "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";
export function reduceTypes(types: CorrectTypeName[]): CorrectTypeName[] {
    if (types.length < 2) {
        return types;
    }
    const set = new Set<CorrectTypeName>(types);
    set.delete('null');
    if (set.delete('integer')) {
        set.add('number');
    }
    const result: CorrectTypeName[] = [];
    set.forEach((type: CorrectTypeName) => {
        result.push(type);
    });
    return result;
}

export function capitalizeName(str: string): string {
    // debug(`capitalizeName: ${str}`);
    if (!str) return str;
    str = str.trim();
    const ss = str.split('$');
    return ss.map(s => s.replace(/(?:^|[^A-Za-z0-9])([A-Za-z0-9])/g, function(_, m) {
        return m.toUpperCase();
    })).join('$');
}

export function mergeSchema(a: any, b: any): any {
    Object.keys(b).forEach((key) => {
        if (a[key]) {
            console.error('  lhs=' + a);
            console.error('  rhs=' + b);
            throw new Error('invalid schema: duplicate property in allOf.');
        }
        a[key] = b[key];
    });
    return a;
}

export function strMapToJson(strMap: Map<string>): string {
    return JSON.stringify(strMapToObj(strMap));
}

export function strMapToObj(strMap: Map<string>): Object {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        obj[k] = v;
    }
    return obj;
}

// converts string to TitleCase
export function titleCase(str: string): string {
  // debug('titleCase', str);
  return capitalizeName(str.replace(/[^\w]+(\w)/g, s => s.toUpperCase()).replace(/[^0-9A-Za-z_$]/g, ''));
}

export function nameFromPath(path: string, fixCase: boolean = true): string {
  // debug(`nameFromPath: ${path}`);
  if(!path) return '';
  let name = path.split('/').pop();
  return fixCase ? titleCase(name) : name;
}
