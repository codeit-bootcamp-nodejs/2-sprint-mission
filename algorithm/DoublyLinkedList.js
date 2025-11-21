class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  // 앞에 추가
  addToHead(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }

  // 뒤에 추가
  addToTail(value) {
    const newNode = new Node(value);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  // 값 찾기
  findNode(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  // 노드 추가
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return;

    const newNode = new Node(newValue);

    newNode.next = targetNode.next;
    newNode.prev = targetNode;

    if (targetNode.next) {
      targetNode.next.prev = newNode;
    } else {
      this.tail = newNode;
    }

    targetNode.next = newNode;
  }

  // 노드 삭제
  removeNode(value) {
    const node = this.findNode(value);
    if (!node) return;

    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;

    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;
  }
}

function printList(list) {
  let current = list.head;
  const values = [];
  while (current) {
    values.push(current.value);
    current = current.next;
  }
  return values.join(" <-> ");
}

const list = new DoublyLinkedList();

list.addToHead(1);
list.addToTail(2);
list.addToTail(3);

console.log("초기:", printList(list));
list.insertAfter(2, 99);
console.log("\n2 뒤에 99 삽입:", printList(list));
list.removeNode(99);
console.log("\n99 삭제:", printList(list));
console.log("\n노드 찾기(3):", list.findNode(3));
