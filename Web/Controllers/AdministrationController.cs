using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Geneca.Gabby.Domain;
using Geneca.Gabby.Domain.Managers;
using Geneca.Gabby.Domain.Models;
using Geneca.Gabby.Web.Classes;

namespace Geneca.Gabby.Web.Controllers
{
    public class AdministrationController : Controller
    {
        //
        // GET: /Administration/

        public ActionResult Index()
        {
            return View();
        }

		[HttpPost]
		public ActionResult Index(FormCollection collection)
		{
			var manager = new Domain.Managers.AdministrationManager();
			var password = collection["AdminPassword"];
			var valid = manager.LoginAdmin(password);

			if (valid)
			{
				return View("Manage");
			}
			else
			{
				ViewBag.InvalidResponse = Constants.AdminPasswordErrorMessage;
				return View();
			}
			
		}

		public ActionResult Manage()
        {
			return View();
		}

        [HttpPost]
        public ActionResult DeleteRoom(string roomName)
        {
            Room room = DatabaseManager.GetRoomAdmin(roomName);
            DatabaseManager.DeleteRoom(room);
            return Content("Done");
        }
    }
}
