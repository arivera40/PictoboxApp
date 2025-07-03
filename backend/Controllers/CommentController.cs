using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("profile/{username}/posts/{postId}/comments")]
public class CommentController : ControllerBase
{
    private readonly CommentService _commentService;
    private readonly ILogger<PostsController> _logger;

    public CommentController(CommentService commentService, ILogger<PostsController> logger)
    {
        _commentService = commentService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> PostComment([FromRoute] string username, [FromRoute] int postId, [FromBody] CommentRequest commentRequest)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        var usernameClaim = User.FindFirst(ClaimTypes.Name);
        if (userIdClaim is null || usernameClaim is null)
            return Forbid();

        int userId = int.Parse(userIdClaim.Value);

        try
        {
            var post = await _commentService.PostComment(userId, postId, commentRequest);
            return Ok(post);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected Error: Unable to post comment");
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpPut("{commentId}")]
    public async Task<IActionResult> UpdateComment([FromRoute] int commentId, [FromBody] CommentRequest commentRequest)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null)
            return Forbid();

        var userId = int.Parse(userIdClaim.Value);

        try
        {
            await _commentService.UpdateComment(commentId, userId, commentRequest);
            return Ok("Comment updated successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected Error: Unable to update comment");
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpDelete("{commentId}")]
    public async Task<IActionResult> DeleteComment([FromRoute] int commentId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null)
            return Forbid();
        
        int userId = int.Parse(userIdClaim.Value);
            
        try
        {
            await _commentService.DeleteComment(commentId, userId);
            return Ok("Comment deleted successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected Error: Unable to delete comment");
            return StatusCode(500, "An unexpected error occurred.");
        }
    }
}