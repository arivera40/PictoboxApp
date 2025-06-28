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
        var post = new Post(userId, imagePath, postRequest.Caption);

        await _postRepository.Save(post);

        return post;
    }

    //   postId: string
    //   imagePath: string
    //   caption: string
    //   likes: number
    //   comments: number
    //   postDate: string
    //   username: string
    //   profilePicUrl: string x
    //   isLiked: boolean x
    //   commentsList: Comment[]
    public async Task<Post> GetPostById(int postId)
    {
        var post = await _postRepository.GetById(postId);
        var comments = await _commentRepository.GetComments(post.UserId);

        Console.WriteLine(post);

        return post;
    }
}