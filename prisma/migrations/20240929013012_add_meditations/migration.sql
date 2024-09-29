BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Meditation] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [startedAt] DATETIME2 NOT NULL,
    [completedAt] DATETIME2,
    [timeSpent] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Meditation_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Meditation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Meditation] ADD CONSTRAINT [Meditation_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user_profiles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
