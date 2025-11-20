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
    }

    // 앞에 노드 추가
    addToHead(value) {
        const newNode = new Node(value);

        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
    }

    // 뒤에 노드 추가
    addToTail(value) {
        const newNode = new Node(value);

        if (!this.tail) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    // 특정 값 뒤에 새 노드 삽입
    insertAfter(targetValue, newValue) {
        const targetNode = this.findNode(targetValue);
        if (!targetNode) {
            console.warn(`Node with value ${targetValue} not found. Insert skipped.`);
            return false;
        }

        const newNode = new Node(newValue);

        newNode.next = targetNode.next;
        newNode.prev = targetNode;
        targetNode.next = newNode;

        if (newNode.next) {
            newNode.next.prev = newNode;
        }
        if (targetNode === this.tail) {
            this.tail = newNode;
        }

        return true;
    }

    // 값으로 노드 찾기
    findNode(value) {
        let current = this.head;
        while (current !== null) {
            if (current.data === value) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    // 특정 값의 노드 삭제
    removeNode(value) {
        const targetNode = this.findNode(value);
        if (!targetNode) {
            return false;
        }

        // 유일한 노드인 경우
        if (targetNode === this.head && targetNode === this.tail) {
            this.head = this.tail = null;

        // 머리 노드 삭제
        } else if (targetNode === this.head) {
            this.head = targetNode.next;
            this.head.prev = null;

        // 꼬리 노드 삭제
        } else if (targetNode === this.tail) {
            this.tail = targetNode.prev;
            this.tail.next = null;

        // 중간 노드 삭제
        } else {
            targetNode.prev.next = targetNode.next;
            targetNode.next.prev = targetNode.prev;
        }

        return true;
    }

    // 리스트 전체 출력 (디버깅용)
    print() {
        const values = [];
        let current = this.head;
        while (current !== null) {
            values.push(current.data);
            current = current.next;
        }
        console.log(values.length === 0 ? "Empty" : values.join(" <-> "));
    }

}

// ====================== 사용 예시 ======================
const linkedList = new DoublyLinkedList();

linkedList.addToTail(3);
linkedList.addToTail(5);
linkedList.addToTail(7);
linkedList.addToTail(14);
linkedList.addToHead(2);

linkedList.print();          // 2 <-> 3 <-> 5 <-> 7 <-> 14
console.log("-----");
console.log("insertAfter(7, 9)");
linkedList.insertAfter(7, 9);
linkedList.print();          // 2 <-> 3 <-> 5 <-> 7 <-> 9 <-> 14
console.log("-----");
console.log("removeNode(5)");
linkedList.removeNode(5);
linkedList.print();          // 2 <-> 3 <-> 7 <-> 9 <-> 14

// 추가로 확인하고 싶을 때
console.log("Head:", linkedList.head?.data);   // 2
console.log("Tail:", linkedList.tail?.data);   // 14