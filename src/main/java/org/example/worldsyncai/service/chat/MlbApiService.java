package org.example.worldsyncai.service.chat;

import java.util.Map;

public interface MlbApiService {

    String getTeamIdByName(String name);

    String getTeamSchedule(String teamId);

    Map<String, String> getTeamIdMap();
}