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

    public async Task<PostDto?> GetById(int id)
    {
        return await _db.Posts
            .Where(p => p.PostId == id)
            .Select(p => new PostDto
            {
                PostId = p.PostId,
                UserId = p.UserId,
                Caption = p.Caption,
                ImagePath = p.ImagePath,
                Likes = p.Likes,
                PostDate = p.PostDate,
                Comments = p.Comments
                    .Select(c => new CommentDto
                    {
                        CommentId = c.CommentId,
                        Content = c.Content,
                        CommentDate = c.CommentDate,
                        UserId = c.User.UserId,
                        ProfilePic = c.User.ProfilePic ?? "",
                        Username = c.User.Username
                    }).ToList(),
            })
            .SingleOrDefaultAsync();
    }
}