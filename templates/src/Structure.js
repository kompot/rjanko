import {EventEmitter} from 'events';
import raf from 'raf';

import Immutable from 'immutable';


export class Reference {

  constructor(struct, keyPath = []) {
    this.struct = struct;
    if (typeof keyPath === 'string') {
      keyPath = [keyPath];
    }
    this.keyPath = keyPath;
    this._val = this.struct.getIn(keyPath);
  }

  derefPure() {
    return this._val;
  }

  deref() {
    return this.struct.getIn(this.keyPath);
  }

  set(val) {
    this.struct.setIn(this.keyPath, val);
  }

  update(updater) {
    this.struct.updateIn(this.keyPath, updater);
  }

  setIn(keyPath, val) {
    this.cursor(keyPath).set(val);
  }

  updateIn(keyPath, updater) {
    this.cursor(keyPath).update(updater);
  }

  cursor(keyPath = []) {
    if (typeof keyPath === 'string') {
      keyPath = [keyPath];
    }
    const ref = new Reference(this.struct, this.keyPath.concat(keyPath));
    if (!ref.derefPure()) {
      this.struct.setIn(this.keyPath.concat(keyPath), '');
    }
    return ref;
  }

  ref(keyPath) {
    return this.cursor(keyPath);
  }

  get(key) {
    return this.getIn([key]);
  }

  getIn(keyPath = []) {
    return this.struct.getIn(this.keyPath.concat(keyPath));
  }

  map(mapper) {
    return this.struct.getIn(this.keyPath).map((_, idx) => mapper(this.cursor(idx), idx));
  }

  forEach(iter) {
    return this.struct.getIn(this.keyPath).forEach((_, idx) => iter(this.cursor(idx), idx));
  }

  remove() {
    return this.struct.removeIn(this.keyPath);
  }

  removeIn(keyPath = []) {
    return this.struct.removeIn(this.keyPath.concat(keyPath));
  }

}


export default class Structure extends EventEmitter {

  constructor(data, async) {
    super();
    this._emitChange = this._emitChange.bind(this);
    this._struct = Immutable.fromJS(data);
    this._lastState = this._struct;
    this._async = async;
  }

  _update(newStruct) {
    this._struct = newStruct;
    if (this._async) {
      if (this._scheduledEmit) {
        cancelAnimationFrame(this._scheduledEmit);
      }
      this._scheduledEmit = raf(this._emitChange);
    } else {
      this._emitChange();
    }
  }

  _emitChange() {
    this._scheduledEmit = null;
    if (!Immutable.is(this._struct, this._lastState)) {
      this._lastState = this._struct;
      this.emit('change');
    }
  }

  inspect() {
    return 'Structure { ' + this._struct.toString() + ' }';
  }

  toString() {
    return this.inspect();
  }

  cursor(keyPath = []) {
    return new Reference(this, keyPath);
  }

  getIn(keyPath = []) {
    if (typeof keyPath === 'string') {
      keyPath = [keyPath];
    }
    return this._struct.getIn(keyPath);
  }

  deref() {
    return this._struct;
  }

  updateIn(keyPath, updater) {
    if (typeof keyPath === 'string') {
      keyPath = [keyPath];
    }
    this._update(this._struct.updateIn(keyPath, updater));
  }

  update(updater) {
    this.updateIn([], (val) => Immutable.fromJS(updater(val)));
  }

  setIn(keyPath, value) {
    if (typeof keyPath === 'string') {
      keyPath = [keyPath];
    }
    this._update(this._struct.setIn(keyPath, Immutable.fromJS(value)));
  }

  set(value) {
    this.setIn([], value);
  }

  removeIn(keyPath) {
    this._update(this._struct.removeIn(keyPath));
  }
}
