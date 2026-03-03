using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages; 
using MRE.Web;
using Microsoft.Extensions.Configuration;

namespace MRE.Web.Pages
{
    public class loginModel : BasePageModel
    {
        public loginModel(IConfiguration configuration) : base(configuration)
        {
        }
        public void OnGet()
        {
        }
    }
}
