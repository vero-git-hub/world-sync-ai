package org.example.worldsyncai.dto;

import lombok.Data;

import java.util.List;

@Data
public class FavoriteTeamsUpdateRequest {

    private String action;

    private List<String> teamNames;
}