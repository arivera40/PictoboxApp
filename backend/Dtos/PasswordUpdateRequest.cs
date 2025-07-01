using System.ComponentModel.DataAnnotations;

public class PasswordUpdateRequest
{
    [Required]
    public string CurrentPassword { get; set; }

    [Required]
    public string NewPassword { get; set; }
}