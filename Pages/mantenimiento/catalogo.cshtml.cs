using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using MRE.Web;

namespace MRE.Pages.mantenimiento
{
    public class catalogoModel : BasePageModel
    {
        public catalogoModel(IConfiguration configuration) : base(configuration)
        {
        }
        public void OnGet(string codigo)
        {
        }
    }
}
 