DROP TABLE `PERMISSIONS`;--> statement-breakpoint
ALTER TABLE `USER_CONSENTS` ADD `revision` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `USER_CONSENTS` DROP COLUMN `permission_id`;--> statement-breakpoint
ALTER TABLE `USER_CONSENTS` DROP COLUMN `permission_identifier`;--> statement-breakpoint
ALTER TABLE `USER_CONSENTS` DROP COLUMN `permission_description`;--> statement-breakpoint
ALTER TABLE `USER_CONSENTS` DROP COLUMN `user_email`;