using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pictobox.Data;
using Pictobox.Models;

public class AuthController : ControllerBase
{
    private readonly UserRepository _userRepository;
    private readonly JwtTokenService _tokenService;

    private readonly ILogger<AuthController> _logger;

    public AuthController(UserRepository userRepository, JwtTokenService tokenService, ILogger<AuthController> logger)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> loginAsync([FromBody] LoginRequest request)
    {
        _logger.LogInformation("Login attempt for email: {Email}", request.Email);

        var user = await _userRepository.GetByEmail(request.Email);

        if (user == null || !AuthUtility.VerifyPassword(request.Password, user.Password))
        {
            _logger.LogWarning("Login failed for email: {Email}", request.Email);
            return Unauthorized("Invalid credentials");
        }

        var token = _tokenService.GenerateToken(user);
        _logger.LogInformation("Login sucess - Token generated for userId: {UserId}", user.UserId);

        return Ok(new
        {
            token,
            user.UserId,
            user.Username
         });
    }

    [HttpPost("register")]
    public async Task<IActionResult> register([FromBody] RegisterRequest request)
    {
        if (await _userRepository.FindByEmail(request.Email))
        {
            _logger.LogWarning("Duplicate registration for email: {Email}", request.Email);
            return BadRequest("Email already exists");
        }

        if (await _userRepository.FindByUsername(request.Username))
        {
            _logger.LogWarning("Duplicate registration for username: {Username}", request.Username);
            return BadRequest("Username already exits.");
        }

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            Password = AuthUtility.EncryptPassword(request.Password),
            PhoneNumber = request.PhoneNumber
        };

        try
        {
            await _userRepository.Save(user);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogWarning(ex, "Database update failed during registration for email: {Email}", user.Email);
            return Conflict("A user with this email or username may already exist.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during registration for email: {Email}", user.Email);
            return StatusCode(500, "An unexpected error occurred.");
        }

        var token = _tokenService.GenerateToken(user);
        _logger.LogInformation("Registration success - Token generated for email: {Email}", user.Email);

        return Ok(new
        {
            token,
            user.UserId,
            user.Username
        });
    }
}