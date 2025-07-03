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

    public async Task<Comment?> GetById(int id) =>
        await _db.Comments.Where(c => c.CommentId == id).SingleOrDefaultAsync();

    public Task<List<Comment>> GetComments(int userId) =>
        _db.Comments.Where(p => p.UserId == userId).ToListAsync();

    public async Task<Comment> Save(Comment comment)
    {
        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();
        return comment;
    }

    public async Task Save() => await _db.SaveChangesAsync();

    public async Task DeleteById(int id) =>
        await _db.Comments.Where(c => c.CommentId == id).ExecuteDeleteAsync();
}