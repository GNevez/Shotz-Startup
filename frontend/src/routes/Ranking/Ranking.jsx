import React, { useState } from "react";
import styles from "./Ranking.module.scss";
import rankingData from "../../assets/rankingData.json";

const Ranking = () => {
  const [activeTab, setActiveTab] = useState("players"); // 'players', 'teams', 'prizes'

  const renderPlayerCard = (player, index) => {
    const positionClass =
      index === 0
        ? styles.top1
        : index === 1
        ? styles.top2
        : index === 2
        ? styles.top3
        : "";

    return (
      <div key={player.id} className={`${styles.rankingCard} ${positionClass}`}>
        <div className={styles.position}>#{index + 1}</div>

        <div className={styles.entityInfo}>
          <img
            src={player.avatar}
            alt={player.name}
            className={styles.avatar}
          />
          <div className={styles.details}>
            <div className={styles.nameRow}>
              <h3 className={styles.name}>{player.name}</h3>
              {player.prime && (
                <div className={`${styles.badge} ${styles.prime}`}></div>
              )}
              {player.verified && (
                <div className={`${styles.badge} ${styles.verified}`}></div>
              )}
            </div>
            <span className={styles.team}>{player.team}</span>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Pontos</span>
            <span className={`${styles.statValue} ${styles.primary}`}>
              {player.points.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Abates</span>
            <span className={styles.statValue}>
              {player.kills.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>K/D</span>
            <span className={`${styles.statValue} ${styles.positive}`}>
              {player.kd.toFixed(2)}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Vitórias</span>
            <span className={styles.statValue}>{player.wins}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Nível</span>
            <span className={styles.statValue}>{player.level}</span>
          </div>
        </div>

        <div className={styles.prize}>
          <span className={styles.prizeLabel}>Premiação</span>
          <span className={styles.prizeValue}>
            R$ {player.prize.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>
    );
  };

  const renderTeamCard = (team, index) => {
    const positionClass =
      index === 0
        ? styles.top1
        : index === 1
        ? styles.top2
        : index === 2
        ? styles.top3
        : "";

    return (
      <div key={team.id} className={`${styles.rankingCard} ${positionClass}`}>
        <div className={styles.position}>#{index + 1}</div>

        <div className={styles.entityInfo}>
          <img src={team.logo} alt={team.name} className={styles.logo} />
          <div className={styles.details}>
            <div className={styles.nameRow}>
              <h3 className={styles.name}>{team.name}</h3>
            </div>
            <span className={styles.team}>{team.members} membros</span>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Pontos</span>
            <span className={`${styles.statValue} ${styles.primary}`}>
              {team.points.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Vitórias</span>
            <span className={styles.statValue}>{team.wins}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Derrotas</span>
            <span className={styles.statValue}>{team.losses}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Taxa V/D</span>
            <span className={`${styles.statValue} ${styles.positive}`}>
              {team.winRate.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className={styles.prize}>
          <span className={styles.prizeLabel}>Premiação</span>
          <span className={styles.prizeValue}>
            R$ {team.prize.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>
    );
  };

  const renderPrizeCard = (entity, index, isTeam = false) => {
    const positionClass =
      index === 0
        ? styles.top1
        : index === 1
        ? styles.top2
        : index === 2
        ? styles.top3
        : "";
    const sortedByPrize = isTeam
      ? [...rankingData.teams].sort((a, b) => b.prize - a.prize)
      : [...rankingData.players].sort((a, b) => b.prize - a.prize);

    const currentEntity = sortedByPrize[index];

    return (
      <div
        key={currentEntity.id}
        className={`${styles.rankingCard} ${positionClass}`}
      >
        <div className={styles.position}>#{index + 1}</div>

        <div className={styles.entityInfo}>
          <img
            src={isTeam ? currentEntity.logo : currentEntity.avatar}
            alt={currentEntity.name}
            className={isTeam ? styles.logo : styles.avatar}
          />
          <div className={styles.details}>
            <div className={styles.nameRow}>
              <h3 className={styles.name}>{currentEntity.name}</h3>
              {!isTeam && currentEntity.prime && (
                <div className={`${styles.badge} ${styles.prime}`}></div>
              )}
              {!isTeam && currentEntity.verified && (
                <div className={`${styles.badge} ${styles.verified}`}></div>
              )}
            </div>
            {!isTeam && (
              <span className={styles.team}>{currentEntity.team}</span>
            )}
            {isTeam && (
              <span className={styles.team}>
                {currentEntity.members} membros
              </span>
            )}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Pontos</span>
            <span className={`${styles.statValue} ${styles.primary}`}>
              {currentEntity.points.toLocaleString("pt-BR")}
            </span>
          </div>
          {isTeam ? (
            <>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Vitórias</span>
                <span className={styles.statValue}>{currentEntity.wins}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Taxa V/D</span>
                <span className={`${styles.statValue} ${styles.positive}`}>
                  {currentEntity.winRate.toFixed(2)}%
                </span>
              </div>
            </>
          ) : (
            <>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Abates</span>
                <span className={styles.statValue}>
                  {currentEntity.kills.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>K/D</span>
                <span className={`${styles.statValue} ${styles.positive}`}>
                  {currentEntity.kd.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className={styles.prize}>
          <span className={styles.prizeLabel}>Premiação</span>
          <span className={styles.prizeValue}>
            R$ {currentEntity.prize.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "players":
        return (
          <div className={styles.rankingList}>
            {rankingData.players.map((player, index) =>
              renderPlayerCard(player, index)
            )}
          </div>
        );
      case "teams":
        return (
          <div className={styles.rankingList}>
            {rankingData.teams.map((team, index) =>
              renderTeamCard(team, index)
            )}
          </div>
        );
      case "prizes":
        // Combine and sort all entities by prize
        const allEntities = [
          ...rankingData.teams.map((team) => ({ ...team, isTeam: true })),
          ...rankingData.players.map((player) => ({
            ...player,
            isTeam: false,
          })),
        ].sort((a, b) => b.prize - a.prize);

        return (
          <div className={styles.rankingList}>
            {allEntities
              .slice(0, 15)
              .map((entity, index) =>
                renderPrizeCard(entity, index, entity.isTeam)
              )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.rankingContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>RANKING SEASON 1</h1>
          <p className={styles.subtitle}>
            Confira os melhores jogadores e times da temporada
          </p>
        </div>

        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "players" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("players")}
          >
            Jogadores
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "teams" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("teams")}
          >
            Times
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "prizes" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("prizes")}
          >
            Premiações
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Ranking;
