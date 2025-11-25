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

  // 리스트의 끝에 새 노드를 추가
  addNode(value) {
    const newNode = new Node(value);

    // 리스트가 비어있으면 head에 추가
    if (this.head === null) {
      this.head = newNode;
      return;
    }

    // 마지막 노드를 찾아서 추가
    let current = this.head;
    while (current.next !== null) {
      current = current.next;
    }
    current.next = newNode;
  }

  // 주어진 값을 가지는 노드를 찾아 리턴
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
    newNode.next = targetNode.next;
    targetNode.next = newNode;
    return true;
  }

  // 특정 값을 가진 노드 뒤의 노드를 삭제
  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);

    // 타겟 노드를 못 찾거나 다음 노드가 없으면 종료
    if (targetNode === null || targetNode.next === null) {
      return false;
    }

    // 타겟 노드의 다음 노드를 건너뛰기
    targetNode.next = targetNode.next.next;
    return true;
  }

  // 리스트 출력
  print() {
    const values = [];
    let current = this.head;
    while (current !== null) {
      values.push(current.value);
      current = current.next;
    }
    console.log(values.join(' -> '));
  }
}

module.exports = LinkedList;
