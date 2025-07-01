public static class AuthUtility
{
    public static bool VerifyPassword(string raw, string hashed)
    {
        return BCrypt.Net.BCrypt.Verify(raw, hashed);
    }

    public static string EncryptPassword(string raw)
    {
        return BCrypt.Net.BCrypt.HashPassword(raw);
    }
}