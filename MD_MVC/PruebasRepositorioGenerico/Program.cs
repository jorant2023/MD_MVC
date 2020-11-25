using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PruebasRepositorioGenerico
{
    class Program
    {
        static void Main(string[] args)
        {
            RepositorioGenerico.Repositorio.Excepcion += Repositorio_Excepcion;
            var datos=
            RepositorioGenerico.Repositorio.QuerySQL("Select * from Persona.Persona_Tipo", @"Data Source = DESKTOP-FLE023L; Initial Catalog = MD_MVC; Integrated Security = True");
            ModeloMD_MVC.MD_MVCEntities contexto = new ModeloMD_MVC.MD_MVCEntities();
            using(RepositorioGenerico.Repositorio<ModeloMD_MVC.Producto_Tipo> obj = new RepositorioGenerico.Repositorio<ModeloMD_MVC.Producto_Tipo>(contexto))
            {
                obj.Excepcion += Repositorio_Excepcion;
                var datosDeProducto = obj.All();
            }
            Console.WriteLine("Presione ENTER para salir");
            Console.ReadLine();
        }

        private static void Repositorio_Excepcion(object sender, RepositorioGenerico.ExceptionEvenArgs e)
        {
            
            Console.WriteLine(e.Message);
        }
    }
}
