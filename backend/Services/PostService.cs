using System.Data;
using Microsoft.VisualBasic;
using Pictobox.Models;

public class PostService
{
    private readonly PostRepository _postRepository;

    public PostService(PostRepository postRepository, CommentRepository commentRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<Post> Save(CreatePostRequest postRequest, int userId)
    {
        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var fileName = ImageUtility.GenerateUniqueFileName(postRequest.ImageFile.FileName);
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