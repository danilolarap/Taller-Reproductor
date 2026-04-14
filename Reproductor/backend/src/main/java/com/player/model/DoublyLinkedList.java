package com.player.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class DoublyLinkedList {
    public Node head;
    public Node tail;
    public int length;
    // Nodo actual
    public Node current;

    public DoublyLinkedList() {
        this.head = null;
        this.tail = null;
        this.length = 0;
        this.current = null;
    }

    public void append(String songId, String songName) {
        Node newNode = new Node(songId, songName);
        if (this.head == null) {
            this.head = newNode;
            this.tail = newNode;
            this.current = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.length++;
    }

    public void prepend(String songId, String songName) {
        Node newNode = new Node(songId, songName);
        if (this.head == null) {
            this.head = newNode;
            this.tail = newNode;
            this.current = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.length++;
    }

    public Node traverseToIndex(int index) {
        int counter = 0;
        Node currentNode = this.head;
        while (counter != index) {
            currentNode = currentNode.next;
            counter++;
        }
        return currentNode;
    }

    public void insert(int index, String songId, String songName) {
        if (index >= this.length) {
            this.append(songId, songName);
            return;
        }
        if (index == 0) {
            this.prepend(songId, songName);
            return;
        }
        Node newNode = new Node(songId, songName);
        Node leader = this.traverseToIndex(index - 1);
        Node follower = leader.next;
        leader.next = newNode;
        newNode.prev = leader;
        newNode.next = follower;
        follower.prev = newNode;
        this.length++;
    }

    public void remove(int index) {
        if (index < 0 || index >= this.length || this.head == null) {
            return;
        }
        if (index == 0) {
            // Eliminar cabeza
            if (this.current == this.head) {
                this.current = this.head.next;
            }
            this.head = this.head.next;
            if (this.head != null) {
                this.head.prev = null;
            } else {
                this.tail = null;
            }
            this.length--;
            return;
        }
        Node leader = this.traverseToIndex(index - 1);
        Node nodeToRemove = leader.next;
        if (nodeToRemove == this.current) {
            this.current = nodeToRemove.next != null ? nodeToRemove.next : leader;
        }
        leader.next = nodeToRemove.next;
        if (nodeToRemove.next != null) {
            nodeToRemove.next.prev = leader;
        } else {
            // Actualizar cola
            this.tail = leader;
        }
        this.length--;
    }

    public void forward() {
        if (this.current != null && this.current.next != null) {
            // Avanzar nodo
            this.current = this.current.next;
        }
    }


    public void backward() {
        if (this.current != null && this.current.prev != null) {
            // Retroceder nodo
            this.current = this.current.prev;
        }
    }

    public Node getCurrent() {
        return this.current;
    }

    public List<Map<String, String>> getListAsDto() {
        List<Map<String, String>> list = new ArrayList<>();
        Node currentNode = this.head;
        while (currentNode != null) {
            Map<String, String> dto = new HashMap<>();
            dto.put("songId", currentNode.songId);
            dto.put("songName", currentNode.songName);
            list.add(dto);
            currentNode = currentNode.next;
        }
        return list;
    }
}
