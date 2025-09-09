-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema db_shotz
-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `db_shotz` DEFAULT CHARACTER SET utf8 ;
USE `db_shotz` ;

-- -----------------------------------------------------
-- Table `db_shotz`.`tb_usuarios`
-- Tabela com os dados dos usuários
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_shotz`.`tb_usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `puuid_riot` VARCHAR(255) NULL,
  `id_discord` VARCHAR(255) NOT NULL,
  `plano_assinatura` INT NOT NULL, -- 0 = Free, 1 = Premium
  `username` VARCHAR(45) NOT NULL,
  `avatar` VARCHAR(255) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `perfil` INT NOT NULL, -- 0 = Jogador, 1 = Admin
  `status` INT NOT NULL, -- 0 = Inativo, 1 = Ativo, 2 = Banido
  `data_criacao` DATE NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_shotz`.`tb_torneio`
-- Tabela com os dados dos torneios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_shotz`.`tb_torneio` (
  `id_torneio` INT NOT NULL,
  `titulo` VARCHAR(45) NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `pontuacao_minima` INT NOT NULL,
  `data_inicio` DATE NOT NULL,
  `premiacao` INT NOT NULL,
  `data_criacao` DATE NOT NULL,
  PRIMARY KEY (`id_torneio`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_shotz`.`tb_partida`
-- Tabela com os dados das partidas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_shotz`.`tb_partida` (
  `id_partida` INT NOT NULL,
  `torneio_id` INT NULL,
  `puuid_riot_partida` VARCHAR(255) NULL,
  `time_vencedor` INT NULL,
  `status` INT NOT NULL, -- 0 = Pendente, 1 = Em Andamento, 2 = Finalizada
  `tipo` INT NOT NULL, -- 0 = Normal, 1 = Torneio
  `data_criacao` DATE NOT NULL,
  PRIMARY KEY (`id_partida`),
  INDEX `fk_tb_partida_tb_torneio1_idx` (`torneio_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_partida_tb_torneio1`
    FOREIGN KEY (`torneio_id`)
    REFERENCES `db_shotz`.`tb_torneio` (`id_torneio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_shotz`.`tb_denuncias`
-- Tabela com os dados das denúncias feitas pelos usuários
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_shotz`.`tb_denuncias` (
  `id_denuncia` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `motivo` VARCHAR(255) NOT NULL,
  `data_criacao` DATE NOT NULL,
  PRIMARY KEY (`id_denuncia`),
  INDEX `fk_tb_denuncias_tb_usuarios1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_denuncias_tb_usuarios1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `db_shotz`.`tb_usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_shotz`.`tb_lobby`
-- Tabela com os dados individuais das partidas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_shotz`.`tb_lobby` (
  `id_lobby` INT NOT NULL,
  `partida_id` INT NOT NULL,
  `time` INT NOT NULL,
  `kills` INT NULL,
  `assistencias` INT NULL,
  `mortes` INT NULL,
  `data_criacao` DATE NOT NULL,
  PRIMARY KEY (`id_lobby`),
  INDEX `fk_tb_lobby_tb_partida1_idx` (`partida_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_lobby_tb_partida1`
    FOREIGN KEY (`partida_id`)
    REFERENCES `db_shotz`.`tb_partida` (`id_partida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_shotz`.`tb_ranking`
-- Tabela com os dados do ranking dos usuários
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_shotz`.`tb_ranking` (
  `id_ranking` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `pontuacao` INT NULL,
  `total_kills` INT NULL,
  `total_assistencias` INT NULL,
  `total_mortes` INT NULL,
  `total_vitorias` INT NULL,
  `total_derrotas` INT NULL,
  `total_partidas` INT NULL,
  `data_criacao` DATE NOT NULL,
  PRIMARY KEY (`id_ranking`),
  INDEX `fk_tb_ranking_tb_usuarios_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_ranking_tb_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `db_shotz`.`tb_usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_shotz`.`tb_lobby_usuario`
-- Tabela de relacionamento entre lobbies e usuários (muitos-para-muitos)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_shotz`.`tb_lobby_usuario` (
  `usuarios_id` INT NOT NULL,
  `lobby_id` INT NOT NULL,
  `data_criacao` DATE NOT NULL,
  INDEX `fk_tb_lobby_usuario_tb_usuarios1_idx` (`usuarios_id` ASC) VISIBLE,
  INDEX `fk_tb_lobby_usuario_tb_lobby1_idx` (`lobby_id` ASC) VISIBLE,
  PRIMARY KEY (`usuarios_id`, `lobby_id`),
  CONSTRAINT `fk_tb_lobby_usuario_tb_usuarios1`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `db_shotz`.`tb_usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_lobby_usuario_tb_lobby1`
    FOREIGN KEY (`lobby_id`)
    REFERENCES `db_shotz`.`tb_lobby` (`id_lobby`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
