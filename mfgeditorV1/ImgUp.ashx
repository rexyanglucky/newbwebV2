<%@ WebHandler Language="C#" Class="ImgUp" %>

using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Web;
using System.IO;
public class ImgUp : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        var b64 = context.Request["img"];
        if (string.IsNullOrEmpty(b64))
        {
            context.Response.Write("");
            return;

        }
        var barr = b64.Split(';');
        string filetype = barr[0];
        string content = barr[1].Split(',')[1];
        var fileName =  DateTime.Now.Ticks;
        try
        {
            using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(content)))
            {
                Bitmap b = new Bitmap(ms);
                ImageFormat ftype = ImageFormat.Jpeg;
                string fexits = ".png";
                switch (filetype)
                {
                    case "data:image/png":
                        ftype = ImageFormat.Png;
                        fexits = ".png";
                        break;
                    case "data:image/jpeg":
                        ftype = ImageFormat.Jpeg;
                        fexits = ".jpg";
                        break;
                    case "data:image/bmp":
                        ftype = ImageFormat.Bmp;
                        fexits = ".bmp";
                        break;
                    case "data:image/gif":
                        ftype = ImageFormat.Gif;
                        fexits = ".gif";
                        break;
                    default:
                        break;

                }
                if (!Directory.Exists(AppDomain.CurrentDomain.BaseDirectory + "\\img"))
                {
                    Directory.CreateDirectory(AppDomain.CurrentDomain.BaseDirectory + "\\img");
                }
                b.Save(AppDomain.CurrentDomain.BaseDirectory + "\\img\\" + fileName + fexits, ftype);
                context.Response.ContentType = "text/plain";
                context.Response.Write("/img/" + fileName + fexits);
            }
        }
        catch (Exception ex)
        {
            context.Response.Write("");
        }


    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    public string UpImg(string img)
    {
        return img;
    }

}