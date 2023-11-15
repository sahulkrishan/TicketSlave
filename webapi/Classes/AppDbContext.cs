using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TicketSlave.Classes;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace webapi.Classes
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Event> Events { get; set; }
        public DbSet<EventSeat> EventSeats { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<ReservationSession> ReservationSessions { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            var user = new User
            {
                Id = Guid.NewGuid().ToString(), // Genereer een nieuwe unieke ID als string
                UserName = "gebruikersnaam", // Geef een gebruikersnaam op
                Email = "voorbeeld@email.com", // Voeg een e-mailadres toe
                FirstName = "Voornaam",
                LastName = "Achternaam",
                CreatedAt = DateTime.UtcNow // Stel de datum/tijd van aanmaak in op huidige UTC-tijd
            };
            var location = new Location
            {
                Id = Guid.NewGuid(), // Genereer een nieuwe unieke GUID
                Name = "Voorbeeldlocatie",
                Address = "Voorbeeldstraat 123",
                City = "Voorbeeldstad",
                PostalCode = "12345",
                Country = "Voorbeeldland",
                Website = "www.voorbeeldwebsite.com",
                PhoneNumber = "123-456-7890",
                EmailAddress = "voorbeeld@example.com"
            };
            var event1 = new Event
            {
                Id = Guid.NewGuid(),
                Title = "Sample Event 1",
                Description = "Description for Sample Event 1",
                LocationId = location.Id, // Replace with an actual Location Id
                CreatedBy = Guid.Parse(user.Id), // Replace with an actual User Id
                CreatedAt = DateTime.UtcNow,
                ImageUrls = new List<string>
         {
             "url1", "url2" // Replace with actual image URLs
         },
                EventStartAt = DateTime.UtcNow.AddDays(7),
                EventEndAt = DateTime.UtcNow.AddDays(8),
                SaleStartAt = DateTime.UtcNow,
                SaleEndAt = DateTime.UtcNow.AddDays(6),
                PresaleStartAt = DateTime.UtcNow.AddDays(-1),
                PresaleEndAt = DateTime.UtcNow,
                PresalePasswordHash = DateTime.UtcNow,
                Visibility = Visibility.Visible // Change visibility as needed
            };
            modelBuilder.Entity<User>().HasData(user);
            modelBuilder.Entity<Location>().HasData(location);
            modelBuilder.Entity<Event>().HasData(event1);
        }
    }
}
