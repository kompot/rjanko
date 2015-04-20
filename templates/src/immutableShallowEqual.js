import Immutable from 'immutable';
import {Reference} from './Structure';


export function immutableCursorIs(objA, objB) {
  if ((objA instanceof Reference) && (objB instanceof Reference)) {
    return Immutable.is(objA.derefPure(), objB.derefPure());
  }
  return Immutable.is(objA, objB);
}


export default function immutableShallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  if (Immutable.is(objA, objB)) {
    return true;
  }
  var key;
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || !immutableCursorIs(objA[key], objB[key]))) {
      return false;
    }
  }
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
