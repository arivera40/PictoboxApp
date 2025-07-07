using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("users/{followeeId}")]
public class FollowController : ControllerBase
{
    private readonly FollowService _followService;
    private readonly ILogger<PostsController> _logger;


    public FollowController(FollowService followService, ILogger<PostsController> logger)
    {
        _followService = followService;
        _logger = logger;
    }

    [HttpPost("follow")]
    public async Task<IActionResult> FollowUser([FromRoute] int followeeId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null)
            return Forbid();

        int followerId = int.Parse(userIdClaim.Value);

        try
        {
            await _followService.FollowUser(followeeId, followerId);
            return Ok("User followed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected Error: Unable to post comment");
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpDelete("unfollow")]
    public async Task<IActionResult> UnfollowUser([FromRoute] int followeeId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null)
            return Forbid();

        int followerId = int.Parse(userIdClaim.Value);

        try
        {
            await _followService.UnfollowUser(followeeId, followerId);
            return Ok("User unfollowed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected Error: Unable to post comment");
            return StatusCode(500, "An unexpected error occurred.");
        }
    }
}