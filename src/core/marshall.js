import Transit from 'transit-js';
import Immutable from 'immutable';
 
const reader = Transit.reader('json', {
  arrayBuilder: {
    init: () => Immutable.List.of().asMutable(),
    add: (ret, val) => ret.push(val),
    finalize: (ret) => ret.asImmutable(),
    fromArray: (arr) => Immutable.List(arr)
  },
  mapBuilder: {
    init: () => Immutable.Map().asMutable(),
    add: (ret, key, val) => ret.set(key, val),
    finalize: (ret) => ret.asImmutable()
  },
  handlers: {
    set: (arr) => Immutable.Set(arr),
    orderedMap: (arr) => Immutable.OrderedMap(arr)
  }
});

const writer = Transit.writer('json-verbose', {
  handlers: Transit.map([
    Immutable.List, Transit.makeWriteHandler({
      tag: () => 'array',
      rep: (v) => v,
      stringRep: () => null
    }),
    Immutable.Map, Transit.makeWriteHandler({
      tag: () => 'map',
      rep: (v) => v,
      stringRep: () => null
    }),
    Immutable.Set, Transit.makeWriteHandler({
      tag: () => 'set',
      rep: (v) => v.toArray(),
      stringRep: () => null
    }),
    Immutable.OrderedMap, Transit.makeWriteHandler({
      tag: () => 'orderedMap',
      rep: (v) => v.toArray().filter(x => x),
      stringRep: () => null
    })
  ])
});

export const stringify = (val) => writer.write(val);

export const parse = (val) => reader.read(val);

export default {parse, stringify};
