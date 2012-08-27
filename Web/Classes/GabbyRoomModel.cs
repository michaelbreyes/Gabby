using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Geneca.Gabby.Domain.Models;

namespace Geneca.Gabby.Web.Classes
{
	public class GabbyRoomModel
	{
		public List<Room> Rooms { get; set; }
		public List<User> Users { get; set; }

		public GabbyRoomModel(List<Room> rooms, List<User> users)
		{
			this.Rooms = rooms ?? new List<Room>();
			this.Users = users ?? new List<User>();
		}
	}
}