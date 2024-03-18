"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandRange = exports.RandIntervalItem = exports.RandInterval = void 0;
class RandInterval {
    get Intervals() { return this._intervals; }
    ;
    constructor(intervals) {
        this._intervals = intervals ? intervals : new Array();
    }
    addInterval(item) {
        this._intervals.push(item);
    }
    removeInterval(item) {
        const index = this._intervals.indexOf(item);
        if (index <= -1)
            return;
        this._intervals.splice(index, 1);
    }
    clearIntervals() {
        this._intervals = new Array();
    }
}
exports.RandInterval = RandInterval;
class RandIntervalItem {
    get Weight() { return this._weight; }
    ;
    set Weight(newWeight) { this._weight = newWeight; }
    ;
    get Range() { return this._range; }
    ;
    set Range(newRange) { this._range = newRange; }
    ;
    constructor(range) {
        this._range = range;
    }
}
exports.RandIntervalItem = RandIntervalItem;
class RandRange {
    get Min() { return this._min; }
    ;
    set Min(newMin) { this._min = newMin; }
    ;
    get Max() { return this._max; }
    ;
    set Max(newMax) { this._max = newMax; }
    ;
    constructor(min, max) {
        this._min = min;
        this._max = max;
    }
}
exports.RandRange = RandRange;
