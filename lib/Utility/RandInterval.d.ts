declare class RandInterval {
    private _intervals;
    get Intervals(): Array<RandIntervalItem>;
    constructor(intervals?: Array<RandIntervalItem>);
    addInterval(item: RandIntervalItem): void;
    removeInterval(item: RandIntervalItem): void;
    clearIntervals(): void;
}
declare class RandIntervalItem {
    private _weight;
    get Weight(): number;
    set Weight(newWeight: number);
    private _range;
    get Range(): RandRange;
    set Range(newRange: RandRange);
    constructor(range: RandRange);
}
declare class RandRange {
    private _min;
    get Min(): number;
    set Min(newMin: number);
    private _max;
    get Max(): number;
    set Max(newMax: number);
    constructor(min: number, max: number);
}
export { RandInterval, RandIntervalItem, RandRange };
