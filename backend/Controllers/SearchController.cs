using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("users/search")]
public class SearchController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ILogger<ProfileController> _logger;

    public SearchController(UserService userService, ILogger<ProfileController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> SearchUsers([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest("Query parameter 'q' is required.");

        try
        {
            var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
            int? requestingUserId = null;

            if (isAuthenticated)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim != null)
                    requestingUserId = int.Parse(userIdClaim.Value);
            }

            var users = await _userService.SearchUsers(q);

            var response = new List<object>();

            HashSet<int> followingSet = new(); // default empty
            if (isAuthenticated && requestingUserId.HasValue)
            {
                var userIds = users.Select(u => u.UserId).ToList();
                followingSet = await _userService.GetFollowingIds(requestingUserId.Value, userIds);
            }

            foreach (var u in users)
            {
                var userData = new Dictionary<string, object>
                {
                    ["userId"] = u.UserId,
                    ["username"] = u.Username,
                    ["profilePic"] = u.ProfilePic
                };

                if (followingSet.Contains(u.UserId))
                {
                    userData["isFollowing"] = true;
                }

                response.Add(userData);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to search users with query: {Query}", q);
            return StatusCode(500, "An error occurred while searching for users.");
        }
    }
}