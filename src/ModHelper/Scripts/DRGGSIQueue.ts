class DRGGSIQueue {
    private _elements;
    private _head: number;
    private _tail: number;

    constructor() {
        this._elements = [];
        this._head = 0;
        this._tail = 0;
    }

    public enqueue(element: DRGGSIQueueEntry) {
        this._elements[this._tail] = element;
        this._tail++;
    }

    public dequeue(): DRGGSIQueueEntry {
        if (this.isEmpty) return null;
        const element = this._elements[this._head];
        delete this._elements[this._head];
        this._head++;
        return element;
    }

    public get length(): number {
        return this._tail - this._head;
    }

    public get isEmpty(): boolean {
        return this.length === 0;
    }
}