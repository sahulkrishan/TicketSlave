using Microsoft.AspNetCore.Identity;

namespace webapi.Classes;

public class Seeder
{
    private readonly IServiceProvider _serviceProvider;

    public Seeder(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }
    
    public async void AddRoles()
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var scopedServiceProvider = scope.ServiceProvider;
           var roleManager = scopedServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
      
            var roles = ApplicationRoles.GetAllRoles();
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }

        public async Task AddTestUsers()
        {
            using var scope = _serviceProvider.CreateScope();
            var scopedServiceProvider = scope.ServiceProvider;
            var userManager = scopedServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var allRoles = ApplicationRoles.GetAllRoles();
            var userRole = new [] { ApplicationRoles.User };
            var adminUser = new ApplicationUser
            {
                FirstName = "Admin",
                LastName = "TicketSlave",
                Email = "admin@example.com",
                EmailConfirmed = true,
                UserName = "admin@example.com",
                LockoutEnabled = false,
                SecurityStamp = Guid.NewGuid().ToString(),
            };
            var user = new ApplicationUser
            {
                FirstName = "User",
                LastName = "TicketSlave",
                Email = "user@example.com",
                EmailConfirmed = true,
                UserName = "user@example.com",
                LockoutEnabled = false,
                SecurityStamp = Guid.NewGuid().ToString(),
            };
            var lockedUser = new ApplicationUser
            {
                FirstName = "LockedUser",
                LastName = "TicketSlave",
                Email = "locked@example.com",
                EmailConfirmed = true,
                UserName = "locked@example.com",
                LockoutEnd = DateTime.MaxValue.ToUniversalTime(),
                LockoutEnabled = true,
                SecurityStamp = Guid.NewGuid().ToString(),
            };
            var unverifiedUser = new ApplicationUser
            {
                FirstName = "UnverifiedUser",
                LastName = "TicketSlave",
                Email = "unverified@example.com",
                EmailConfirmed = false,
                UserName = "unverified@example.com",
                LockoutEnabled = false,
                SecurityStamp = Guid.NewGuid().ToString(),
            };
            // Check if users already exist
            var adminExists = await userManager.FindByNameAsync(adminUser.Email);
            var userExists = await userManager.FindByNameAsync(user.Email);
            var lockedUserExists = await userManager.FindByNameAsync(lockedUser.Email);
            var unverifiedUserExists = await userManager.FindByNameAsync(unverifiedUser.Email);
            const string password = "TestPassword123!";
            // Create users if they do not exist
            if (adminExists == null)
            {
                await userManager.CreateAsync(adminUser, password);
                await AssignRoles(_serviceProvider, adminUser.UserName, allRoles);
            }

            if (userExists == null)
            {
                await userManager.CreateAsync(user, password);
                await AssignRoles(_serviceProvider, user.UserName, userRole);
            }

            if (lockedUserExists == null)
            {
                await userManager.CreateAsync(lockedUser, password);
                // Add roles for lockedUser if needed
                await AssignRoles(_serviceProvider, lockedUser.UserName, userRole);
            }

            if (unverifiedUserExists == null)
            {
                await userManager.CreateAsync(unverifiedUser, password);
                // Add roles for unverifiedUser if needed
                await AssignRoles(_serviceProvider, unverifiedUser.UserName, userRole);
            }
        }
    
    private static async Task<IdentityResult> AssignRoles(IServiceProvider services, string userName, string[] roles)
    {
        using (var scope = services.CreateScope())
        {
            var scopedServiceProvider = scope.ServiceProvider;
            var userManager = scopedServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
      
            var user = await userManager.FindByNameAsync(userName);
            if (user == null) return IdentityResult.Failed();
            var result = await userManager.AddToRolesAsync(user, roles);
            return result;
        }
    }
}