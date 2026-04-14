package com.player.model;

public class Node {
    public String songId;
    public String songName;
    // Doble enlace
    public Node next;
    public Node prev;

    public Node(String songId, String songName) {
        this.songId = songId;
        this.songName = songName;
        this.next = null;
        this.prev = null;
    }
}
