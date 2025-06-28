using Microsoft.AspNetCore.Mvc;

public class CreatePostRequest
{
    [FromForm(Name = "image")]
    public IFormFile ImageFile { get; set; }

    [FromForm(Name = "caption")]
    public string Caption { get; set; }
}
