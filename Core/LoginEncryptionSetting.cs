namespace MRE.WebSISA.Pages.Core
{
    public class LoginEncryptionSetting
    {
        public string KeyUser { get; set; }
        public string IVUser { get; set; }
        public string KeyPwd { get; set; }
        public string IVPwd { get; set; }
        public bool Enabled { get; set; }


    }
}
