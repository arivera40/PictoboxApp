using System.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pictobox.Data;

[ApiController]
[Route("profile/{username}")]
public class ProfileController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(UserService userService, ILogger<ProfileController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfileAsync([FromRoute] string username)
    {
        try
        {
            var profile = await _userService.GetProfileData(username);
            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to find user: {username}", username);
            return StatusCode(500, "An error occurred while retrieving user data.");
        }
    }

    [Authorize]
    [HttpPost("profile-picture")]
    public async Task<IActionResult> UpdateProfilePic([FromRoute] string username, [FromForm] IFormFile profilePic)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        var usernameClaim = User.FindFirst(ClaimTypes.Name);
        if (userIdClaim is null || usernameClaim is null || usernameClaim.Value != username)
            return Forbid();

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

    [Authorize]
    [HttpDelete("profile-picture")]
    public async Task<IActionResult> DeleteProfilePic([FromRoute] string username)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        var usernameClaim = User.FindFirst(ClaimTypes.Name);
        if (userIdClaim is null || usernameClaim is null || usernameClaim.Value != username)
            return Forbid();

        int userId = int.Parse(userIdClaim.Value);

        try
        {
            await _userService.DeleteProfilePic(userId);
            return Ok("Profile picture deleted successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete profile picture for user {UserId}", userId);
            return StatusCode(500, "An error occurred while deleting the profile picture.");
        }
    }

    [Authorize]
    [HttpPut("profile-data")]
    public async Task<IActionResult> UpdateProfileData([FromBody] ProfileUpdateRequest profileUpdate)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        try
        {
            var user = await _userService.UpdateProfileData(userId, profileUpdate);
            return Ok("Profile data updated successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update profile for user {UserId}", userId);
            return StatusCode(500, "An error occurred while updating the profile.");
        }
    }

    [Authorize]
    [HttpPut("password-change")]
    public async Task<IActionResult> PasswordUpdate([FromBody] PasswordUpdateRequest passwordUpdate)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        try
        {
            await _userService.UpdatePassword(userId, passwordUpdate);
            return Ok("Password updated successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update user password for user {UserId}", userId);
            return StatusCode(500, "An error occurred while updating the user's password.");
        }
    }
}

