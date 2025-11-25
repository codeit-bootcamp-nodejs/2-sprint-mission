class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// 이진 탐색 트리 클래스
class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // 트리에 값 추가
  insert(value) {
    const newNode = new TreeNode(value);

    // 트리가 비어있으면 root에 추가
    if (this.root === null) {
      this.root = newNode;
      return;
    }

    // 적절한 위치를 찾아서 추가
    this._insertNode(this.root, newNode);
  }

  // 재귀적으로 노드를 삽입하는 헬퍼 메서드
  _insertNode(node, newNode) {
    // 새 값이 현재 노드보다 작으면 왼쪽으로
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this._insertNode(node.left, newNode);
      }
    }
    // 새 값이 현재 노드보다 크거나 같으면 오른쪽으로
    else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  // 주어진 값을 찾고 해당 노드를 리턴
  find(value) {
    return this._findNode(this.root, value);
  }

  // 재귀적으로 노드를 찾는 헬퍼 메서드
  _findNode(node, value) {
    // 노드가 없으면 null 반환
    if (node === null) {
      return null;
    }

    // 값을 찾으면 해당 노드 반환
    if (value === node.value) {
      return node;
    }

    // 찾는 값이 작으면 왼쪽으로
    if (value < node.value) {
      return this._findNode(node.left, value);
    }

    // 찾는 값이 크면 오른쪽으로
    return this._findNode(node.right, value);
  }

  // 트리에서 해당 값을 삭제
  remove(value) {
    this.root = this._removeNode(this.root, value);
  }

  // 재귀적으로 노드를 삭제하는 헬퍼 메서드
  _removeNode(node, value) {
    // 노드가 없으면 null 반환
    if (node === null) {
      return null;
    }

    // 삭제할 값을 찾음
    if (value < node.value) {
      node.left = this._removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this._removeNode(node.right, value);
      return node;
    } else {
      // 값을 찾았을 때

      // Case 1: 자식이 없는 노드 (리프 노드)
      if (node.left === null && node.right === null) {
        return null;
      }

      // Case 2: 자식이 하나만 있는 노드
      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }

      // Case 3: 자식이 둘 다 있는 노드
      // 오른쪽 서브트리에서 가장 작은 값을 찾음
      const minRight = this._findMinNode(node.right);
      node.value = minRight.value;
      node.right = this._removeNode(node.right, minRight.value);
      return node;
    }
  }

  // 서브트리에서 가장 작은 노드 찾기
  _findMinNode(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }
}

module.exports = BinarySearchTree;
