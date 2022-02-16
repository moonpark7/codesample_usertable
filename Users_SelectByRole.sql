USE [VotoXVoto]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectByRole]    Script Date: 2/15/2022 7:00:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Moon Park
-- Create date: 10/27/2021
-- Description:	Select USERS by RoleId
-- =============================================

ALTER proc [dbo].[Users_SelectByRole]
					@RoleId int
					,@pageIndex int 
                    ,@pageSize int

/*

	Declare @RoleId int= 2
			,@pageIndex int = 0
            ,@pageSize int = 20

	Execute [dbo].[Users_SelectByRole]
						@RoleId
						,@pageIndex
						,@pageSize

	Select *
	From [dbo].[Users]
	
	Select *
	From [dbo].[Roles]

*/

as

BEGIN

	Declare @offset int = @pageIndex * @pageSize

	Select	u.[Id]
			,u.[Email]
			,u.[IsConfirmed]
			,s.[Id]
			,s.[Name]
			,UserRoles = (Select r.[Id] 
								,r.[Name]
							From dbo.Roles as r
								inner join dbo.UserRoles as ur
									on r.Id = ur.RoleId AND u.Id = ur.UserId
									FOR JSON PATH)
			,TotalCount = COUNT(1) OVER()

	From dbo.Users as U
	JOIN dbo.StatusTypes as S on S.Id = U.StatusTypeId
	JOIN dbo.UserRoles as UR ON UR.UserId = U.Id
	JOIN dbo.Roles as R ON R.Id = UR.RoleId
	WHERE UR.RoleId = @RoleId

	ORDER BY u.Id

	OFFSET @offSet Rows
	Fetch Next @pageSize Rows ONLY

END