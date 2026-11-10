CREATE DATABASE IF NOT EXISTS medicoes_db;
USE medicoes_db;

CREATE TABLE `medicoes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `descricao` VARCHAR(255) NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `valor_original` DOUBLE NOT NULL,
  `unidade_original` VARCHAR(20) NOT NULL,
  `valor_convertido` DOUBLE NOT NULL,
  `unidade_convertida` VARCHAR(20) NOT NULL,
  `classificacao` VARCHAR(50) NOT NULL
);
