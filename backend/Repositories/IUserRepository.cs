using Pictobox.Models;

public interface IUserRepository
{
    Task<User?> GetById(int id);
    Task<User?> GetByEmail(string email);
    Task<User?> GetByUsername(string username);
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
