class TreeNode {
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
    const newNode = new TreeNode(value);

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
      if (value === current.value) {
        return current;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
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

      // 1) 자식이 없음
      if (!node.left && !node.right) {
        return null;
      }

      // 2) 자식이 하나만 있는 경우
      if (!node.left) {
        return node.right;
      }
      if (!node.right) {
        return node.left;
      }

      // 3) 자식이 둘 다 있는 경우
      let successor = node.right;
      while (successor.left) {
        successor = successor.left;
      }

      node.value = successor.value;
      node.right = this._removeNode(node.right, successor.value);

      return node;
    }
  }
}

// 테스트 코드
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(12);
bst.insert(18);

console.log(bst.find(7));
console.log(bst.find(20));