using System.ComponentModel.DataAnnotations;

public class ProfileUpdateRequest
{
    [Required]
    public string Username { get; set; }

    [Required]
    public string Email { get; set; }

    public string PhoneNumber { get; set; } = "";

    public string Bio { get; set; } = "";
}