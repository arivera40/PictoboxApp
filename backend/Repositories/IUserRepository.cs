using Pictobox.Models;

public interface IUserRepository
{
    Task<UserProfileDto?> GetById(int id);
    Task<List<UserDto>?> SearchUsers(string query);
    Task<bool> IsFollowing(int followerId, int followeeId);
    Task<HashSet<int>> GetFollowingIds(int followerId, List<int> targetUserIds);
    Task<User?> GetByUserId(int id);
    Task<User?> GetByEmail(string email);
    Task<UserProfileDto?> GetByUsername(string username);
    Task<bool> FindById(int id);
    Task<bool> FindByEmail(string email);
    Task<bool> FindByUsername(string username);
    Task<int> GetFollowingCount(int userId);
    Task<int> GetFollowersCount(int userId);
    Task<int> GetPostsCount(int userId);
    Task<List<Post>> GetPosts(int userId);
    Task<User> Save(User user);
    Task Save();
}
