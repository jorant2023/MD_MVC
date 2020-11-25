using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MD_MVC.Models
{
    public class Clase_Select2
    {
        public object id { get; set; }
        public object text { get; set; }
    }
    public class GrupoSelect2
    {
        public string  text { get; set; }
        public List<children>  children { get; set; }
    }
    public class children
    {
        public object id { get; set; }
        public object text { get; set; }
    }
}