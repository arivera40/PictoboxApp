using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pictobox.Models;

namespace Pictobox.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Follow> Follows { get; set; }

    public virtual DbSet<Like> Likes { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PRIMARY");

            entity.ToTable("comments");

            entity.HasIndex(e => e.PostId, "post_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.CommentId).HasColumnName("comment_id");
            entity.Property(e => e.CommentDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("comment_date");
            entity.Property(e => e.Content)
                .HasMaxLength(150)
                .HasColumnName("content");
            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne<Post>()
                .WithMany(c => c.Comments)
                .HasForeignKey(p => p.PostId)
                .HasConstraintName("comments_ibfk_1");

            entity.HasOne(d => d.User)
                .WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("comments_ibfk_2");
        });

        modelBuilder.Entity<Follow>(entity =>
        {
            entity.HasKey(e => new { e.FollowerId, e.FolloweeId })
                .HasName("PRIMARY");

            entity.ToTable("follows");

            entity.HasIndex(e => e.FolloweeId, "followee_id");

            entity.Property(e => e.FollowerId).HasColumnName("follower_id");
            entity.Property(e => e.FolloweeId).HasColumnName("followee_id");
            entity.Property(e => e.FollowDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("follow_date");

            entity.HasOne<User>()
                .WithMany(u => u.FollowFollowees)
                .HasForeignKey(f => f.FollowerId)
                .HasConstraintName("follows_ibfk_1");

            entity.HasOne<User>()
                .WithMany(u => u.FollowFollowers)
                .HasForeignKey(f => f.FolloweeId)
                .HasConstraintName("follows_ibfk_2");
        });

        modelBuilder.Entity<Like>(entity =>
        {
            entity.HasKey(e => e.LikeId).HasName("PRIMARY");

            entity.ToTable("likes");

            entity.HasIndex(e => new { e.PostId, e.UserId }, "unique_like").IsUnique();

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.LikeId).HasColumnName("like_id");
            entity.Property(e => e.LikeDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("like_date");
            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Post).WithMany(p => p.LikesNavigation)
                .HasForeignKey(d => d.PostId)
                .HasConstraintName("likes_ibfk_1");

            entity.HasOne(d => d.User).WithMany(p => p.Likes)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("likes_ibfk_2");
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PRIMARY");

            entity.ToTable("posts");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.Caption)
                .HasMaxLength(150)
                .HasColumnName("caption");
            entity.Property(e => e.ImagePath)
                .HasMaxLength(255)
                .HasColumnName("image_path");
            entity.Property(e => e.Likes)
                .HasDefaultValueSql("'0'")
                .HasColumnName("likes");
            entity.Property(e => e.PostDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("post_date");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne<User>()
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .HasConstraintName("posts_ibfk_1");
        });


        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.Username, "username").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Bio)
                .HasMaxLength(150)
                .HasColumnName("bio");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("creation_date");
            entity.Property(e => e.Dob)
                .HasColumnType("datetime")
                .HasColumnName("dob");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Password)
                .HasMaxLength(200)
                .HasColumnName("password");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .HasColumnName("phone_number");
            entity.Property(e => e.ProfilePic)
                .HasMaxLength(255)
                .HasColumnName("profile_pic");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
