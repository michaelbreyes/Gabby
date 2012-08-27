using System;
using System.Linq;
using System.Linq.Expressions;
using Geneca.Core.Interfaces;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using MongoDB.Driver.Builders;

namespace Geneca.Gabby.Data.Repositories
{
	public class MongoRepository<T> : IRepository<T>
		where T : IModel
	{
		#region Variables

		private readonly string _connectionString;

		#endregion

		#region Properties

		private string DatabaseName
		{
			get
			{
				var index = _connectionString.LastIndexOf("/", StringComparison.Ordinal);

				return _connectionString.Substring(index + 1, _connectionString.Length - (index + 1));
			}
		}

		private static string CollectionName
		{
			get
			{
				var col = typeof(T).ToString();
				var index = col.LastIndexOf(".", StringComparison.Ordinal);

				return col.Substring(index + 1, col.Length - (index + 1));
			}
		}

		#endregion

		#region Constructors

		public MongoRepository(string connectionString)
		{
			_connectionString = connectionString;
		}

		#endregion

		#region Interface Implementation

		public IQueryable<T> All()
		{
			return Read(collection => collection).AsQueryable();
		}

		public T SingleOrDefault(Expression<Func<T, bool>> query)
		{
			return All().SingleOrDefault(query);
		}

		public void Save(T model)
		{
			if (model.Id == 0) model.Id = NextId();

			Write(collection => collection.Save(model));
		}

		public void Delete(T model)
		{
			var query = Query.EQ("_id", model.Id);

			Write(collection => collection.Remove(query));
		}

		#endregion

		#region Private Methods

		private MongoServer GetConnection()
		{
			return MongoServer.Create(_connectionString);
		}

		private int NextId()
		{
			/* original line, blew up for some reason.
			 * var max = All().Any() ? All().Max(i => i.Id) : 0;
			 */

			var max = All().Any() ? All().ToList().Max(i => i.Id) : 0;
			return (max + 1);
		}

		private MongoCollection<T> Read(Func<MongoCollection<T>, MongoCollection<T>> action)
		{
			var server = GetConnection();
			var database = server.GetDatabase(DatabaseName);
			var collection = database.GetCollection<T>(CollectionName);

			using (server.RequestStart(database))
			{
				return action(collection);
			}
		}

		private void Write(Action<MongoCollection> action)
		{
			var server = GetConnection();
			var database = server.GetDatabase(DatabaseName);
			var collection = database.GetCollection<T>(CollectionName);

			using (server.RequestStart(database))
			{
				action(collection);
			}
		}

		#endregion

		public void Dispose()
		{
			throw new NotImplementedException();
		}
	}
}
