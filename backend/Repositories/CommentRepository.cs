using Microsoft.EntityFrameworkCore;
using Pictobox.Data;
using Pictobox.Models;

public class CommentRepository : ICommentRepository
{
    private readonly ApplicationDbContext _db;

    public CommentRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public Task<Comment> GetById(int id)
    {
        throw new NotImplementedException();
    }

    public Task<List<Comment>> GetComments(int userId) =>
        _db.Comments.Where(p => p.UserId == userId).ToListAsync();

    public async Task<Comment> Save(Comment comment)
    {
        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();
        return comment;
    }
}