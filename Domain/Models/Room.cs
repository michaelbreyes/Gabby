using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Geneca.Core.Interfaces;

namespace Geneca.Gabby.Domain.Models
{
	public class Room : IModel
	{
		public int Id { get; set; }

		[Required]
		public string Name { get; set; }

		[UIHint("DateAndTime")]
		public DateTime DateCreated { get; set; }

		[UIHint("DateAndTime")]
		public DateTime DateLastPost { get; set; }

		public List<Message> Messages { get; set; }

		public string Password { get; set; }
	}
}
