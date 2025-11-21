class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  // 리스트의 앞에 노드 추가
  addToHead(data) {
    const newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    newNode.next = this.head;
    this.head.next = newNode;
    this.head = newNode;
  }
  addToTail(data) {
    const newNode = new Node(data);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }
  // 값으로 노드 찾기
  findNode(value) {
    let current = this.head;
    while (current) {
      if (current.data === value) return current;
      current = current.next;
    }
    return null;
  }

  // 특정 노드 뒤에 새 노드 추가
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return false;

    const newNode = new Node(newValue);
    const nextNode = targetNode.next;

    newNode.prev = targetNode;
    newNode.next = nextNode;

    targetNode.next = newNode;
    if (nextNode) {
      nextNode.prev = newNode;
    }

    if (targetNode === this.tail) {
      this.tail = newNode;
    }

    return true;
  }

  // 특정 값을 가진 노드 삭제
  removeNode(value) {
    const targetNode = this.findNode(value);
    if (!targetNode) return false;

    const prevNode = targetNode.prev;
    const nextNode = targetNode.next;

    if (prevNode) {
      prevNode.next = nextNode;
    } else {
      this.head = nextNode;
    }

    if (nextNode) {
      nextNode.prev = prevNode;
    } else {
      this.tail = prevNode;
    }

    return true;
  }
}
