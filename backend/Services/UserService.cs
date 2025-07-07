using System.Data;
using Pictobox.Models;

public class UserService
{
    private readonly UserRepository _userRepository;

    public UserService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    public async Task<UserProfileDto> GetProfileData(string username)
    {
        var user = await _userRepository.GetByUsername(username);

        if (user is null)
            throw new Exception($"Unable to find user: {username}.");

        return user;
    }

    public async Task<List<UserDto>?> SearchUsers(string query)
    {
        return await _userRepository.SearchUsers(query);
    }

    public async Task<bool> IsFollowing(int followerId, int followeeId)
    {
        return await _userRepository.IsFollowing(followerId, followeeId);
    }

    public async Task<HashSet<int>> GetFollowingIds(int followerId, List<int> targetUserIds)
    {
        return await _userRepository.GetFollowingIds(followerId, targetUserIds);
    }

    public async Task<string> UpdateProfilePic(int userId, IFormFile profilePic)
    {
        if (profilePic == null)
            throw new ArgumentNullException(nameof(profilePic), "No image file provided.");

        ImageUtility.ValidateImage(profilePic);

        // Save the image and get its relative path (e.g., /uploads/xyz.jpg)
        string uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
        string imageUrl = await ImageUtility.SaveImageAsync(profilePic, uploadsDir);

        var user = await _userRepository.GetByUserId(userId);
        if (user is null)
            throw new DataException($"User with ID {userId} not found.");

        user.ProfilePic = imageUrl;

        await _userRepository.Save();
        return imageUrl;
    }

    public async Task<bool> DeleteProfilePic(int userId)
    {
        var user = await _userRepository.GetByUserId(userId);
        if (user is null)
            throw new DataException($"User with ID {userId} not found.");

        user.ProfilePic = null;
        await _userRepository.Save();
        return true;
    }

    public async Task<bool> UpdateProfileData(int userId, ProfileUpdateRequest profileUpdate)
    {
        var user = await _userRepository.GetByUserId(userId);
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
        var user = await _userRepository.GetByUserId(userId);

        if (user is null)
            throw new DataException($"User with ID {userId} not found.");

        if (!AuthUtility.VerifyPassword(passwordUpdate.CurrentPassword, user.Password))
            throw new DataException($"Invalid Credentials");

        user.Password = AuthUtility.EncryptPassword(passwordUpdate.NewPassword);

        await _userRepository.Save();

        return true;
    }
}