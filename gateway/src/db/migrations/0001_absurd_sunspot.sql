ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");