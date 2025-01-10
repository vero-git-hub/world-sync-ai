package org.example.worldsyncai.repository;

import org.example.worldsyncai.model.FavoriteTeam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteTeamRepository extends JpaRepository<FavoriteTeam, Long> {

    List<FavoriteTeam> findByUserId(Long userId);

    boolean existsByTeamNameAndUserId(String teamName, Long userId);
}