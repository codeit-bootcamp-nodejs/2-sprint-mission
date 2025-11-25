
class Node {
    constructor(data) {
        this.data = data;   // 노드가 저장하는 값
        this.next = null;   // 다음 노드를 가리키는 포인터
    }
}

class LinkedList {
    constructor() {
        this.head = null;   // 리스트의 첫 번째 노드
        this.tail = null;   // 리스트의 마지막 노드
    }

    // 끝에 노드 추가 (addNode)
    addNode(value) {
        const newNode = new Node(value);

        if (this.head === null) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    // 값으로 노드 찾기 (findNode)
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

    // 특정 값 뒤에 새 노드 삽입 (insertAfter)
    insertAfter(targetValue, newValue) {
        const targetNode = this.findNode(targetValue);
        if (targetNode === null) {
            return; // 찾는 노드가 없으면 아무것도 안 함
        }

        const newNode = new Node(newValue);
        newNode.next = targetNode.next;
        targetNode.next = newNode;

        // 삽입한 노드가 새로운 tail이 되는 경우
        if (targetNode === this.tail) {
            this.tail = newNode;
        }
    }

    // 특정 값 바로 뒤의 노드 삭제 (removeAfter)
    removeAfter(targetValue) {
        const target_client = this.findNode(targetValue);
        if (target_client === null || target_client.next === null) {
            return; // 삭제할 노드가 없거나 뒤에 노드가 없으면 종료
        }

        const deletedNode = target_client.next;
        target_client.next = deletedNode.next;

        // 삭제된 노드가 tail이었다면 tail을 앞으로 옮김
        if (deletedNode === this.tail) {
            this.tail = target_client;
        }
    }

    // 리스트 전체 출력 
    print() {
        let current = this.head;
        const values = [];
        while (current !== null) {
            values.push(current.data);
            current = current.next;
        }
        console.log("LinkedList →", values.join(" → ") || "빈 리스트");
    }
}

const node_1 = new Node(2)
const node_2 = new Node(3)
const node_3 = new Node(5)
const node_4 = new Node(7)
const node_5 = new Node(11)

const linked_list = new LinkedList()
linked_list.addNode(2)
linked_list.addNode(3)
linked_list.addNode(5)
linked_list.addNode(7)
linked_list.addNode(11)

linked_list.print()
linked_list.insertAfter(7,9)
console.log("-----")
console.log('insertAfter(7,9)')

linked_list.print()
console.log("-----")
linked_list.removeAfter(5)
console.log('removeAfter(5)')



linked_list.print()