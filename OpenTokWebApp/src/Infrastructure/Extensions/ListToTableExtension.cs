using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Infrastructure.Extensions
{
    public static class ListToTableExtension
    {
        public static string GetHtmlTable<T>(this List<T> list, params Func<T, object>[] fxns)
        {
            // Dynamic build  HTML Table Header column name base on T\model object
            PropertyInfo[] props = typeof(T)
                .GetProperties(BindingFlags.Public | BindingFlags.Instance);

            var className = typeof(T).Name;
            string THstr = "<tr>";

            foreach (var prop in props)
            {
                var name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(prop.Name.Replace("_", " "));
                THstr += "<TH>" + name + "</TH>";
            }

            THstr += "</tr>";

            // Build  remain data rows in HTML Table
            StringBuilder sb = new StringBuilder();

            // Inject bootstrap class base on your need
            sb.Append("<TABLE class='reporttable'>\n");
            sb.Append(THstr);

            if (list.Count == 0)
            {
                sb.Append("<TR>\n");

                foreach (var prop in props)
                {
                    sb.Append("<TD>");
                    sb.Append("&nbsp;");
                    sb.Append("</TD>");
                }

                sb.Append("</TR>\n");
            }
            else
            {
                foreach (var item in list)
                {
                    sb.Append("<TR>\n");
                    var values = new object[props.Length];

                    for (int i = 0; i < props.Length; i++)
                    {

                        values[i] = props[i].GetValue(item, null);
                        sb.Append("<TD>");

                        if (Convert.ToString(values[i]).Length > 0)
                        {
                            sb.Append(Convert.ToString(values[i]));
                        }
                        else
                        {
                            sb.Append("&nbsp;");
                        }

                        sb.Append("</TD>");
                    }

                    sb.Append("</TR>\n");
                }
            }

            sb.Append("</TABLE>");

            return sb.ToString();
        }

        public static string GetHtmlWithVerticalTable<T>(this List<T> list, params Func<T, object>[] fxns)
        {
            // Dynamic build  HTML Table Header column name base on T\model object
            PropertyInfo[] props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            var className = typeof(T).Name;

            // Build  remain data rows in HTML Table
            StringBuilder sb = new StringBuilder();
            // Inject bootstrap class base on your need
            sb.Append("<TABLE class='reporttable'>\n");

            if (list.Count() > 0)
            {
                foreach (var item in list)
                {
                    sb.Append("<TR>\n");
                    var values = new object[props.Length];

                    for (int i = 0; i < props.Length; i++)
                    {

                        values[i] = props[i].GetValue(item, null);
                        if (i == 0)
                        {
                            sb.Append("<TH>");
                        }
                        else
                        {
                            sb.Append("<TD>");
                        }
                        if (Convert.ToString(values[i]).Length > 0)
                        {
                            sb.Append(Convert.ToString(values[i]));
                        }
                        else
                        {
                            sb.Append("&nbsp;");
                        }

                        if (i == 0)
                        {
                            sb.Append("<TH>");
                        }
                        else
                        {
                            sb.Append("</TD>");
                        }
                    }

                    sb.Append("</TR>\n");
                }
            }

            sb.Append("</TABLE>");

            return sb.ToString();
        }

        public static string GetHtmlTablewithHeader<T>(List<T> list, string header, params Func<T, object>[] fxns)
        {
            // Dynamic build  HTML Table Header column name base on T\model object
            PropertyInfo[] props = typeof(T)
                .GetProperties(BindingFlags.Public | BindingFlags.Instance);

            string THstr = "<tr>";

            foreach (var prop in props)
            {
                THstr += "<TH>" + CultureInfo.CurrentCulture.TextInfo.ToTitleCase(prop.Name.Replace("_", " ")) + "</TH>";
            }

            THstr += "</tr>";

            // Build  remain data rows in HTML Table
            StringBuilder sb = new StringBuilder();

            // Inject bootstrap class base on your need
            sb.Append("<TABLE class='reporttable'>\n");
            sb.Append("<tr><th colspan='" + props.Length + "' style='text-align: left;'>" + header + " </th></tr>");
            sb.Append(THstr);

            if (list.Count == 0)
            {
                sb.Append("<TR>\n");

                foreach (var prop in props)
                {
                    sb.Append("<TD>");
                    sb.Append("&nbsp;");
                    sb.Append("</TD>");
                }

                sb.Append("</TR>\n");
            }
            else
            {
                foreach (var item in list)
                {
                    sb.Append("<TR>\n");
                    var values = new object[props.Length];

                    for (int i = 0; i < props.Length; i++)
                    {
                        values[i] = props[i].GetValue(item, null);
                        sb.Append("<TD>");

                        if (Convert.ToString(values[i]).Length > 0)
                        {
                            sb.Append(Convert.ToString(values[i]));
                        }
                        else
                        {
                            sb.Append("&nbsp;");
                        }

                        sb.Append("</TD>");
                    }

                    sb.Append("</TR>\n");
                }
            }

            sb.Append("</TABLE>");

            return sb.ToString();
        }

        public static string GetHtmlTablewithVerticaleHeader<T>(this List<T> list, string header, params Func<T, object>[] fxns)
        {
            // Dynamic build  HTML Table Header column name base on T\model object
            PropertyInfo[] props = typeof(T)
                .GetProperties(BindingFlags.Public | BindingFlags.Instance);

            // Build  remain data rows in HTML Table
            StringBuilder sb = new StringBuilder();

            // Inject bootstrap class base on your need
            sb.Append("<TABLE class='reporttable'>\n");
            sb.Append("<tr><th colspan='" + props.Length + "' style='text-align: left;'>" + header + " </th></tr>");

            if (list.Count > 0)
            {
                foreach (var item in list)
                {
                    sb.Append("<TR>\n");
                    var values = new object[props.Length];

                    for (int i = 0; i < props.Length; i++)
                    {

                        values[i] = props[i].GetValue(item, null);
                        if (i == 0)
                        {
                            sb.Append("<TH>");
                        }
                        else
                        {
                            sb.Append("<TD>");
                        }

                        if (Convert.ToString(values[i]).Length > 0)
                        {
                            sb.Append(Convert.ToString(values[i]));
                        }
                        else
                        {
                            sb.Append("&nbsp;");
                        }

                        if (i == 0)
                        {
                            sb.Append("<TH>");
                        }
                        else
                        {
                            sb.Append("</TD>");
                        }

                    }

                    sb.Append("</TR>\n");
                }
            }

            sb.Append("</TABLE>");

            return sb.ToString();
        }

        public static string ExportDatatableToHtml(this DataTable dt)
        {
            StringBuilder strHTMLBuilder = new StringBuilder();
            strHTMLBuilder.Append("<table class='reporttable'>\n");
            strHTMLBuilder.Append("<tr>\n");

            for (var k = 3; k <= dt.Columns.Count - 1; k++)
            {
                strHTMLBuilder.Append("<th>");
                strHTMLBuilder.Append(CultureInfo.CurrentCulture.TextInfo.ToTitleCase(dt.Columns[k].ColumnName.Replace("_", " ")));
                strHTMLBuilder.Append("</th>");
            }

            strHTMLBuilder.Append("</tr>");

            if (dt.Rows.Count == 0)
            {
                strHTMLBuilder.Append("<TR>\n");

                for (var k = 3; k <= dt.Columns.Count - 1; k++)
                {
                    strHTMLBuilder.Append("<td>");
                    strHTMLBuilder.Append("&nbsp;");
                    strHTMLBuilder.Append("</td>");
                }

                strHTMLBuilder.Append("</TR>\n");
            }
            else
            {
                foreach (DataRow myRow in dt.Rows)
                {
                    strHTMLBuilder.Append("<tr >\n");

                    for (var k = 3; k <= dt.Columns.Count - 1; k++)
                    {
                        strHTMLBuilder.Append("<td >");

                        if (Convert.ToString(myRow[dt.Columns[k].ColumnName]).Length == 0)
                        {
                            strHTMLBuilder.Append("&nbsp;");
                        }
                        else
                        {
                            strHTMLBuilder.Append(Convert.ToString(myRow[dt.Columns[k].ColumnName]));
                        }

                        strHTMLBuilder.Append("</td>");
                    }

                    strHTMLBuilder.Append("</tr>\n");
                }
            }

            //Close tags.
            strHTMLBuilder.Append("</table>");
            string Htmltext = strHTMLBuilder.ToString();
            return Htmltext;
        }
    }
}
