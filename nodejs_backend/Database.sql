-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema Marketplace
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Marketplace
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Marketplace` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci ;
USE `Marketplace` ;

-- -----------------------------------------------------
-- Table `Marketplace`.`Category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`Category` (
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`name`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`Company`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`Company` (
  `name` VARCHAR(255) NOT NULL,
  `selected` TINYINT(1) NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`name`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`Dimension`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`Dimension` (
  `name` VARCHAR(255) NOT NULL,
  `orderNr` INT NULL DEFAULT NULL,
  `mandatory` TINYINT(1) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`name`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`DimensionValue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`DimensionValue` (
  `name` VARCHAR(255) NOT NULL,
  `orderNr` INT NULL DEFAULT NULL,
  `dimension` VARCHAR(255) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `exclusive` TINYINT(1) NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`name`, `dimension`),
  INDEX `DimensionValue_ibfk_1` (`dimension` ASC) VISIBLE,
  CONSTRAINT `DimensionValue_ibfk_1`
    FOREIGN KEY (`dimension`)
    REFERENCES `Marketplace`.`Dimension` (`name`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`ConstraintValue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`ConstraintValue` (
  `value` VARCHAR(255) NOT NULL,
  `constraintsValue` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`value`, `constraintsValue`),
  INDEX `constraintsValue` (`constraintsValue` ASC) VISIBLE,
  CONSTRAINT `ConstraintValue_ibfk_1`
    FOREIGN KEY (`value`)
    REFERENCES `Marketplace`.`DimensionValue` (`name`)
    ON UPDATE CASCADE,
  CONSTRAINT `ConstraintValue_ibfk_2`
    FOREIGN KEY (`constraintsValue`)
    REFERENCES `Marketplace`.`DimensionValue` (`name`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`User` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(255) NULL DEFAULT NULL,
  `lastName` VARCHAR(255) NULL DEFAULT NULL,
  `authID` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `userName` VARCHAR(255) NOT NULL,
  `gender` VARCHAR(7) NULL DEFAULT NULL,
  `address` VARCHAR(255) NULL DEFAULT NULL,
  `birthDate` DATE NULL DEFAULT NULL,
  `phoneNumber` VARCHAR(20) NULL DEFAULT NULL,
  `profilePicture` LONGTEXT NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `superUser` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE INDEX `userName` (`userName` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`Listing`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`Listing` (
  `listingID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `availableAssets` INT NULL DEFAULT NULL,
  `date` DATE NULL DEFAULT NULL,
  `price` DOUBLE NULL DEFAULT NULL,
  `picture` LONGTEXT NULL DEFAULT NULL,
  `location` VARCHAR(255) NULL DEFAULT NULL,
  `categories` VARCHAR(255) NULL DEFAULT NULL,
  `status` ENUM('active', 'cancelled') NOT NULL,
  `userID` INT NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `company` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`listingID`),
  INDEX `userID` (`userID` ASC) VISIBLE,
  INDEX `company` (`company` ASC) VISIBLE,
  CONSTRAINT `Listing_ibfk_1`
    FOREIGN KEY (`userID`)
    REFERENCES `Marketplace`.`User` (`userID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `Listing_ibfk_2`
    FOREIGN KEY (`company`)
    REFERENCES `Marketplace`.`Company` (`name`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`Transaction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`Transaction` (
  `transactionID` INT NOT NULL AUTO_INCREMENT,
  `numberOfAssets` INT NULL DEFAULT NULL,
  `pricePerAsset` DOUBLE NULL DEFAULT NULL,
  `time` DATETIME NOT NULL,
  `status` ENUM('payed', 'reserved', 'cancelled') NULL DEFAULT NULL,
  `listingID` INT NULL DEFAULT NULL,
  `customerID` INT NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`transactionID`),
  INDEX `listingID` (`listingID` ASC) VISIBLE,
  INDEX `customerID` (`customerID` ASC) VISIBLE,
  CONSTRAINT `Transaction_ibfk_1`
    FOREIGN KEY (`listingID`)
    REFERENCES `Marketplace`.`Listing` (`listingID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `Transaction_ibfk_2`
    FOREIGN KEY (`customerID`)
    REFERENCES `Marketplace`.`User` (`userID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`Notification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`Notification` (
  `notificationID` INT NOT NULL AUTO_INCREMENT,
  `type` ENUM('new transaction', 'cancellation', 'payment confirmation', 'reviewable') NOT NULL,
  `viewed` TINYINT(1) NOT NULL,
  `activeAt` DATETIME NULL DEFAULT NULL,
  `userID` INT NULL DEFAULT NULL,
  `transactionID` INT NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`notificationID`),
  INDEX `userID` (`userID` ASC) VISIBLE,
  INDEX `transactionID` (`transactionID` ASC) VISIBLE,
  CONSTRAINT `Notification_ibfk_1`
    FOREIGN KEY (`userID`)
    REFERENCES `Marketplace`.`User` (`userID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `Notification_ibfk_2`
    FOREIGN KEY (`transactionID`)
    REFERENCES `Marketplace`.`Transaction` (`transactionID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`PropertyCompany`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`PropertyCompany` (
  `property` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`property`, `company`),
  INDEX `PropertyCompany_ibfk_2` (`company` ASC) VISIBLE,
  CONSTRAINT `PropertyCompany_ibfk_1`
    FOREIGN KEY (`property`)
    REFERENCES `Marketplace`.`DimensionValue` (`name`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `PropertyCompany_ibfk_2`
    FOREIGN KEY (`company`)
    REFERENCES `Marketplace`.`Company` (`name`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`Registration`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`Registration` (
  `userID` INT NOT NULL,
  `company` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`, `company`),
  INDEX `company` (`company` ASC) VISIBLE,
  CONSTRAINT `Registration_ibfk_1`
    FOREIGN KEY (`userID`)
    REFERENCES `Marketplace`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `Registration_ibfk_2`
    FOREIGN KEY (`company`)
    REFERENCES `Marketplace`.`Company` (`name`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `Marketplace`.`Review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`Review` (
  `reviewID` INT NOT NULL AUTO_INCREMENT,
  `score` INT NULL DEFAULT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  `reviewType` ENUM('user', 'listing') NULL DEFAULT NULL,
  `transactionID` INT NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`reviewID`),
  INDEX `transactionID` (`transactionID` ASC) VISIBLE,
  CONSTRAINT `Review_ibfk_1`
    FOREIGN KEY (`transactionID`)
    REFERENCES `Marketplace`.`Transaction` (`transactionID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;

USE `Marketplace` ;

-- -----------------------------------------------------
-- Placeholder table for view `Marketplace`.`SelectedPropertiesView`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`SelectedPropertiesView` (`property` INT, `selected` INT);

-- -----------------------------------------------------
-- Placeholder table for view `Marketplace`.`TaxonomyView`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Marketplace`.`TaxonomyView` (`dimension` INT, `mandatory` INT, `dimensionValue` INT, `exclusive` INT, `orderNrDimension` INT, `orderNrValue` INT);

-- -----------------------------------------------------
-- View `Marketplace`.`SelectedPropertiesView`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Marketplace`.`SelectedPropertiesView`;
USE `Marketplace`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`tdrave3`@`%` SQL SECURITY DEFINER VIEW `Marketplace`.`SelectedPropertiesView` AS select `PC`.`property` AS `property`,`C`.`selected` AS `selected` from (`Marketplace`.`PropertyCompany` `PC` left join `Marketplace`.`Company` `C` on((`PC`.`company` = `C`.`name`))) where (0 <> `C`.`selected`);

-- -----------------------------------------------------
-- View `Marketplace`.`TaxonomyView`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Marketplace`.`TaxonomyView`;
USE `Marketplace`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`Marketplace`@`%` SQL SECURITY DEFINER VIEW `Marketplace`.`TaxonomyView` AS select `D`.`name` AS `dimension`,`D`.`mandatory` AS `mandatory`,`DV`.`name` AS `dimensionValue`,`DV`.`exclusive` AS `exclusive`,`D`.`orderNr` AS `orderNrDimension`,`DV`.`orderNr` AS `orderNrValue` from (`Marketplace`.`Dimension` `D` join `Marketplace`.`DimensionValue` `DV` on((`D`.`name` = `DV`.`dimension`))) order by `D`.`orderNr`,`DV`.`orderNr`;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
