using System.Collections.Generic;

namespace Geneca.Gabby.Domain.Models
{
	public class User
	{
		public string ConnectionId { get; set; }
		public string Id { get; set; }
		public string Name { get; set; }
		public string RoomIn { get; set; }
        public string Password { get; set; }
		public List<string> RoomsWatching { get; set; }
        public List<string> WatchingPasswords { get; set; }
	}
}
