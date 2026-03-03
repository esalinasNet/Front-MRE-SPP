using Microsoft.AspNetCore.Mvc.RazorPages; 
using Microsoft.Extensions.Configuration;
 
 

namespace MRE.Web
{
    public class BasePageModel: PageModel
    {
        public string RutaApi { get; set; }
        public string RutaWeb { get; set; }

        public string _kUser { get; set; }
        public string _vUser { get; set; }
        public string _kPass { get; set; }
        public string _vPass { get; set; }
        public bool _enabled { get; set; }

        private IConfiguration _configuration;
        public BasePageModel(IConfiguration configuration)
        {
            _configuration = configuration;
            RutaApi = _configuration["RutaWebBase:API"];
            RutaWeb = _configuration["RutaWebBase:MAINWEB"];
            _kUser = _configuration["LoginEncryptionSetting:KeyUser"];
            _vUser = _configuration["LoginEncryptionSetting:IVUser"];
            _kPass = _configuration["LoginEncryptionSetting:KeyPwd"];
            _vPass = _configuration["LoginEncryptionSetting:IVPwd"];
            _enabled = bool.Parse(_configuration["LoginEncryptionSetting:Enabled"]);
        }

               
    }
}
