using System;
using System.Collections.Generic;

namespace Pictobox.Models;

public partial class Follow
{
    public int FollowerId { get; set; }

    public int FolloweeId { get; set; }

    public DateTime? FollowDate { get; set; }

    public Follow(int followerId, int followeeId)
    {
        FollowerId = followerId;
        FolloweeId = followeeId;
    }
}
