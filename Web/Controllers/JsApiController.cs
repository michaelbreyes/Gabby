using System.Web;
using System.Web.Mvc;
using Geneca.Core.Interfaces;
using Geneca.Gabby.Domain.Models;
using System.Collections.Generic;
using Geneca.Gabby.Domain.Managers;

namespace Geneca.Gabby.Web.Controllers
{
	public class JsApiController : Controller
	{
		[HttpPost]
		public ActionResult GetRooms()
		{
			var rooms = new List<Room>();
			rooms = DatabaseManager.GetAllRooms();
			return Json(rooms, JsonRequestBehavior.AllowGet);
		}
	}
}
