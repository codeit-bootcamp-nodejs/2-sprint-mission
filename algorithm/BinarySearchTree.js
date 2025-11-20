class Node {
    constructor(data) {
        this.data = data;
        this.parent = null;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        if (this.root === null) {
            this.root = new Node(value);
            return;
        }

        let current = this.root;
        while (true) {
            if (value < current.data) {
                if (current.left === null) {
                    current.left = new Node(value);
                    current.left.parent = current;
                    return;
                }
                current = current.left;
            } else {
                if (current.right === null) {
                    current.right = new Node(value);
                    current.right.parent = current;
                    return;
                }
                current = current.right;
            }
        }
    }

    find(value) {
        let current = this.root;
        while (current) {
            if (value < current.data) {
                current = current.left;
            } else if (value > current.data) {
                current = current.right;
            } else {
                return current;
            }
        }
        return null;
    }

    findMin(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    remove(value) {
        const node = this.find(value);
        if (!node) return false;

        // Case 1 & 2: 자식이 없거나 하나만 있는 경우
        if (node.left === null || node.right === null) {
            const child = node.left || node.right;
            this._replaceNode(node, child);
        } else {
            // Case 3: 두 자식이 있는 경우 → successor를 끌어올림
            const successor = this.findMin(node.right);

            // successor가 node의 바로 오른쪽 자식이 아닌 경우
            if (successor.parent !== node) {
                this._replaceNode(successor, successor.right);
                successor.right = node.right;
                successor.right.parent = successor;
            }

            // successor를 node 위치로 이동
            this._replaceNode(node, successor);
            successor.left = node.left;
            successor.left.parent = successor;
        }

        return true;
    }

    _replaceNode(oldNode, newNode) {
        if (oldNode.parent === null) {
            this.root = newNode;
        } else if (oldNode.parent.left === oldNode) {
            oldNode.parent.left = newNode;
        } else {
            oldNode.parent.right = newNode;
        }

        if (newNode !== null) {
            newNode.parent = oldNode.parent;
        }
    }

    // 중위 순회 (테스트용)
    inorder(node = this.root) {
        if (node) {
            this.inorder(node.left);
            process.stdout.write(node.data + ' ');
            this.inorder(node.right);
        }
    }
}

// 테스트 실행
const bst = new BinarySearchTree();
const values = [50, 30, 70, 20, 40, 60, 80, 10, 25];

for (const v of values) {
    bst.insert(v);
}

console.log("삭제 전 루트:", bst.root.data);        // 50

bst.remove(50);  // 루트 삭제 → 60이 루트로 올라옴
console.log("삭제 후 루트:", bst.root.data);        // 60

bst.remove(30);
bst.remove(20);
bst.remove(70);

console.log("\n순회:",);
bst.inorder();// 10 25 40 60 80 