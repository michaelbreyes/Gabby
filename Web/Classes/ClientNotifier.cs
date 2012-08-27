using System.Collections.Generic;
using Geneca.Gabby.Domain.Models;

namespace Geneca.Gabby.Web.Classes
{
	public class ClientNotifier
	{
		#region Variables

		private readonly dynamic _clients;

		#endregion

		#region Constructors

		public ClientNotifier(dynamic clients)
		{
			_clients = clients;
		}

		#endregion

		#region Public Methods For All Callers

		public void UserJoinedRoom(string roomName, string userName)
		{
			_clients.UserJoinedRoom(roomName, userName);
		}

		public void UserLeftRoom(string roomName, string userName)
		{
			_clients.UserLeftRoom(roomName, userName);
		}

		public void ReceiveMessage(string roomName, Message message)
		{
			_clients.ReceiveMessage(message, roomName);
		}

		public void ResetRoomMessageCount(string roomName)
		{
			_clients.ResetRoomCount(roomName);
		}

		public void AddRoom(Room room)
		{
			_clients.AddRoom(room);
		}

		public void DrawStart(User user, string color, int thickness, int x, int y)
		{
			_clients[user.RoomIn].PartnerDrawStart(user.Name, color, thickness, x, y);
		}

		public void DrawMove(User user, int x, int y)
		{
			_clients[user.RoomIn].PartnerDrawMove(user.Name, x, y);
		}

		public void DrawEnd(User user)
		{
			_clients[user.RoomIn].PartnerDrawEnd(user.Name);
		}

		public void DrawClear(User user)
		{
			_clients[user.RoomIn].PartnerDrawClear(user.Name);
		}

		#endregion

		#region Public Methods For Current Caller

		public void SetContextIdOnCaller(dynamic caller, string clientId)
		{
			caller.SetContextId(clientId);
		}

		public void DisplayUsersToCaller(dynamic caller, List<User> users)
		{
			caller.DisplayUsers(users);
		}

		public void DisplayRoomMessagesToCaller(dynamic caller, List<Message> messages)
		{
			caller.DisplayRoomMessages(messages);
		}

		public void DisplayAllRoomsToCaller(dynamic caller, List<Room> rooms)
		{
			caller.DisplayAllActiveRooms(rooms);
		}

		public void LogCallerIn(dynamic caller)
		{
			caller.LoginCallBack();
		}

		public void LogoutClick(dynamic caller)
		{
			caller.LogoutClick();
		}

		#endregion
	}
}