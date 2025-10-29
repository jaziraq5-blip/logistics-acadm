-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_ro" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_ar" TEXT NOT NULL,
    "description_ro" TEXT NOT NULL,
    "icon" TEXT,
    "image_url" VARCHAR(500),
    "features" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "event_data" JSONB DEFAULT '{}',
    "user_agent" TEXT,
    "ip_address" INET,
    "page_url" VARCHAR(500),
    "referrer" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" UUID NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "name_ar" VARCHAR(200) NOT NULL,
    "name_ro" VARCHAR(200) NOT NULL,
    "description_en" TEXT,
    "description_ar" TEXT,
    "description_ro" TEXT,
    "image_url" VARCHAR(500),
    "certificate_type" VARCHAR(100),
    "issued_by" VARCHAR(200),
    "issued_date" DATE,
    "expiry_date" DATE,
    "is_active" BOOLEAN DEFAULT true,
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "company" VARCHAR(200),
    "service_type" VARCHAR(100),
    "message" TEXT NOT NULL,
    "status" VARCHAR(20) DEFAULT 'new',
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_pages" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "page_key" VARCHAR(100) NOT NULL,
    "title_en" VARCHAR(200) NOT NULL,
    "title_ar" VARCHAR(200) NOT NULL,
    "title_ro" VARCHAR(200) NOT NULL,
    "content_en" TEXT NOT NULL,
    "content_ar" TEXT NOT NULL,
    "content_ro" TEXT NOT NULL,
    "meta_description_en" TEXT,
    "meta_description_ar" TEXT,
    "meta_description_ro" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "setting_key" VARCHAR(100) NOT NULL,
    "setting_value" TEXT NOT NULL,
    "setting_type" VARCHAR(20) DEFAULT 'string',
    "description" TEXT,
    "is_public" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name_en" VARCHAR(100) NOT NULL,
    "name_ar" VARCHAR(100) NOT NULL,
    "name_ro" VARCHAR(100) NOT NULL,
    "position_en" VARCHAR(100) NOT NULL,
    "position_ar" VARCHAR(100) NOT NULL,
    "position_ro" VARCHAR(100) NOT NULL,
    "bio_en" TEXT,
    "bio_ar" TEXT,
    "bio_ro" TEXT,
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "image_url" VARCHAR(500),
    "linkedin_url" VARCHAR(200),
    "experience_years" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'admin',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_services_active" ON "services"("is_active");

-- CreateIndex
CREATE INDEX "idx_analytics_created_at" ON "analytics"("created_at");

-- CreateIndex
CREATE INDEX "idx_analytics_event_type" ON "analytics"("event_type");

-- CreateIndex
CREATE INDEX "idx_certificates_active" ON "certificates"("is_active");

-- CreateIndex
CREATE INDEX "idx_contact_messages_created_at" ON "contact_messages"("created_at");

-- CreateIndex
CREATE INDEX "idx_contact_messages_status" ON "contact_messages"("status");

-- CreateIndex
CREATE UNIQUE INDEX "content_pages_page_key_key" ON "content_pages"("page_key");

-- CreateIndex
CREATE INDEX "idx_content_pages_key" ON "content_pages"("page_key");

-- CreateIndex
CREATE UNIQUE INDEX "settings_setting_key_key" ON "settings"("setting_key");

-- CreateIndex
CREATE INDEX "idx_settings_key" ON "settings"("setting_key");

-- CreateIndex
CREATE INDEX "idx_team_members_active" ON "team_members"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_username" ON "users"("username");
