BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[user_profiles] ADD [questionaireComplete] BIT NOT NULL CONSTRAINT [user_profiles_questionaireComplete_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
