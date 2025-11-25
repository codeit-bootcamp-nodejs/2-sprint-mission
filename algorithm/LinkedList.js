class LinkedNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  // 리스트의 끝에 새 노드 추가
  addNode(value) {
    const newNode = new LinkedNode(value);

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

  // 주어진 값을 가지는 노드를 찾아 리턴
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
    if (!targetNode) 
      return; // 못 찾으면 아무 것도 안 함

    const newNode = new LinkedNode(newValue);
    newNode.next = targetNode.next;
    targetNode.next = newNode;
  }

  // 특정 값을 가진 노드 뒤의 노드를 삭제
  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode || !targetNode.next) // 뒤에 노드가 없으면 아무 것도 안 함
      return;

    const nodeToRemove = targetNode.next;
    targetNode.next = nodeToRemove.next;
   }
}

// 테스트 코드
const list = new LinkedList();
list.addNode(1);
list.addNode(2);
list.addNode(3);
console.log('1) add 1,2,3 후:', JSON.stringify(list, null, 2));

list.insertAfter(1, 4);
console.log('2) insertAfter(1,4) 후:', JSON.stringify(list, null, 2));

list.removeAfter(2);
console.log('3) removeAfter(2) 후:', JSON.stringify(list, null, 2));
