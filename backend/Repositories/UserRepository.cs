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

    public Task<User?> GetById(int id) =>
        _db.Users
            .Include(u => u.Posts)
            .Include(u => u.FollowFollowers)
            .Include(u => u.FollowFollowees)
            .SingleOrDefaultAsync(u => u.UserId == id);

    public Task<User?> GetByUsername(string username) =>
        _db.Users.SingleOrDefaultAsync(u => u.Username == username);

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