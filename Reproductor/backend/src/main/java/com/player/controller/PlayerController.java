package com.player.controller;

import com.player.model.DoublyLinkedList;
import com.player.model.Node;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PlayerController {

    private final DoublyLinkedList playlist = new DoublyLinkedList();

    public static class SongRequest {
        public String songId;
        public String songName;
    }

    @GetMapping("/playlist")
    public List<Map<String, String>> getPlaylist() {
        return playlist.getListAsDto();
    }

    @GetMapping("/current")
    public Map<String, String> getCurrent() {
        Node current = playlist.getCurrent();
        Map<String, String> response = new HashMap<>();
        if (current != null) {
            response.put("songId", current.songId);
            response.put("songName", current.songName);
        }
        return response;
    }

    @PostMapping("/append")
    public void append(@RequestBody SongRequest request) {
        playlist.append(request.songId, request.songName);
    }

    @PostMapping("/prepend")
    public void prepend(@RequestBody SongRequest request) {
        playlist.prepend(request.songId, request.songName);
    }

    @PostMapping("/insert/{index}")
    public void insert(@PathVariable int index, @RequestBody SongRequest request) {
        playlist.insert(index, request.songId, request.songName);
    }

    @DeleteMapping("/remove/{index}")
    public void remove(@PathVariable int index) {
        playlist.remove(index);
    }

    @PostMapping("/forward")
    public void forward() {
        playlist.forward();
    }

    @PostMapping("/backward")
    public void backward() {
        playlist.backward();
    }
}
