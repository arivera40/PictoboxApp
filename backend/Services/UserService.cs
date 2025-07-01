using System.Data;
using Pictobox.Models;

public class UserService
{
    private readonly UserRepository _userRepository;

    public UserService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    public async Task<UserProfileDto> GetProfileData(int userId)
    {
        var posts = await _userRepository.GetPosts(userId);

        var user = await _userRepository.GetById(userId);

        if (user is null)
            throw new Exception($"Unable to find user.");

        return new UserProfileDto
        {
            ProfilePic = user.ProfilePic ?? "",
            Username = user.Username,
            Email = user.Email,
            Bio = user.Bio ?? "",
            FollowersCount = user.FollowFollowers.Count(),
            FollowingCount = user.FollowFollowees.Count(),
            PostsCount = user.Posts.Count(),
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

    public async Task<bool> DeleteProfilePic(int userId)
    {
        var user = await _userRepository.GetById(userId);
        if (user is null)
            throw new DataException($"User with ID {userId} not found.");

        user.ProfilePic = null;
        await _userRepository.Save();
        return true;
    }

    public async Task<bool> UpdateProfileData(int userId, ProfileUpdateRequest profileUpdate)
    {
        var user = await _userRepository.GetById(userId);
        if (user is null)
            throw new DataException($"User with ID {userId} not found.");

        user.Username = profileUpdate.Username;
        user.Email = profileUpdate.Email;
        user.PhoneNumber = profileUpdate.PhoneNumber;
        user.Bio = profileUpdate.Bio;

        await _userRepository.Save();

        return true;
    }

    public async Task<bool> UpdatePassword(int userId, PasswordUpdateRequest passwordUpdate)
    {
        var user = await _userRepository.GetById(userId);

        if (user is null)
            throw new DataException($"User with ID {userId} not found.");

        if (!AuthUtility.VerifyPassword(passwordUpdate.CurrentPassword, user.Password))
            throw new DataException($"Invalid Credentials");

        user.Password = AuthUtility.EncryptPassword(passwordUpdate.NewPassword);

        await _userRepository.Save();

        return true;
    }
}