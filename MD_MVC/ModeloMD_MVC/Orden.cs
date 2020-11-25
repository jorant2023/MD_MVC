//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ModeloMD_MVC
{
    using System;
    using System.Collections.Generic;
    
    public partial class Orden
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Orden()
        {
            this.Orden_Detalle = new HashSet<Orden_Detalle>();
        }
    
        public int Id { get; set; }
        public System.DateTime Fecha { get; set; }
        public Nullable<int> Id_Persona { get; set; }
        public int Id_Tipo { get; set; }
        public byte Id_Condiciones { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Descuento { get; set; }
        public decimal Recargo { get; set; }
        public decimal Impuestos { get; set; }
        public decimal Total { get; set; }
        public Nullable<int> Id_Estatus { get; set; }
        public string SecuenciaEditable { get; set; }
        public string IdEditable { get; set; }
        public string Secuencia_Gobierno { get; set; }
        public string Comentario { get; set; }
    
        public virtual Estatus Estatus { get; set; }
        public virtual Condiciones Condiciones { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Orden_Detalle> Orden_Detalle { get; set; }
        public virtual Orden_Tipo Orden_Tipo { get; set; }
    }
}
