using System.Data;
using Pictobox.Models;

public class UserService
{
    private readonly UserRepository _userRepository;

    public UserService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    public async Task<UserProfileDto> GetProfileData(int userId, string username, string profilePic)
    {
        var followersCount = await _userRepository.GetFollowersCount(userId);
        var followingCount = await _userRepository.GetFollowingCount(userId);
        var posts = await _userRepository.GetPosts(userId);

        return new UserProfileDto
        {
            ProfilePic = profilePic,
            Username = username,
            FollowersCount = followersCount,
            FollowingCount = followingCount,
            PostsCount = posts.Count(),
            Posts = posts,
        };
    }

    public async Task<User?> GetByUserId(int userId)
    {
        return await _userRepository.GetById(userId);
    }

    public async Task<string> UpdateProfilePic(int userId, IFormFile profilePic)
    {
        if (profilePic == null)
            throw new ArgumentNullException(nameof(profilePic), "No image file provided.");

        ImageUtility.ValidateImage(profilePic);

        // Save the image and get its relative path (e.g., /uploads/xyz.jpg)
        string uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
        string imageUrl = await ImageUtility.SaveImageAsync(profilePic, uploadsDir);

        var user = await _userRepository.GetById(userId);
        if (user is null)
            throw new DataException($"User with ID {userId} not found.");

        user.ProfilePic = imageUrl;

        await _userRepository.Save();
        return imageUrl;
    }


}