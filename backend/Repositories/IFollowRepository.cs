using Pictobox.Models;

public interface IFollowRepository
{
    Task<Follow> Save(Follow follow);

    Task DeleteById(int followeeId, int followerId);
}