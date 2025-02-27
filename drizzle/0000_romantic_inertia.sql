CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"imageUrl" varchar,
	"subscription" boolean DEFAULT 'false',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
