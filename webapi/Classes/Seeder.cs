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

    public async Task<IdentityResult> AddAdministrator()
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var scopedServiceProvider = scope.ServiceProvider;
            var userManager = scopedServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roles = ApplicationRoles.GetAllRoles();
            var user = new ApplicationUser
            {
                FirstName = "Administrator",
                LastName = "TicketSlave",
                Email = "sahul.krishan@windesheim.nl",
                EmailConfirmed = true,
                UserName = "sahul.krishan@windesheim.nl",
                LockoutEnabled = false,
                SecurityStamp = Guid.NewGuid().ToString(),
            };
            var userExists = await userManager.FindByNameAsync(user.Email);
            
            var assignRolesResult = await AssignRoles(_serviceProvider, user.UserName, roles);
            if (assignRolesResult != IdentityResult.Success) return assignRolesResult;
            
            if (userExists != null) return IdentityResult.Failed();
            
            var userCreationResult= await userManager.CreateAsync(user, "16SuperBanaanSorbets!");
            if (userCreationResult != IdentityResult.Success) return userCreationResult;
            
            return IdentityResult.Success;
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