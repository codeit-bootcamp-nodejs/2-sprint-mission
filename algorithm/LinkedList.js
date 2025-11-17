// 클래스 이름:  LinkedList
/**
 * 메서드
 * addNode(value): 리스트의 끝에 새 노드를 추가
 * findNode(value) : 주어진 값을 가지는 노드를 찾아 리턴
 * insertAfter(targetValue, newValue) : 특정 값을 가진 노드 뒤에 새 노드 추가
 * removeAfter(targerValue) : 특정 값을 가진 노드 뒤의 노드를 삭제
 */

class Node {
  constructor(value) {
    this.value = value;
    this.next - null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

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

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (targetNode) {
      const newNode = new Node(newValue);
      newNode.next = targetNode.next;
      targetNode.next = newNode;
    } else {
      console.log(`Target value {targetValue} not found`);
    }
  }

  removeAfter(targetValue) {
    let current = this.head;
    while (current) {
      if (current.value === targetValue) {
        // 만약에 타겟 노드가 마지막 노드고, 이후에 아무것도 없다면
        if (!current.next) {
          return null;
        }
        const removedNode = current.next;
        current.next = removedNode.next;
        removedNode.next = null;
        return removedNode;
      }
      current = current.next;
    }
    return null;
  }
  displayList() {
    let current = this.head;
    const values = [];
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    console.log(values.join(` -> `) + ` -> null`);
  }
}

const list = new LinkedList();
list.addNode(1);
list.addNode(2);
list.addNode(3);
list.displayList();

const foundNode = list.findNode(2);
console.log(
  `Found node with value 2: ${foundNode ? foundNode.value : "Not found"}`
);

list.insertAfter(2, 2.5);
list.displayList();

list.removeAfter(1);
list.displayList();

list.removeAfter(3);
list.displayList();
