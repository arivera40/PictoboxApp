using Pictobox.Models;

public interface ICommentRepository
{
    Task<Comment> Save(Post post);
    Task<Comment> GetById(int id);

    Task<List<Comment>> GetComments(int userId);
}