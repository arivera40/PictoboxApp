using Pictobox.Models;

public interface ICommentRepository
{
    Task<Comment> Save(Comment comment);
    Task<Comment> GetById(int id);

    Task<List<Comment>> GetComments(int userId);
}