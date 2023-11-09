using System.ComponentModel.DataAnnotations;

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
        public ICollection<SeatType> SeatType {  get; set; }
        public Guid LocationId {  get; set; }
        public Location Location {  get; set; }
        public int MaxCapacity {  get; set; }
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
