BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[user_profiles] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [profilePicture] NVARCHAR(1000),
    [password] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [user_profiles_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [user_profiles_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_profiles_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [user_profiles_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[loves] (
    [id] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [userProfileId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [loves_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[struggles] (
    [id] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [userProfileId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [struggles_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[activities] (
    [id] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [userProfileId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [activities_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[fun_facts] (
    [id] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [userProfileId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [fun_facts_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[loves] ADD CONSTRAINT [loves_userProfileId_fkey] FOREIGN KEY ([userProfileId]) REFERENCES [dbo].[user_profiles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[struggles] ADD CONSTRAINT [struggles_userProfileId_fkey] FOREIGN KEY ([userProfileId]) REFERENCES [dbo].[user_profiles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[activities] ADD CONSTRAINT [activities_userProfileId_fkey] FOREIGN KEY ([userProfileId]) REFERENCES [dbo].[user_profiles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[fun_facts] ADD CONSTRAINT [fun_facts_userProfileId_fkey] FOREIGN KEY ([userProfileId]) REFERENCES [dbo].[user_profiles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
