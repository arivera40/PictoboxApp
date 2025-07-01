using Pictobox.Models;

public class UserProfileDto
{
    public string ProfilePic { get; set; } = default!;
    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Bio { get; set; } = default!;
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    public int PostsCount { get; set; }
    public List<Post> Posts { get; set; } = default!;
}
