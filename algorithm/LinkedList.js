class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  // 리스트 끝에 새 노드 추가
  addNode(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }

    current.next = newNode;
  }

  // 값이 같은 노드 찾기
  findNode(value) {
    let current = this.head;

    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }

    return null;
  }

  // 특정 값 뒤에 새 노드 추가
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return;

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    targetNode.next = newNode;
  }

  // 특정 값 뒤 노드 삭제
  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode || !targetNode.next) return;

    targetNode.next = targetNode.next.next;
  }
}

function printList(list) {
  let current = list.head;
  const values = [];

  while (current) {
    values.push(current.value);
    current = current.next;
  }

  return values.join(" -> ");
}

const list = new LinkedList();

list.addNode(1);
list.addNode(2);
list.addNode(3);

console.log("초기:", printList(list));
list.insertAfter(2, 99);
console.log("\n2 뒤에 99 삽입:", printList(list));
list.removeAfter(2);
console.log("\n2 뒤 삭제:", printList(list));
console.log("\n노드 찾기(3):", list.findNode(3));
