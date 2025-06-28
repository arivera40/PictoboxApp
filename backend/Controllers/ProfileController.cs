using System.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pictobox.Data;

[ApiController]
[Route("profile")]
public class ProfileController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(UserService userService, ILogger<ProfileController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetProfileAsync()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        var usernameClaim = User.FindFirst(ClaimTypes.Name);
        var profilePic = User.FindFirst("profilePicUrl")?.Value;

        if (userIdClaim is null || usernameClaim is null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);
        string username = usernameClaim.Value;

        var profile = await _userService.GetProfileData(userId, username, profilePic ?? "");

        return Ok(profile);
    }

    [HttpPost("update/profile-picture")]
    public async Task<IActionResult> UpdateProfilePic([FromForm] IFormFile profilePic)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        try
        {
            var imagePath = await _userService.UpdateProfilePic(userId, profilePic);
            return Ok(new { profilePic = imagePath });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update profile picture for user {UserId}", userId);
            return StatusCode(500, "An error occurred while updating the profile picture.");
        }
    }
}
