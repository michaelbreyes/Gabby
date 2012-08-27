using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;

namespace Geneca.Gabby.Domain.Managers
{
	public class AdministrationManager
	{
		public bool LoginAdmin(string password)
		{
			var hashedPassword = GetHash(password);
			var hashedAnswer = Constants.HashedAdminPassword;
			return (hashedPassword == hashedAnswer);
		}

		public string GetHash(string password)
		{
			string salt = "GottaCatchEmAll981234Pokemon";
			password = password + salt;
			HashAlgorithm hasher = new SHA256CryptoServiceProvider();
			byte[] bytValue = System.Text.Encoding.UTF8.GetBytes(password);
			byte[] bytHash = hasher.ComputeHash(bytValue);
			return Convert.ToBase64String(bytHash);
		}
	}
}
