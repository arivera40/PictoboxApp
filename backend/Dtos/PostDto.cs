using Pictobox.Models;

public class PostDto
{
    public int PostId { get; set; }
    public int UserId { get; set; }
    public string Caption { get; set; } = null!;
    public string ImagePath { get; set; } = null!;
    public int? Likes { get; set; }
    public DateTime? PostDate { get; set; }
    public List<CommentDto> Comments { get; set; } = new List<CommentDto>();
}
