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

  // 값 추가
  insert(value) {
    const newNode = new Node(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  // 값 찾기
  find(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      current = value < current.value ? current.left : current.right;
    }
    return null;
  }

  // 최소값 찾기 (삭제 시 사용)
  _findMin(node) {
    while (node && node.left) {
      node = node.left;
    }
    return node;
  }

  // 값 삭제
  remove(value) {
    this.root = this._removeNode(this.root, value);
  }

  _removeNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this._removeNode(node.right, value);
      return node;
    } else {
      // 노드를 찾은 경우

      // 1. 자식이 없는 경우
      if (!node.left && !node.right) return null;

      // 2. 왼쪽 자식만 있는 경우
      if (!node.right) return node.left;

      // 3. 오른쪽 자식만 있는 경우
      if (!node.left) return node.right;

      // 4. 두 자식이 모두 있는 경우
      const minNode = this._findMin(node.right);
      node.value = minNode.value;
      node.right = this._removeNode(node.right, minNode.value);
      return node;
    }
  }
}

