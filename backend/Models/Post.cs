using System;
using System.Collections.Generic;

namespace Pictobox.Models;

public partial class Post
{
    public int PostId { get; set; }

    public string Caption { get; set; } = null!;

    public int? Likes { get; set; }

    public DateTime? PostDate { get; set; }

    public int UserId { get; set; }

    public string ImagePath { get; set; } = null!;

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Like> LikesNavigation { get; set; } = new List<Like>();

    public virtual User User { get; set; } = null!;

    public Post(int userId, string imagePath, string caption)
    {
        UserId = userId;
        ImagePath = imagePath;
        Caption = caption;
    }
}
