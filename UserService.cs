using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Users;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class UserService : IUserService
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;

        public UserService(IAuthenticationService<int> authSerice, IDataProvider dataProvider)
        {
            _authenticationService = authSerice;
            _dataProvider = dataProvider;
        }

        public Paged<User> Paginate(int pageIndex, int pageSize)
        {
            Paged<User> pagedList = null;
            List<User> list = null;

            int totalCount = 0;
            string procName = "dbo.Users_SelectAll_V2";

            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                User user = null;
                user = mapUser(reader, out int startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<User>();
                }

                list.Add(user);
            });

            if (list != null)
            {
                pagedList = new Paged<User>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<User> GetByRoleId(int roleId, int pageIndex, int pageSize)
        {
            Paged<User> pagedList = null;
            List<User> list = null;
            
            int totalCount = 0;
            string procName = "[dbo].[Users_SelectByRole]";

            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@RoleId", roleId);
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                User user = null;
                user = mapUser(reader, out int startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<User>();
                }

                list.Add(user);
            });

            if (list != null)
            {
                pagedList = new Paged<User>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public void UpdateStatus(int userId, int status)
        {
            string procName = "dbo.Users_UpdateStatus";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", userId);
                col.AddWithValue("@StatusId", status);

            }, returnParameters: null);
        }

        private List<string> MapRoles(List<LookUp<int>> list)
        {
            List<string> newList = null;
    
                foreach (LookUp<int> item in list)
                {
                    if (newList == null)
                    {
                        newList = new List<string>();
                    }

                    newList.Add(item.Name);
                }

            return newList;
                
        }
        private User mapUser(IDataReader reader, out int startingIndex)
        {
            User user = new User();

            startingIndex = 0;

            user.Id = reader.GetSafeInt32(startingIndex++);
            user.Email = reader.GetSafeString(startingIndex++);
            user.IsConfirmed = reader.GetSafeBool(startingIndex++);
            user.StatusType = new LookUp<int>();
            user.StatusType.Id = reader.GetSafeInt32(startingIndex++);
            user.StatusType.Name = reader.GetSafeString(startingIndex++);
            List<LookUp<int>> list = reader.DeserializeObject<List<LookUp<int>>>(startingIndex++);
            if ( list != null && list.Count > 0)
            {
                user.Roles = MapRoles(list);
            }

            return user;
        }

    }
}