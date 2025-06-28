using System;
using System.Collections.Generic;

namespace Pictobox.Models;

public partial class Comment
{
    public int CommentId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime? CommentDate { get; set; }

    public int PostId { get; set; }

    public int UserId { get; set; }

    public virtual Post Post { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
