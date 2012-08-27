using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using Geneca.Gabby.Domain.Managers;
using Geneca.Gabby.Domain.Models;
using SignalR.Hubs;

namespace Geneca.Gabby.Web.Classes
{
	[HubName("sitehub")]
	public class SiteHub : Hub, IDisconnect
	{
		#region Properties

		private string CurrentConnectionId
		{
			get { return Context != null ? Context.ClientId : "0"; }
		}

		private ClientNotifier _clientNotifier;
		private ClientNotifier ClientNotifier
		{
			get { return _clientNotifier ?? (_clientNotifier = new ClientNotifier(this.Clients)); }
		}

		private UserManager _userManager;
		private UserManager UserManager
		{
			get { return _userManager ?? (_userManager = new UserManager()); }
		}


		#endregion

		#region Public Methods

		public bool Login(string userName)
		{
			if (string.IsNullOrEmpty(userName) || UsernameInUse(userName)) return false;

			UserManager.AddNewUser(userName.ToLower(), this.CurrentConnectionId);
			ClientNotifier.SetContextIdOnCaller(this.Caller, this.CurrentConnectionId);

			return true;
		}

		public bool UsernameInUse(string userName)
		{
			return UserManager.UsernameInUse(userName);
		}

		public bool CheckPassword(string roomName, string userName, string password)
		{
			var user = GetUser(userName);
			if (user == null) return false;

			var room = DatabaseManager.GetRoom(roomName, password);
			if (room == null) return false;

			if (!user.RoomsWatching.Contains(roomName))
			{
				user.RoomsWatching.Add(roomName);
				user.WatchingPasswords.Add(password);
			}

			return true;
		}

		public bool WatchRoom(string roomName, string userName)
		{
			var user = GetUser(userName);
			if (user == null) return false;

			if (!user.RoomsWatching.Contains(roomName))
			{
				user.RoomsWatching.Add(roomName);
				user.WatchingPasswords.Add("");
			}

			return true;
		}

		public bool EnterRoom(string roomName, string userName)
		{
			var user = GetUser(userName);
			if (user == null) return false;

			if (!string.IsNullOrEmpty(user.RoomIn))
			{
				LeaveRoom(user.RoomIn, userName);
			}

			var password = GetRoomPasswordForUser(user, roomName);

			UserManager.SetRoomForUser(userName, roomName, password);
			this.AddToGroup(roomName); // Track group in SignalR
			ClientNotifier.UserJoinedRoom(roomName, userName);
			ClientNotifier.ResetRoomMessageCount(roomName);

			var messages = DatabaseManager.GetMessages(roomName, password) ?? new List<Message>();
			ClientNotifier.DisplayRoomMessagesToCaller(this.Caller, messages);

			return true;
		}

		public void DisplayUserList()
		{
			var users = UserManager.GetUsers();
			if (users.Count == 0) return;

			ClientNotifier.DisplayUsersToCaller(this.Caller, users);
		}

		public void RelayMessage(string userName, string roomName, Message message)
		{
			var user = GetUser(userName);
			if (user == null) return;

			var newMessage = new Message(ParseMessage(message.Content), message.UserId, message.GravatarLink);
			var password = GetRoomPasswordForUser(user, roomName);

			ClientNotifier.ReceiveMessage(roomName, message);
			DatabaseManager.AddMessage(newMessage, roomName, password);
		}

		public GabbyRoomModel GetAllActiveGabbyRoomModels()
		{
			var rooms = DatabaseManager.GetAllActiveRooms() ?? new List<Room>();
			var users = UserManager.GetUsers() ?? new List<User>();
			foreach (var r in rooms.Where(r => !string.IsNullOrEmpty(r.Password)))
			{
				r.Password = "yes";
			}

			return new GabbyRoomModel(rooms, users);
		}

		public void AddRoom(string roomName, string password = "")
		{
			var room = DatabaseManager.GetRoom(roomName, password);
			if (room == null || !DatabaseManager.SaveRoom(room)) return;

			if (!string.IsNullOrEmpty(room.Password))
			{
				room.Password = "yes";
			}

			ClientNotifier.AddRoom(room);
		}

		public void Remove(string connectionId)
		{
			var user = UserManager.RemoveUserByConnectionId(connectionId);
			if (user == null) return;

			LeaveRoom(user.RoomIn, user.Name);
		}

		public void Logout()
		{
			ClientNotifier.LogoutClick(this.Caller);
		}

		#endregion

		#region Draw Methods

		public void DrawStart(string userName, string color, int thickness, int x, int y)
		{
			var user = GetUser(userName);
			if (user == null) return;

			ClientNotifier.DrawStart(user, color, thickness, x, y);
		}

		public void DrawMove(string userName, int x, int y)
		{
			var user = GetUser(userName);
			if (user == null) return;

			ClientNotifier.DrawMove(user, x, y);
		}

		public void DrawEnd(string userName)
		{
			var user = GetUser(userName);
			if (user == null) return;

			ClientNotifier.DrawEnd(user);
		}

		public void DrawClear(string userName)
		{
			var user = GetUser(userName);
			if (user == null) return;

			ClientNotifier.DrawClear(user);
		}

		#endregion

		#region Private Functions

		public string ParseMessage(string message)
		{
			var escaped = ConfigurationManager.AppSettings["htmlEnabled"] == "true";
			var left = escaped ? "{{" : "%7B%7B";
			var right = escaped ? "}}" : "%7D%7D";
			var strippedMessage = message;
			var start = strippedMessage.IndexOf(left);

			while (start != -1)
			{
				var end = strippedMessage.IndexOf(right, start);
				if (end > start)
				{
					strippedMessage = strippedMessage.Substring(0, start) + strippedMessage.Substring(end + right.Length);
				}
				start = strippedMessage.IndexOf(left);
			}

			return strippedMessage;
		}

		private User GetUser(string userName)
		{
			if (!UsernameInUse(userName)) return null;

			var user = UserManager.GetUser(userName);
			if (user == null)
			{
				Logout();
				return null;
			}

			return user;
		}

		private string GetRoomPasswordForUser(User user, string roomName)
		{
			var index = user.RoomsWatching.IndexOf(roomName);
			return index >= 0 ? user.WatchingPasswords[index] : "";
		}

		private void LeaveRoom(string roomName, string userName)
		{
			ClientNotifier.UserLeftRoom(roomName, userName);
			this.RemoveFromGroup(roomName);
		}

		#endregion

		#region Events

		public void Disconnect()
		{
			Remove(this.CurrentConnectionId);
		}

		#endregion
	}
}
