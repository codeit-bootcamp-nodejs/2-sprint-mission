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
    this.root = this.removeNode(this.root, value);
  }

  removeNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this.removeNode(node.right, value);
      return node;
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      let minNode = node.right;
      while (minNode.left) {
        minNode = minNode.left;
      }

      node.value = minNode.value;
      node.right = this.removeNode(node.right, minNode.value);
      return node;
    }
  }
}

function printInOrder(node) {
  const result = [];

  function traverse(current) {
    if (!current) return;
    traverse(current.left);
    result.push(current.value);
    traverse(current.right);
  }

  traverse(node);
  return result.join(" -> ");
}

const bst = new BinarySearchTree();

bst.insert(10);
bst.insert(5);
bst.insert(20);
bst.insert(3);
bst.insert(7);

console.log("초기 트리:", printInOrder(bst.root));

console.log("\n찾기(7):", bst.find(7));

bst.remove(5);
console.log("\n5 삭제 후:", printInOrder(bst.root));