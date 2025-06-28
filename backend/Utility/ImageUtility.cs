public static class ImageUtility
{
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB

    public static void ValidateImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("No file uploaded.");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new InvalidOperationException("Unsupported image format. Allowed: .jpg, .jpeg, .png, .gif");

        if (file.Length > MaxFileSizeBytes)
            throw new InvalidOperationException("File too large. Maximum allowed size is 5MB.");
    }
    public static async Task<string> SaveImageAsync(IFormFile file, string folderPath)
    {
        var fileName = GenerateUniqueFileName(file.FileName);
        var fullPath = Path.Combine(folderPath, fileName);

        Directory.CreateDirectory(folderPath);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"http://localhost:5193/uploads/{fileName}";
    }
    public static string GenerateUniqueFileName(string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName);
        var uniqueName = $"{Guid.NewGuid()}{extension}";
        return uniqueName;
    }
}