ALTER TABLE `USER_CONSENTS` ADD `last_update` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `USER_CONSENTS` ADD `first_declared` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `USER_CONSENTS` DROP COLUMN `timestamp`;