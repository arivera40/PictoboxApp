using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pictobox.Data;
using Pictobox.Models;

[Authorize]
[ApiController]
[Route("posts")]
public class PostsController : ControllerBase
{
    private readonly PostService _postService;
    private readonly UserService _userService;
    private readonly ILogger<PostsController> _logger;

    public PostsController(PostService postService, UserService userService, ILogger<PostsController> logger)
    {
        _postService = postService;
        _userService = userService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePost([FromForm] CreatePostRequest postRequest)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim is null)
            return Unauthorized();

        if (postRequest.ImageFile == null || postRequest.ImageFile.Length == 0)
            return BadRequest("Image file is required.");

        int userId = int.Parse(userIdClaim.Value);

        try
        {
            await _postService.Save(postRequest, userId);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogWarning(ex, "Database update failed during post creation.");
            return Conflict("Post failed to create.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during post creation.");
            return StatusCode(500, "An unexpected error occurred.");
        }

        return Ok("Post created successfully.");
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> ViewPost([FromRoute] int id)
    {
        var post = await _postService.GetPostById(id);

        return Ok(post);
    }
}