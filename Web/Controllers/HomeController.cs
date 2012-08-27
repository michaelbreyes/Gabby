using System;
using System.Web;
using System.Web.Mvc;
using Geneca.Gabby.Web.Classes;
using System.Configuration;

namespace Geneca.Gabby.Web.Controllers
{
	public class HomeController : Controller
	{
		#region Properties

		private const string UserNameCookieString = "GabbyUserNameCookie";

		public string UserName
		{
			get
			{
				return Request.Cookies[UserNameCookieString] != null ? Request.Cookies[UserNameCookieString].Value : "";
			}
			set
			{
				var cookie = Request.Cookies[UserNameCookieString] ?? new HttpCookie(UserNameCookieString);
				cookie.Expires = DateTime.Now.AddYears(1);
				cookie.Value = value;

				Response.Cookies.Add(cookie);
			}
		}

		#endregion

		#region Controller Methods

		public ActionResult Index()
		{
			return ReturnMainView("Ember");
		}

		public ActionResult Ember()
		{
			return ReturnMainView("Ember");
		}

		public ActionResult Angular()
		{
			return ReturnMainView("Angular");
		}

		public ActionResult Knockout()
		{
			return ReturnMainView("Knockout");
		}

		public ActionResult About()
		{
			ViewBag.Message = "Your quintessential app description page.";

			return View();
		}

		public ActionResult Login()
		{
			ViewBag.LastUserName = UserName;
			return View();
		}

		[HttpPost]
		public ActionResult Login(FormCollection collection)
		{
			var email = collection["Email"];
			var hub = new SiteHub();

			if (!hub.UsernameInUse(email) && !string.IsNullOrEmpty(email))
			{
				SessionFacade.UserName = collection["Email"];
				SessionFacade.LoggedIn = true;

				UserName = collection["RememberEmail"] == "on" ? SessionFacade.UserName : "";

				return RedirectToAction("Knockout");
			}

			ViewBag.Error = "invalid username";

			return View();
		}

		public ActionResult Logout()
		{
			return RedirectToAction("Login");
		}

		public ActionResult Draw()
		{
			return View();
		}

		#endregion

		#region Private Methods

		private ActionResult ReturnMainView(string viewName)
		{
			if (!SessionFacade.LoggedIn) return RedirectToAction("Login");
			ViewBag.UserId = SessionFacade.UserName;
			ViewBag.htmlEnabled = ConfigurationManager.AppSettings["htmlEnabled"];

			return View(viewName);
		}

		#endregion
	}
}
