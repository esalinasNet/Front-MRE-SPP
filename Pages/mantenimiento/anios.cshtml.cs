using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using MRE.Web;

namespace MRE.Pages.mantenimiento
{
    public class aniosModel : BasePageModel
    {
        public aniosModel(IConfiguration configuration) : base(configuration)
        {
        }
        public void OnGet()
        {
        }
    }
}
