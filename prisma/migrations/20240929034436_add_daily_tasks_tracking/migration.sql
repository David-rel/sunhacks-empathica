BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[user_profiles] ADD [exercise] NVARCHAR(1000),
[journaling] NVARCHAR(1000),
[meals] NVARCHAR(1000),
[meditation] NVARCHAR(1000),
[sleep] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[DailyMentalHealthTask] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL CONSTRAINT [DailyMentalHealthTask_date_df] DEFAULT CURRENT_TIMESTAMP,
    [meditationCompleted] BIT NOT NULL CONSTRAINT [DailyMentalHealthTask_meditationCompleted_df] DEFAULT 0,
    [journalingCompleted] BIT NOT NULL CONSTRAINT [DailyMentalHealthTask_journalingCompleted_df] DEFAULT 0,
    [mealsCompleted] BIT NOT NULL CONSTRAINT [DailyMentalHealthTask_mealsCompleted_df] DEFAULT 0,
    [sleepCompleted] BIT NOT NULL CONSTRAINT [DailyMentalHealthTask_sleepCompleted_df] DEFAULT 0,
    [exerciseCompleted] BIT NOT NULL CONSTRAINT [DailyMentalHealthTask_exerciseCompleted_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DailyMentalHealthTask_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [DailyMentalHealthTask_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[DailyMentalHealthTask] ADD CONSTRAINT [DailyMentalHealthTask_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user_profiles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
