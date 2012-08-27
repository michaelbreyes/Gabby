using Newtonsoft.Json;

namespace Geneca.Core.Serializers
{
	public class JsonSerializer
	{
		public static string JsonSerialize<T>(T obj)
		{
			return JsonConvert.SerializeObject(obj);
		}

		public static T JsonDeserialize<T>(string jsonString)
		{
			return JsonConvert.DeserializeObject<T>(jsonString);
		}
	}
}
