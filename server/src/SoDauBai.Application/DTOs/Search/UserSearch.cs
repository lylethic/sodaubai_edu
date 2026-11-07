using System;
using Microsoft.AspNetCore.Mvc;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class UserSearch : QueryObject
{
    [FromQuery(Name = "schoolId")]
    public int? SchoolId { get; set; } = null;
}

