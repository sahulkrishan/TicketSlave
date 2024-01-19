using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class ClassUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReservationSessions_EventSeats_EventSeatId",
                table: "ReservationSessions");

            migrationBuilder.DropIndex(
                name: "IX_ReservationSessions_EventSeatId",
                table: "ReservationSessions");

            migrationBuilder.DropIndex(
                name: "IX_ReservationSessions_ReservedById",
                table: "ReservationSessions");

            migrationBuilder.DropColumn(
                name: "EventSeatId",
                table: "ReservationSessions");

            migrationBuilder.AddColumn<Guid>(
                name: "ReservationSessionId",
                table: "EventSeats",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PresaleCode",
                table: "Events",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationSessions_ReservedById",
                table: "ReservationSessions",
                column: "ReservedById",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventSeats_ReservationSessionId",
                table: "EventSeats",
                column: "ReservationSessionId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventSeats_ReservationSessions_ReservationSessionId",
                table: "EventSeats",
                column: "ReservationSessionId",
                principalTable: "ReservationSessions",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventSeats_ReservationSessions_ReservationSessionId",
                table: "EventSeats");

            migrationBuilder.DropIndex(
                name: "IX_ReservationSessions_ReservedById",
                table: "ReservationSessions");

            migrationBuilder.DropIndex(
                name: "IX_EventSeats_ReservationSessionId",
                table: "EventSeats");

            migrationBuilder.DropColumn(
                name: "ReservationSessionId",
                table: "EventSeats");

            migrationBuilder.AddColumn<Guid>(
                name: "EventSeatId",
                table: "ReservationSessions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<string>(
                name: "PresaleCode",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReservationSessions_EventSeatId",
                table: "ReservationSessions",
                column: "EventSeatId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationSessions_ReservedById",
                table: "ReservationSessions",
                column: "ReservedById");

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationSessions_EventSeats_EventSeatId",
                table: "ReservationSessions",
                column: "EventSeatId",
                principalTable: "EventSeats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
