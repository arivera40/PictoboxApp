using System.Data;
using Pictobox.Models;

public class CommentService
{
    private readonly CommentRepository _commentRepository;
    private readonly PostRepository _postRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository)
    {
        _commentRepository = commentRepository;
        _postRepository = postRepository;
    }

    public async Task<PostDto?> PostComment(int userId, int postId, CommentRequest commentRequest)
    {
        var comment = new Comment(userId, postId, commentRequest.Content);
        await _commentRepository.Save(comment);

        var post = await _postRepository.GetById(postId);
        return post;
    }

    public async Task<bool> UpdateComment(int commentId, int userId, CommentRequest commentRequest)
    {
        var comment = await _commentRepository.GetById(commentId);

        if (comment is null)
            throw new DataException($"Comment not found - id: {commentId}");

        if (comment.UserId != userId)
            throw new Exception($"Comments belonging to another user cannot be updated.");

        comment.Content = commentRequest.Content;
        await _commentRepository.Save();

        return true;
    }

    public async Task<bool> DeleteComment(int commentId, int userId)
    {
        var comment = await _commentRepository.GetById(commentId);
        if (comment is null)
            throw new DataException($"Comment not found - id: {commentId}");

        if (comment.UserId != userId)
            throw new Exception($"Comments belonging to another user cannot be deleted.");

        await _commentRepository.DeleteById(commentId);
        return true;
    }
}