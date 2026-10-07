CREATE TABLE IF NOT EXISTS `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL COLLATE NOCASE,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `users_username_unique` ON `users` (`username`);

CREATE TABLE IF NOT EXISTS `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `profiles` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`sex` text NOT NULL,
	`age` integer NOT NULL,
	`height_cm` real NOT NULL,
	`start_weight` real NOT NULL,
	`goal_weight` real NOT NULL,
	`activity` text NOT NULL,
	`start_date` text NOT NULL,
	`protein_g_per_kg` real DEFAULT 2.1 NOT NULL,
	`fat_g_per_kg` real DEFAULT 0.8 NOT NULL,
	`recal_day` integer,
	`recal_weight` real,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `daily_logs` (
	`user_id` integer NOT NULL,
	`day` integer NOT NULL,
	`weight_kg` real,
	`protein_g` integer,
	`carb_g` integer,
	`fat_g` integer,
	`waist_cm` real,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `day`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT `day_check` CHECK(`day` >= 1 AND `day` <= 90),
	CONSTRAINT `weight_check` CHECK(`weight_kg` IS NULL OR (`weight_kg` >= 30 AND `weight_kg` <= 300)),
	CONSTRAINT `protein_check` CHECK(`protein_g` IS NULL OR (`protein_g` >= 0 AND `protein_g` <= 2000)),
	CONSTRAINT `carb_check` CHECK(`carb_g` IS NULL OR (`carb_g` >= 0 AND `carb_g` <= 2000)),
	CONSTRAINT `fat_check` CHECK(`fat_g` IS NULL OR (`fat_g` >= 0 AND `fat_g` <= 2000)),
	CONSTRAINT `waist_check` CHECK(`waist_cm` IS NULL OR (`waist_cm` >= 30 AND `waist_cm` <= 250))
);

CREATE TABLE IF NOT EXISTS `login_attempts` (
	`key` text NOT NULL,
	`at` integer NOT NULL
);
