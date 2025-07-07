using Microsoft.EntityFrameworkCore;
using Pictobox.Data;
using Pictobox.Models;

public class FollowRepository : IFollowRepository
{
    private readonly ApplicationDbContext _db;

    public FollowRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Follow> Save(Follow follow)
    {
        _db.Follows.Add(follow);
        await _db.SaveChangesAsync();
        return follow;
    }

    public async Task DeleteById(int followeeId, int followerId) =>
        await _db.Follows
            .Where(f => f.FolloweeId == followeeId && f.FollowerId == followerId)
            .ExecuteDeleteAsync();

}