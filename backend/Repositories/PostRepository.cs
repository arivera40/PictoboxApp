using Microsoft.EntityFrameworkCore;
using Pictobox.Data;
using Pictobox.Models;

public class PostRepository : IPostRepository
{
    private readonly ApplicationDbContext _db;

    public PostRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Post> Save(Post post)
    {
        _db.Posts.Add(post);
        await _db.SaveChangesAsync();
        return post;
    }

    public Task<Post?> GetById(int id) =>
        _db.Posts.SingleOrDefaultAsync(p => p.PostId == id);
}