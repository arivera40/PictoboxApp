using Pictobox.Models;

public interface IPostRepository
{
    Task<Post> Save(Post post);
    Task<PostDto?> GetById(int id);
}