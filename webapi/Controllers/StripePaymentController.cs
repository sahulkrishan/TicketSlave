using Microsoft.AspNetCore.Mvc;
using Stripe;
using Microsoft.Extensions.Options;
using Stripe.Checkout;
using TicketSlave.Classes;
using webapi.Classes;
using Microsoft.AspNetCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class stripepaymentController : ControllerBase
    {
        [HttpPost]
        public ActionResult Create(string amount)
        {
            var domain = "http://localhost:7074";
            var options = new SessionCreateOptions
            {
                LineItems = new List<SessionLineItemOptions>
                {
                  new SessionLineItemOptions
                  {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = Convert.ToInt32(amount)*100,
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        { 
                            Name = "evenement",
                        }
                    },
                    Quantity = 1,
                  },
                },
                Mode = "payment",
                SuccessUrl = domain + "/success.html",
                CancelUrl = domain + "/cancel.html",
            };
            var service = new SessionService();
            Session session = service.Create(options);

            Response.Headers.Add("Location", session.Url);
            return new StatusCodeResult(303);
        }
    }
    }
