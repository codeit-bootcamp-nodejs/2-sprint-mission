class DNode {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToHead(value) {
    const newNode = new DNode(value);

    if (!this.head) {
      this.head = this.tail = newNode;
      return;
    }

    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }

  addToTail(value) {
    const newNode = new DNode(value);

    if (!this.tail) {
      this.head = this.tail = newNode;
      return;
    }

    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  findNode(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return false;

    const newNode = new DNode(newValue);
    const nextNode = targetNode.next;

    newNode.prev = targetNode;
    newNode.next = nextNode;
    targetNode.next = newNode;

    if (nextNode) nextNode.prev = newNode;
    else this.tail = newNode;

    return true;
  }

  removeNode(value) {
    const node = this.findNode(value);
    if (!node) return false;

    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;

    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;

    return true;
  }
}
