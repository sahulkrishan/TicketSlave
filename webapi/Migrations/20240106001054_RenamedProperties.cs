using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class RenamedProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReserveredUntil",
                table: "ReservationSessions",
                newName: "ReservedUntil");

            migrationBuilder.AddColumn<string>(
                name: "StripeSessionId",
                table: "ReservationSessions",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StripeSessionId",
                table: "ReservationSessions");

            migrationBuilder.RenameColumn(
                name: "ReservedUntil",
                table: "ReservationSessions",
                newName: "ReserveredUntil");
        }
    }
}
