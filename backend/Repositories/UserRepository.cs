using Microsoft.EntityFrameworkCore;
using Pictobox.Data;
using Pictobox.Models;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _db;

    public UserRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<User> Save(User user)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task Save() => await _db.SaveChangesAsync();

    public Task<User?> GetByEmail(string email) =>
        _db.Users.SingleOrDefaultAsync(u => u.Email == email);

    public async Task<UserProfileDto?> GetById(int id)
    {
        return await _db.Users
            .Where(u => u.UserId == id)
            .Select(u => new UserProfileDto
            {
                ProfilePic = u.ProfilePic ?? "",
                UserId = u.UserId,
                Username = u.Username,
                Email = u.Email,
                Bio = u.Bio ?? "",
                FollowersCount = u.FollowFollowers.Count(),
                FollowingCount = u.FollowFollowees.Count(),
                PostsCount = u.Posts.Count(),
                Posts = u.Posts.Select(p => new PostDto
                {
                    PostId = p.PostId,
                    Caption = p.Caption,
                    ImagePath = p.ImagePath,
                    PostDate = p.PostDate,
                    Likes = p.Likes ?? 0
                }).ToList()
            })
            .SingleOrDefaultAsync();
    }

    public Task<User?> GetByUserId(int id) =>
    _db.Users
        .Include(u => u.Posts)
        .Include(u => u.FollowFollowers)
        .Include(u => u.FollowFollowees)
        .SingleOrDefaultAsync(u => u.UserId == id);

    public async Task<UserProfileDto?> GetByUsername(string username)
    {
        return await _db.Users
            .Where(u => u.Username == username)
            .Select(u => new UserProfileDto
            {
                ProfilePic = u.ProfilePic ?? "",
                UserId = u.UserId,
                Username = u.Username,
                Email = u.Email,
                Bio = u.Bio ?? "",
                FollowersCount = u.FollowFollowers.Count(),
                FollowingCount = u.FollowFollowees.Count(),
                PostsCount = u.Posts.Count(),
                Posts = u.Posts.Select(p => new PostDto
                {
                    PostId = p.PostId,
                    Caption = p.Caption,
                    ImagePath = p.ImagePath,
                    PostDate = p.PostDate,
                    Likes = p.Likes ?? 0
                }).ToList()
            })
            .SingleOrDefaultAsync();
    }

    public Task<bool> FindByEmail(string email) =>
        _db.Users.AnyAsync(u => u.Email == email);

    public Task<bool> FindById(int id) =>
        _db.Users.AnyAsync(u => u.UserId == id);

    public Task<bool> FindByUsername(string username) =>
        _db.Users.AnyAsync(u => u.Username == username);

    public Task<int> GetFollowersCount(int userId) =>
        _db.Follows.CountAsync(f => f.FolloweeId == userId);

    public Task<int> GetFollowingCount(int userId) =>
        _db.Follows.CountAsync(f => f.FollowerId == userId);

    public Task<List<Follow>> GetFollowers(int userId) =>
        _db.Follows.Where(f => f.FolloweeId == userId).ToListAsync();

    public Task<List<Follow>> GetFollowees(int userId) =>
        _db.Follows.Where(f => f.FollowerId == userId).ToListAsync();

    public Task<int> GetPostsCount(int userId) =>
        _db.Posts.CountAsync(p => p.UserId == userId);

    public Task<List<Post>> GetPosts(int userId) =>
        _db.Posts.Where(p => p.UserId == userId).ToListAsync();
}