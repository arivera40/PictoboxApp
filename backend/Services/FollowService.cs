using Pictobox.Models;

public class FollowService
{
    private readonly FollowRepository _followRepository;

    public FollowService(FollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<bool> FollowUser(int followeeId, int followerId)
    {
        var follow = new Follow(followerId, followeeId);
        await _followRepository.Save(follow);

        return true;
    }
    public async Task<bool> UnfollowUser(int followeeId, int followerId)
    {
        await _followRepository.DeleteById(followeeId, followerId);

        return true;
    }
}