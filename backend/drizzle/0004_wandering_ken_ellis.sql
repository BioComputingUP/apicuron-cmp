ALTER TABLE `USER_CONSENTS` ADD `permissions_json` text NOT NULL;--> statement-breakpoint
ALTER TABLE `USER_CONSENTS` DROP COLUMN `permissions`;