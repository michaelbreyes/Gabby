using System;
using System.Collections.Generic;
using System.Linq;
using Geneca.Gabby.Domain.Models;

namespace Geneca.Gabby.Domain.Managers
{
	public class UserManager
	{
		#region Variables

		private static readonly Dictionary<string, User> _users = new Dictionary<string, User>(StringComparer.OrdinalIgnoreCase);

		#endregion

		#region Public Methods

		public void AddNewUser(string userName, string connectionId)
		{
			var user = new User
						{
							Name = userName,
							RoomIn = "",
							ConnectionId = connectionId,
							RoomsWatching = new List<string>(),
                            WatchingPasswords = new List<string>()
						};

			_users.Add(userName, user);
		}

		public bool UsernameInUse(string userName)
		{
			return _users.ContainsKey(userName);
		}

		public void SetRoomForUser(string userName, string roomCode, string password)
		{
			_users[userName].RoomIn = roomCode;
            _users[userName].Password = password;
		}

		public User GetUser(string userName)
		{
			try
			{
				return _users[userName];
			}
			catch (KeyNotFoundException e)
			{
				return null;
			}
		}

		public List<User> GetUsers()
		{
			return _users.Values.ToList();
		}

		public User RemoveUserByConnectionId(string connectionId)
		{
			var user = _users.Values.FirstOrDefault(u => u.ConnectionId == connectionId);
			if (user == null) return null;

			_users.Remove(user.Name);

			return user;
		}

		#endregion
	}
}
