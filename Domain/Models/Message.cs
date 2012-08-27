using System;

namespace Geneca.Gabby.Domain.Models
{
	public class Message
	{
		public string Content { get; set; }
		public string UserId { get; set; }
		public string GravatarLink { get; set; }
		public DateTime DatePosted { get; private set; }

		public Message(string content, string userId, string gravatarLink)
		{
			Content = content;
			UserId = userId;
			GravatarLink = gravatarLink;
			DatePosted = DateTime.Now;
		}

		public Message() //required for signalr
		{
			DatePosted = DateTime.Now;
		}
	}
}
