class RandInterval {
    

    private _intervals: Array<RandIntervalItem>;
    public get Intervals(): Array<RandIntervalItem> { return this._intervals; };

    public constructor(intervals?: Array<RandIntervalItem>) {
        this._intervals = intervals ? intervals : new Array<RandIntervalItem>();
    }

    public addInterval(item: RandIntervalItem) {
        this._intervals.push(item);
    }

    public removeInterval(item: RandIntervalItem) {
        const index = this._intervals.indexOf(item);
        if (index <= -1) return;
        this._intervals.splice(index, 1);
    }

    public clearIntervals() {
        this._intervals = new Array<RandIntervalItem>();
    }
}

class RandIntervalItem {
    private _weight: number;
    public get Weight(): number { return this._weight; };
    public set Weight(newWeight: number) { this._weight = newWeight; };

    private _range: RandRange;
    public get Range(): RandRange { return this._range; };
    public set Range(newRange: RandRange) { this._range = newRange; };

    public constructor(range: RandRange) {
        this._range = range;
    }
}

class RandRange {
    private _min: number;
    public get Min(): number { return this._min; };
    public set Min(newMin: number) { this._min = newMin; };
    private _max: number;
    public get Max(): number { return this._max; };
    public set Max(newMax: number) { this._max = newMax; };

    public constructor(min: number, max: number) {
        this._min = min;
        this._max = max;
    }
}

export { RandInterval, RandIntervalItem, RandRange };