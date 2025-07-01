using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Pictobox.Models;

public class JwtTokenService
{
    private readonly IConfiguration _config;

    public JwtTokenService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
        };

        var key = new SymmetricSecurityKey(Convert.FromBase64String(_config["Jwt:Key"]));
        // var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("L+KJH5OiWN1Y8vRiJjlnFAyxmp3wKGhAFrmKVV6DGq//MsN9P7HihQMIxTYZya1d4ggwLTfabn88uMrJ41bNRw=="));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            // expires: DateTime.Now.AddMinutes(int.Parse(_config["Jwt:ExpiresInMinutes"])),
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}