using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class secondMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("42d4ce1f-0882-4d6a-84fa-183e7cdb54fa"));

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("eb2b1147-9611-4b9f-8f0c-37ff2e9ea13b"));

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "CreatedAt", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "280ec6f9-c7b5-40f0-aa45-3aa091723e11", 0, "0f14a92c-0b11-4e6f-af5a-81c29df5db58", new DateTime(2023, 11, 15, 15, 30, 1, 657, DateTimeKind.Utc).AddTicks(9712), "voorbeeld@email.com", false, "Voornaam", "Achternaam", false, null, null, null, null, null, false, "431f802e-a940-4585-af2e-49ea8afef066", false, "gebruikersnaam" });

            migrationBuilder.InsertData(
                table: "Locations",
                columns: new[] { "Id", "Address", "City", "Country", "EmailAddress", "Name", "PhoneNumber", "PostalCode", "Website" },
                values: new object[] { new Guid("15afbbbf-2236-40c2-9b60-ebe00bdba3eb"), "Voorbeeldstraat 123", "Voorbeeldstad", "Voorbeeldland", "voorbeeld@example.com", "Voorbeeldlocatie", "123-456-7890", "12345", "www.voorbeeldwebsite.com" });

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "Description", "EventEndAt", "EventStartAt", "ImageUrls", "LocationId", "PresaleEndAt", "PresalePasswordHash", "PresaleStartAt", "SaleEndAt", "SaleStartAt", "Title", "Visibility" },
                values: new object[] { new Guid("ddf81e62-9b9b-493a-8de7-05b1426cd2b1"), new DateTime(2023, 11, 15, 15, 30, 1, 657, DateTimeKind.Utc).AddTicks(9764), new Guid("280ec6f9-c7b5-40f0-aa45-3aa091723e11"), "Description for Sample Event 1", new DateTime(2023, 11, 23, 15, 30, 1, 657, DateTimeKind.Utc).AddTicks(9777), new DateTime(2023, 11, 22, 15, 30, 1, 657, DateTimeKind.Utc).AddTicks(9771), new List<string> { "url1", "url2" }, new Guid("15afbbbf-2236-40c2-9b60-ebe00bdba3eb"), new DateTime(2023, 11, 15, 15, 30, 1, 657, DateTimeKind.Utc).AddTicks(9780), new DateTime(2023, 11, 15, 15, 30, 1, 657, DateTimeKind.Utc).AddTicks(9780), new DateTime(2023, 11, 14, 15, 30, 1, 657, DateTimeKind.Utc).AddTicks(9779), new DateTime(2023, 11, 21, 15, 30, 1, 657, DateTimeKind.Utc).AddTicks(9778), new DateTime(2023, 11, 15, 15, 30, 1, 657, DateTimeKind.Utc).AddTicks(9778), "Sample Event 1", 0 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "280ec6f9-c7b5-40f0-aa45-3aa091723e11");

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("ddf81e62-9b9b-493a-8de7-05b1426cd2b1"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("15afbbbf-2236-40c2-9b60-ebe00bdba3eb"));

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "Description", "EventEndAt", "EventStartAt", "ImageUrls", "LocationId", "PresaleEndAt", "PresalePasswordHash", "PresaleStartAt", "SaleEndAt", "SaleStartAt", "Title", "Visibility" },
                values: new object[,]
                {
                    { new Guid("42d4ce1f-0882-4d6a-84fa-183e7cdb54fa"), new DateTime(2023, 11, 15, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5141), new Guid("00000000-0000-0000-0000-000000000000"), "shimmel shammel trimmel tramml anfa kjfekjbfskhbfks b", new DateTime(2023, 12, 29, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5142), new DateTime(2023, 12, 28, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5142), new List<string> { "https://th.bing.com/th/id/OIP.JPllmkWBqX_ALvUO_DAnZwHaE7?pid=ImgDet&rs=1" }, new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2023, 11, 20, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5144), new DateTime(2023, 11, 20, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5144), new DateTime(2023, 11, 18, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5143), new DateTime(2023, 12, 18, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5143), new DateTime(2023, 11, 28, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5142), "Test event", 0 },
                    { new Guid("eb2b1147-9611-4b9f-8f0c-37ff2e9ea13b"), new DateTime(2023, 11, 15, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5125), new Guid("00000000-0000-0000-0000-000000000000"), "shimmel shammel trimmel tramml anfa kjfekjbfskhbfks b", new DateTime(2024, 1, 1, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5131), new DateTime(2023, 12, 30, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5128), new List<string> { "https://th.bing.com/th/id/OIP.JPllmkWBqX_ALvUO_DAnZwHaE7?pid=ImgDet&rs=1" }, new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2023, 11, 27, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5133), new DateTime(2023, 11, 19, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5134), new DateTime(2023, 11, 23, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5133), new DateTime(2023, 12, 23, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5132), new DateTime(2023, 11, 30, 14, 58, 27, 935, DateTimeKind.Utc).AddTicks(5132), "Test event", 0 }
                });
        }
    }
}
