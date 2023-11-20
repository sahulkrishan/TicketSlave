using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class ApplicationUserAddProperty_AccepedTerms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReservationSessions_AspNetUsers_ReservedById",
                table: "ReservationSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AspNetUsers_UserId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_UserId",
                table: "Tickets");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Tickets",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "ReservedById",
                table: "ReservationSessions",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AcceptedTerms",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateAcceptedTerms",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_ApplicationUserId",
                table: "Tickets",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationSessions_AspNetUsers_ReservedById",
                table: "ReservationSessions",
                column: "ReservedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AspNetUsers_ApplicationUserId",
                table: "Tickets",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReservationSessions_AspNetUsers_ReservedById",
                table: "ReservationSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AspNetUsers_ApplicationUserId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_ApplicationUserId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "AcceptedTerms",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DateAcceptedTerms",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "ReservedById",
                table: "ReservationSessions",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_UserId",
                table: "Tickets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationSessions_AspNetUsers_ReservedById",
                table: "ReservationSessions",
                column: "ReservedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AspNetUsers_UserId",
                table: "Tickets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
