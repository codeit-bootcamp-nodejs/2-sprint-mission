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

  // 리스트의 앞쪽에 노드 추가
  addToHead(value) {
    const newNode = new Node(value);

    // 리스트가 비어있으면
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    // 새 노드를 head 앞에 추가
    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }

  // 리스트의 뒤쪽에 노드 추가
  addToTail(value) {
    const newNode = new Node(value);

    // 리스트가 비어있으면
    if (this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    // 새 노드를 tail 뒤에 추가
    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  // 값을 가진 노드를 찾아 반환
  findNode(value) {
    let current = this.head;

    while (current !== null) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }

    return null; // 못 찾으면 null 반환
  }

  // 특정 값을 가진 노드 뒤에 새 노드 추가
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);

    // 타겟 노드를 못 찾으면 종료
    if (targetNode === null) {
      return false;
    }

    const newNode = new Node(newValue);

    // 타겟 노드가 tail인 경우
    if (targetNode === this.tail) {
      this.addToTail(newValue);
      return true;
    }

    // 중간에 삽입
    newNode.next = targetNode.next;
    newNode.prev = targetNode;
    targetNode.next.prev = newNode;
    targetNode.next = newNode;

    return true;
  }

  // 특정 값을 가진 노드 삭제
  removeNode(value) {
    const targetNode = this.findNode(value);

    // 타겟 노드를 못 찾으면 종료
    if (targetNode === null) {
      return false;
    }

    // 삭제할 노드가 head인 경우
    if (targetNode === this.head) {
      this.head = targetNode.next;
      if (this.head !== null) {
        this.head.prev = null;
      } else {
        // 리스트가 비게 되면 tail도 null
        this.tail = null;
      }
      return true;
    }

    // 삭제할 노드가 tail인 경우
    if (targetNode === this.tail) {
      this.tail = targetNode.prev;
      this.tail.next = null;
      return true;
    }

    // 중간 노드 삭제
    targetNode.prev.next = targetNode.next;
    targetNode.next.prev = targetNode.prev;

    return true;
  }

  // 앞에서부터 출력
  print() {
    const values = [];
    let current = this.head;
    while (current !== null) {
      values.push(current.value);
      current = current.next;
    }
    console.log(values.join(' <-> '));
  }

  // 뒤에서부터 출력
  printReverse() {
    const values = [];
    let current = this.tail;
    while (current !== null) {
      values.push(current.value);
      current = current.prev;
    }
    console.log(values.join(' <-> '));
  }
}

module.exports = DoublyLinkedList;
