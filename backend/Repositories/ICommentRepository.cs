using Pictobox.Models;

public interface ICommentRepository
{
    Task Save();
    Task DeleteById(int id);
    Task<Comment> Save(Comment comment);
    Task<Comment?> GetById(int id);
    Task<List<Comment>> GetComments(int userId);
}