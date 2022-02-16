using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Enums;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Users;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Threading.Tasks;
using Sabio.Models.AppSettings;
using Microsoft.Extensions.Options;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserApiController : BaseApiController
    {
        private IUserService _service = null;
        private IEmailService _email = null;
        private IAuthenticationService<int> _authService = null;
        private SiteSettings _siteSettings;

        public UserApiController(IUserService service
            , IEmailService email
            , IAuthenticationService<int> authService
            , IOptions<SiteSettings> siteSettings
            , ILogger<UserApiController> logger) : base(logger)
        {
            _service = service;
            _email = email;
            _authService = authService;
            _siteSettings = siteSettings.Value;
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<User>>> Pagination(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> paged = _service.Paginate(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 400;
                    response = new ErrorResponse("No records found");
                }
                else
                {
                    response = new ItemResponse<Paged<User>> { Item = paged };
                }

            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");

            }
            return StatusCode(code, response);
        }

        [HttpGet("role/{id:int}/paginate")]
        public ActionResult<ItemResponse<Paged<User>>> GetByRoleId(int roleId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> paged = _service.GetByRoleId(roleId, pageIndex, pageSize);
                if (paged == null)
                {
                    code = 400;
                    response = new ErrorResponse("No records found");
                }
                else
                {
                    response = new ItemResponse<Paged<User>> { Item = paged };
                }

            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");

            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}/status/{status:int}")]
        public ActionResult<SuccessResponse> UpdateStatus(int id, int status)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.UpdateStatus(id, status);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }

            return StatusCode(code, response);
        }


    }
}
