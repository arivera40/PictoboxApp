public class CommentDto
{
    public int CommentId { get; set; }
    public string Content { get; set; } = "";
    public DateTime? CommentDate { get; set; }
    public int UserId { get; set; }
    public string ProfilePic { get; set; } = "";
    public string Username { get; set; } = "";
}