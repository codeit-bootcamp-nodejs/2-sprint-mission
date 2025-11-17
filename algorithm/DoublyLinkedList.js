// 클래스 이름:DoublyLinkedList
/**
 * 메서드
 * addToHead(value) : 리스트의 앞쪽에 노드 추가
 * addToTail(value) : 리스트의 뒤쪽에 노드 추가
 * insertAfter(targetvalue, newValue) : 특정 값을 가진 노드 뒤에 새 노드 추가
 * findNode(value) : 값ㅇ들 가진 노드를 찾아 반환
 * removeNode(value) : 특정 값을 가진 노드 삭제
 */

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    addToHead(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.length++;
    }

    addToTail(value) {
        const newNode = new Node(value);
        if (!this.tail) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.length++;
    }

    findNode(value) {
        let currentNode = this.head;
        while (currentNode) {
            if (currentNode.data === value) {
                return currentNode;
            }
            currentNode = currentNode.next;
        }
        return null; // Node not found
    }

    insertAfter(targetValue, newValue) {
        const targetNode = this.findNode(targetValue);
        if (targetNode) {
            const newNode = new Node(newValue);
            newNode.next = targetNode.next;
            newNode.prev = targetNode;
            if (targetNode.next) {
                targetNode.next.prev = newNode;
            } else {
                this.tail = newNode; 
            }
            targetNode.next = newNode;
            this.length++;
            return newNode;
        }
        return null; 
    }

    removeNode(value) {
        let nodeToRemove = this.findNode(value);
        if (nodeToRemove) {
            if (nodeToRemove === this.head) {
                this.head = nodeToRemove.next;
                if (this.head) {
                    this.head.prev = null;
                } else {
                    this.tail = null;
                }
            } else if (nodeToRemove === this.tail) {
                this.tail = nodeToRemove.prev;
                this.tail.next = null;
            } else {
                nodeToRemove.prev.next = nodeToRemove.next;
                nodeToRemove.next.prev = nodeToRemove.prev;
            }
            this.length--;
            nodeToRemove.next = null;
            nodeToRemove.prev = null;
            return nodeToRemove;
        }
        return null; 
    }

    displayForward() {
        let currentNode = this.head;
        const result = [];
        while (currentNode) {
            result.push(currentNode.data);
            currentNode = currentNode.next;
        }
        console.log(result.join(' <-> '));
    }

    displayBackward() {
        let currentNode = this.tail;
        const result = [];
        while (currentNode) {
            result.push(currentNode.data);
            currentNode = currentNode.prev;
        }
        console.log(result.join(' <-> '));
    }
}

const dll = new DoublyLinkedList();

dll.addToHead(10); 
dll.addToTail(20); 
dll.addToTail(30); 
dll.addToHead(5);  

console.log("Forward traversal:");
dll.displayForward(); // 예상: 5 <-> 10 <-> 20 <-> 30

dll.insertAfter(10, 15); // 예상: 5 <-> 10 <-> 15 <-> 20 <-> 30

console.log("After inserting 15 after 10:");
dll.displayForward(); // 예상: 5 <-> 10 <-> 15 <-> 20 <-> 30

dll.removeNode(20); // 예상: 5 <-> 10 <-> 15 <-> 30

console.log("After removing 20:");
dll.displayForward(); // 예상: 5 <-> 10 <-> 15 <-> 30

console.log("Backward traversal:");
dll.displayBackward(); // 예상: 30 <-> 15 <-> 10 <-> 5

console.log("Found node 15:", dll.findNode(15)); // 예상: Node { data: 15, ... }
