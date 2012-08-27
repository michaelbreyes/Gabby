using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using Geneca.Gabby.Data.Repositories;
using Geneca.Gabby.Domain.Models;

namespace Geneca.Gabby.Domain.Managers
{
	public class DatabaseManager
	{
		private static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["MongoDB"].ConnectionString;

		public static bool AddMessage(Message message, string roomName, string password)
		{
			Room room = GetRoom(roomName, password);
			if (room == null)
			{
				return false;
			}

			List<Message> messages = room.Messages ?? new List<Message>();
			messages.Insert(0, message);

			while (messages.Count > Constants.MaximumMessageInDatabase)
			{
				Message poppedMessage = messages.ElementAt(Constants.MaximumMessageInDatabase);
				messages.RemoveAt(Constants.MaximumMessageInDatabase);
				ArchiveMessage(poppedMessage, roomName);
			}

			room.Messages = messages;
			room.DateLastPost = DateTime.Now;
			return SaveRoom(room);
		}

		private static void ArchiveMessage(Message message, string roomName)
		{
			//Haha we don't archive stuff. Your data has been lost.
		}

		public static bool SaveRoom(Room room)
		{
			if (VerifyRoom(room))
			{
				var mongoRepository = new MongoRepository<Room>(ConnectionString);
				mongoRepository.Save(room);
				return true;
			}
			return false;
		}

		private static bool VerifyRoom(Room room)
		{
			return !String.IsNullOrEmpty(room.Name);
		}

		public static void DeleteRoom(Room room)
		{
			var mongoRepository = new MongoRepository<Room>(ConnectionString);
			mongoRepository.Delete(room);
		}

		/// <summary>
		/// Returns the room based on the name, a new room if it doesn't exist, or null if the password is wrong
		/// </summary>
		/// <param name="roomName"></param>
		/// <param name="password"></param>
		/// <returns></returns>
		public static Room GetRoom(string roomName, string password)
		{
			var mongoRepository = new MongoRepository<Room>(ConnectionString);

			Room room = mongoRepository.SingleOrDefault(r => r.Name == roomName);
			if (room == null)
			{
				room = new Room { Name = roomName, Password = password, DateCreated = DateTime.Now };
			}
			else if (room.Password != password)
			{
				room = null;
			}

			return room;
		}

        public static Room GetRoomAdmin(string roomName)
        {
            var mongoRepository = new MongoRepository<Room>(ConnectionString);

            Room room = mongoRepository.SingleOrDefault(r => r.Name == roomName);

            return room;
        }

		public static List<Room> GetAllRooms()
		{
			var mongoRepository = new MongoRepository<Room>(ConnectionString);
			return mongoRepository.All().ToList();
		}

		public static List<Room> GetAllActiveRooms()
		{
			var mongoRepository = new MongoRepository<Room>(ConnectionString);
			var oldestDate = DateTime.Now.Subtract(Constants.ActiveRoomTimeSpan);

			var x = mongoRepository.All();
			var y = x.Where(r => r.DateLastPost >= oldestDate).ToList();

			return mongoRepository.All().Where(r => r.DateLastPost >= oldestDate).ToList();
		}

		public static List<Message> GetMessages(string roomName, string password)
		{
			var room = GetRoom(roomName, password);
			return room == null ? new List<Message>() : GetRoom(roomName, password).Messages;
		}

	}
}
