USE [VotoXVoto]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectAll_V2]    Script Date: 2/15/2022 6:57:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Moon Park
-- Create date: 10/18/2021
-- Description:	Paginated Select All for Users table, including Roles
-- =============================================

ALTER proc [dbo].[Users_SelectAll_V2]
					@pageIndex int 
                    ,@pageSize int

/*

	Declare @pageIndex int = 0
            ,@pageSize int = 8

	Execute dbo.Users_SelectAll_V2
						@pageIndex
						,@pageSize


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
									on r.Id = ur.RoleId AND u.Id = ur.UserId FOR JSON PATH)
			,TotalCount = COUNT(1) OVER()
	From dbo.Users as u
		inner join dbo.StatusTypes as s
			on s.Id = u.StatusTypeId
	ORDER BY u.Id

	OFFSET @offSet Rows
	Fetch Next @pageSize Rows ONLY

END