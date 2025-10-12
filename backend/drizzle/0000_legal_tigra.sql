CREATE TABLE `PERMISSIONS` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`permission_identifier` text NOT NULL,
	`permission_name` text NOT NULL,
	`permission_description` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `PERMISSIONS_permission_identifier_unique` ON `PERMISSIONS` (`permission_identifier`);--> statement-breakpoint
CREATE TABLE `USER_CONSENTS` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` integer NOT NULL,
	`permission_id` integer NOT NULL,
	`permission_identifier` text NOT NULL,
	`permission_name` text NOT NULL,
	`permission_description` text NOT NULL,
	`user_orcidId` text,
	`user_email` text
);
