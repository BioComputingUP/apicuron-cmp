CREATE TABLE `PERMISSIONS` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`identifier` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`user_id` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `PERMISSIONS_identifier_unique` ON `PERMISSIONS` (`identifier`);--> statement-breakpoint
ALTER TABLE `USER_CONSENTS` DROP COLUMN `permissions_json`;