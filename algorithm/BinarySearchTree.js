// 클래스 이름: BinarySearchTree
/**
 * 메서드
 * insert(value) : 트리에 값 추가
 * find(value) : 주어진 값을 찾고 해당 노드를 리턴
 * remove(value) : 트리에서 해당 값을 삭제
 */

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode();
      return this;
    }

    // 만약 루트가 있는 경우, 최초에는 루트다.
    let current = this.root;
    while (true) {
      // 이미 존재해서 인서트가 불가능하기 때문에
      if (value === current.value) return false;

      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        // 한층 아래로 내려가기
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        // 한층 아래로 내려가기
        current = current.right;
      }
    }
  }

  find(value) {
    if (this.root === null) return false;

    let current = this.root;
    let found = false;

    while (current && !found) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        found = true;
      }
    }
    if (!found) return undefined;
    return current;
  }

  remove(value) {
    if (!this.root) return false;

    let current = this.root;
    let parent = null;
    let isLeftChild = true;

    // 삭제할 노드 찾기 & 그 노드의 부모 추적하기(노드 삭제 시 부모의 포인터 수정 위해)
    // 현재 노드가 존재하고, 그 값이 제거하려는 값과 다른 경우
    // 현재 노드가 존재하지 않거나, 제거하려는 값이 없는 경우
    // 값이 같으면 순회 중지(타겟 노드 찾음)
    while (current && current.value !== value) {
      parent = current;
      if (value < current.value) {
        isLeftChild = true;
        current = current.left;
      } else {
        isLeftChild = false;
        current = current.right;
      }
    }
    // 값이 없는 경우
    if (!current) return false;

    // 이 부분부터는 찾은 current 노드를 제거한 뒤 이어붙이는 목적 때문에 존재하는 코드이다.

    // Case 1: 리프 노드인 경우 (자식이 없는 경우)
    // 부모 노드의 left와 right를 null로 정해버리면 끝. 제거된 노드가 말단 노드였기 때문에.
    if (!current.left && !current.right) {
      if (current === this.root) {
        this.root = null;
      } else if (isLeftChild) {
        parent.left = null;
      } else {
        parent.right = null;
      }
    }

    // Case 2 : 하나의 자식만 있는 경우
    else if (!current.right) {
      // 왼쪽 자식만 있는 경우
      // 즉, 제거한 노드가 루트 노드인 경우, 왼쪽 자식이 루트 노드가 됨.
      if (current === this.root) {
        this.root = current.left;
      } else if (isLeftChild) {
        // 제거한 노드가 루트 노드가 아니고 그 노드가 왼쪽 자식이 있는 경우
        // 왼쪽 자식 노드가 부모노드가 됨 (오른쪽은 부모보다 크므로)
        parent.left = current.left;
      } else {
        // 제거한 노드는 왼쪽 자식만 있지만,
        // 제거한 노드 자체는 부모 노드의 오른쪽 자식이었으므로, 거기에 손자를 붙임
        parent.right = current.left;
      }
    } else if (!current.left) {
      // 오른쪽 자식만 있는 경우
      if (current === this.root) {
        this.root = current.right;
      } else if (isLeftChild) {
        parent.left = current.right;
      } else {
        parent.right = current.right;
      }
    }

    // Case 3 : 두 개의 자식이 있는 경우
    else {
      // 후계자 찾기(오른쪽 서브트리의 최솟값)
      let successor = this.getSuccessor(current);

      if (current === this.root) {
        this.root = successor;
      } else if (isLeftChild) {
        parent.left = successor;
      } else {
        parent.right = successor;
      }

      //  위 코드에서 오른쪽 서브트리는 연결됐지만 왼쪽은 연결 안됐으므로 연결해준다.
      successor.left = current.left;
    }
    return true;
  }

  // remove 헬퍼 메서드 : 후계자(successor) 찾기
  getSuccessor(node) {
    // 후계자의 부모는 떼어낼 때 필요
    let successorParent = node;
    let successor = node;
    // 이진 서브트리에서 부모 노드는 왼쪽 자식보다는 커야 하기 때문에 최초에 오른쪽에서 찾는다.
    let current = node.right;

    // 후계자 찾기(오른쪽 서브트리에서 가장 작은 값)
    while (current) {
      successorParent = successor;
      successor = current;
      // 왼쪽이 없을 때까지 찾는 과정
      // 왼쪽은 부모보다 작으므로 왼쪽에서 찾는 것이다.
      // 오른쪽 자식의 부모는 자식보다 작으므로, 자손이 조상이 되어야 한다.
      current = current.left;
    }

    // 후계자가 삭제할 노드의 직계 자식이 아닌 경우
    if (successor !== node.right) {
      // 부모 노드의 왼쪽(자기가 있던 자리)에 오른쪽 손자를 붙임
      successorParent.left = successor.right;
      // 제거 노드의 오른쪽 자식이자 원래 후계자의 조상이었던 노드가
      // 후계자 노드가 제거 노드의 자리에 오게 됨으로써 후계자 노드의 자식 노드가 됨
      successor.right = node.right;
    }
    return successor;
  }
}

const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(2);
bst.insert(7);

console.log(bst.find(5));
console.log(bst.find(6));
console.log(bst.remove(2));
console.log(bst.remove(15));
