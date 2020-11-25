using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MD_MVC.Models;
using System.Text;
using System.Data.Entity.Validation;

namespace MD_MVC.Controllers
{
    public class HomeController : Controller
    {
        ModeloMD_MVC.MD_MVCEntities contexto = null;
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        private string Select2(List<GrupoSelect2> grupos)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{'results':[");
            foreach(var grupo in grupos)
            {
                sb.Append("{"+string.Format("'text':'{0}',",grupo.text));
                sb.Append("'children':[");
                foreach(var child in grupo.children)
                    sb.Append("{" + string.Format("'id':'{0}', 'text': '{1}',", child.id, child.text)+"},");
                sb.Append("]},");

            }
            sb.Append("]}");
            return sb.ToString();
        }

        private string Select2(List<Clase_Select2> datos)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("[");
            foreach (var item in datos)
                sb.Append("{" + string.Format("id:'{0}', text:'{1}'", item.id, item.text) + "},");
            sb.Append("]");
            return sb.ToString();

        }

        [ChildActionOnly]
        public string PersonasSelect2()
        {
            List<GrupoSelect2> grupoSelect2 = new List<GrupoSelect2>();
            contexto = new ModeloMD_MVC.MD_MVCEntities();
            using (RepositorioGenerico.Repositorio<ModeloMD_MVC.v_Persona> p =
                new RepositorioGenerico.Repositorio<ModeloMD_MVC.v_Persona>(contexto))
            {
                p.Excepcion += P_Excepcion; ;
                var grupos = p.All().GroupBy(x => x.Tipo_Persona);
                foreach(var grupo in grupos)
                {
                    var grupoOrganizado = grupo.OrderBy(x => x.Nombre_Completo).ToList();
                    List<children> hijos = new List<children>();
                    foreach (var g in grupoOrganizado)
                        hijos.Add(new children() { id = g.Id, text = g.Nombre_Completo });
                    grupoSelect2.Add(new GrupoSelect2() {text = grupo.Key, children = hijos });
                }
            }
            return Select2(grupoSelect2);
        }

        private void P_Excepcion(object sender, RepositorioGenerico.ExceptionEvenArgs e)
        {
            if (e.EntityValidationErrors != null)
                throw new DbEntityValidationException(e.Message, e.EntityValidationErrors, e.InnerException) { };
            else
                throw new Exception(e.Message, e.InnerException) { Source = e.Source };
        }
    }
}