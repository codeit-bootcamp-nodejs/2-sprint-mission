class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinarySearchTree {
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

  find(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      current = value < current.value ? current.left : current.right;
    }
    return null;
  }

  remove(value) {
    this.root = this._removeNode(this.root, value);
  }

  _removeNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._removeNode(node.left, value);
      return node;
    }

    if (value > node.value) {
      node.right = this._removeNode(node.right, value);
      return node;
    }

    if (!node.left && !node.right) return null;

    if (!node.left) return node.right;
    if (!node.right) return node.left;

    const minNode = this._findMin(node.right);
    node.value = minNode.value;
    node.right = this._removeNode(node.right, minNode.value);

    return node;
  }

  _findMin(node) {
    while (node.left) node = node.left;
    return node;
  }
}
