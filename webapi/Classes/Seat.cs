using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using webapi.Classes;

namespace TicketSlave.Classes
{
    public class Seat
    {

        [Key]
        [Required]
        public Guid Id { get; set; }
        public string Name {  get; set; }
        public string Zone {  get; set; }
        public string SeatNumber {  get; set; }
        public SeatType SeatType {  get; set; }
        [ForeignKey("Location")] public Guid LocationId {  get; set; }
        public Location Location {  get; set; }
        public int Capacity {  get; set; }
    }

    public enum SeatType
    {
        Regular,
        VIP,
        ReducedVisibilty,
        Accessible,
        StandingOnly
    }
}
