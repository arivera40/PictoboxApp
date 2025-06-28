using Pictobox.Models;

public interface IPostRepository
{
    Task<Post> Save(Post post);
    Task<Post> GetById(int id);
}