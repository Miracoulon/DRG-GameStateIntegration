declare class DRGGSIQueue {
    private _elements;
    private _head;
    private _tail;
    constructor();
    enqueue(element: DRGGSIQueueEntry): void;
    dequeue(): DRGGSIQueueEntry;
    get length(): number;
    get isEmpty(): boolean;
}
