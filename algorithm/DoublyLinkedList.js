class DoublyLinkedNode {
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

  // 리스트의 앞쪽에 노드 추가
  addToHead(value) {
    const newNode = new DoublyLinkedNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }

  // 리스트의 뒤쪽에 노드 추가
  addToTail(value) {
    const newNode = new DoublyLinkedNode(value);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  // 값을 가진 노드를 찾아 반환
  findNode(value) {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }

    return null;
  }

  // 특정 값을 가진 노드 뒤에 새 노드 추가
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return;

    const newNode = new DoublyLinkedNode(newValue);

    newNode.prev = targetNode;
    newNode.next = targetNode.next;

    if (targetNode.next) {
      targetNode.next.prev = newNode;
    } else {
      this.tail = newNode;
    }

    targetNode.next = newNode;
  }

  // 특정 값을 가진 노드 삭제
  removeNode(value) {
    const nodeToRemove = this.findNode(value);
    if (!nodeToRemove) return;

    // head인 경우
    if (nodeToRemove === this.head) {
      this.head = nodeToRemove.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
    }
    // tail인 경우
    else if (nodeToRemove === this.tail) {
      this.tail = nodeToRemove.prev;
      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
    }
    // 가운데 노드
    else {
      nodeToRemove.prev.next = nodeToRemove.next;
      nodeToRemove.next.prev = nodeToRemove.prev;
    }
  }
}

// 테스트
function printForward(list) {
  const values = [];
  let current = list.head;
  while (current) {
    values.push(current.value);
    current = current.next;
  }
  console.log('head -> tail:', values.join(' <-> '));
}

function printBackward(list) {
  const values = [];
  let current = list.tail;
  while (current) {
    values.push(current.value);
    current = current.prev;
  }
  console.log('tail -> head:', values.join(' <-> '));
}

// 테스트 코드
const list = new DoublyLinkedList();

// 1) head에 2 추가
list.addToHead(2);
console.log('1) addToHead(2):');
printForward(list);
printBackward(list);

// 2) head에 1 추가 → 1 <-> 2
list.addToHead(1);
console.log('\n2) addToHead(1):');
printForward(list);
printBackward(list);

// 3) tail에 3 추가 → 1 <-> 2 <-> 3
list.addToTail(3);
console.log('\n3) addToTail(3):');
printForward(list);
printBackward(list);

// 4) 값이 2인 노드 뒤에 10 추가 → 1 <-> 2 <-> 10 <-> 3
list.insertAfter(2, 10);
console.log('\n4) insertAfter(2, 10):');
printForward(list);
printBackward(list);

// 5) 값이 10인 노드 삭제 → 1 <-> 2 <-> 3
list.removeNode(10);
console.log('\n5) removeNode(10):');
printForward(list);
printBackward(list);

// 6) head(1) 삭제 → 2 <-> 3
list.removeNode(1);
console.log('\n6) removeNode(1) (head 제거 후):');
printForward(list);
printBackward(list);

// 7) tail(3) 삭제 → 2
list.removeNode(3);
console.log('\n7) removeNode(3) (tail 제거 후):');
printForward(list);
printBackward(list);