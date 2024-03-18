class DRGGSIQueue {
    constructor() {
        this._elements = [];
        this._head = 0;
        this._tail = 0;
    }
    enqueue(element) {
        this._elements[this._tail] = element;
        this._tail++;
    }
    dequeue() {
        if (this.isEmpty)
            return null;
        const element = this._elements[this._head];
        delete this._elements[this._head];
        this._head++;
        return element;
    }
    get length() {
        return this._tail - this._head;
    }
    get isEmpty() {
        return this.length === 0;
    }
}
