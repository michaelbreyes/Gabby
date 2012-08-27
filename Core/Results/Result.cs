
namespace Geneca.Core.Results
{
	public abstract class Result
	{
		public bool Success { get; set; }
		public string ErrorMessage { get; set; }
	}
}
