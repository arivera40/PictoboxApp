using Pictobox.Models;

public class PostDto
{
    public int PostId { get; set; }
    public string Caption { get; set; } = null!;
    public int? Likes { get; set; }
    public DateTime? PostDate { get; set; }
    public List<Post> Posts { get; set; }
}
