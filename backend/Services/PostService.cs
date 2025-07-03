using System.Data;
using Microsoft.VisualBasic;
using Pictobox.Models;

public class PostService
{
    private readonly PostRepository _postRepository;
    private readonly CommentRepository _commentRepository;

    public PostService(PostRepository postRepository, CommentRepository commentRepository)
    {
        _postRepository = postRepository;
        _commentRepository = commentRepository;
    }

    public string GenerateUniqueFileName(string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName);
        var uniqueName = $"{Guid.NewGuid()}{extension}";
        return uniqueName;
    }

    public async Task<Post> Save(CreatePostRequest postRequest, int userId)
    {
        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var fileName = GenerateUniqueFileName(postRequest.ImageFile.FileName);
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await postRequest.ImageFile.CopyToAsync(stream);
        }

        var imagePath = $"http://localhost:5193/uploads/{fileName}";

        return await _postRepository.Save(new Post(userId, imagePath, postRequest.Caption));
    }

    public async Task<PostDto?> GetPostById(int postId)
    {
        var post = await _postRepository.GetById(postId);

        if (post is null)
            throw new DataException($"Post not found - id: {postId}");

        return post;
    }

}