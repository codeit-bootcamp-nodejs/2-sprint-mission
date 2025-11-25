class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  // 리스트의 끝에 노드 추가
  addNode(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }
  findNode(index) {
    let current = this.head;
    while (current) {
      if (current.data === index) return current;
      current = current.next;
    }
    return null;
  }
  insertAfter(targetData, newData) {
    const targetNode = this.findNode(targetData);
    if (!targetNode) return false;

    const newNode = new Node(newData);
    newNode.next = targetNode.next;
    targetNode.next = newNode;

    if (targetNode === this.tail) {
      this.tail = newNode;
    }

    return true;
  }
  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode || !targetNode.next) return false;

    const nodeToRemove = targetNode.next;
    targetNode.next = nodeToRemove.next;

    if (nodeToRemove === this.tail) {
      this.tail = targetNode;
    }

    return true;
  }
}
