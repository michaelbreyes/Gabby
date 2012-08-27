using System;
using System.Linq;
using System.Linq.Expressions;

namespace Geneca.Core.Interfaces
{
	public interface IRepository<T> : IDisposable where T : IModel
	{
		IQueryable<T> All();
		T SingleOrDefault(Expression<Func<T, bool>> query);
		void Save(T model);
		void Delete(T model);
	}
}
