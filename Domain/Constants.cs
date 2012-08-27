using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Geneca.Gabby.Domain
{
	public static class Constants
	{
		public const string HashedAdminPassword = "pKalA4vZFZ2Ug3RSGMZlZ22qYh+pA8eyCFgm0tEWn4M=";
		public const string AdminPasswordErrorMessage = "Sorry, the password is incorrect.";
		public const int MaximumMessageInDatabase = 50;
        public static readonly TimeSpan ActiveRoomTimeSpan = new TimeSpan(7, 0, 0, 0);
	}
}
