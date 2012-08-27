using System;
using System.Web;

namespace Geneca.Gabby.Web.Classes
{
	public static class SessionFacade
	{
		static SessionFacade()
		{
			LoggedIn = false;
		}

		public static bool LoggedIn
		{
			get
			{
				if (HttpContext.Current.Session["LoggedIn"] == null)
				{
					HttpContext.Current.Session["LoggedIn"] = false;
				}
				return bool.Parse(HttpContext.Current.Session["LoggedIn"].ToString());
			}
			set { HttpContext.Current.Session["LoggedIn"] = value; }
		}

		public static string UserName
		{
			get { return HttpContext.Current.Session["UserName"].ToString().ToLower(); }
			set { HttpContext.Current.Session["UserName"] = value.ToLower(); }
		}

		public static string Avatar
		{
			get { return HttpContext.Current.Session["Avatar"].ToString(); }
			set { HttpContext.Current.Session["Avatar"] = value; }
		}

		public static DateTime LastLoggedIn
		{
			get { return (DateTime)HttpContext.Current.Session["LastLoggedIn"]; }
			set { HttpContext.Current.Session["LastLoggedIn"] = value; }
		}

	    public static string CurrentRoom
	    {
            get { return HttpContext.Current.Session["CurrentRoom"].ToString(); }
            set { HttpContext.Current.Session["CurrentRoom"] = value; }
	    }
	}
}