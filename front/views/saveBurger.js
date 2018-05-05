

function deleteBurger()
{
    //document.getElementById('save').style.visibility='hidden';

    var title = document.getElementById("title").value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    var code = document.getElementById("code").value; 

    // var config ={
    //     headers: { 
    //         "test": "abc",
    //         "Content-Type": "application/json",
    //         "Access-Control-Request-Headers": "X-Requested-With",
    //         "Access-Control-Request-Method":"POST"
    //     }
    // }

    var burgerData ={
        Title : title,
        Price : price,
        Description : description,
        Code : code
    }
    console.log(burgerData); 
    axios.delete('http://127.0.0.1:3305/item',{ data: { Title:title,Price:price,Description:description,Code:code }})
      .then(function (response) {
          console.log(response);
          alert(response.data.Item)
          location.href = 'burger.html'

        })
        .catch(function (error) {
          console.log(error);
        });
}


function fetchBurger(){

    axios.get('http://127.0.0.1:3305/displayitem',{ "Content-Type": "application/json"})
    .then(function (response) {
        //console.log(response)
        // console.log(response.data[1]);
        // console.log(response.data[3]);
        // console.log(response.data[5]);
        
        //console.log("in fetch burger");
        //console.log("length",response.data.length);
        //result.push(response.data[1]);
        var result=[];
        for(var i=1;i<response.data.length;i++){
           
            result.push(response.data[i]);
            i++;
        //     console.log("value of fetch: ",response.data[i+1])
        //    console.log(finallist[i]);
           // i++;  
        }
        // console.log(result.length);
        for(var i=0;i<result.length;i++){
           // console.log("in loop");
           console.log(result[i]);
           //console.log(response.data[i]);
        }
        // var s='<span>'+result[3]+'</span></br> <span>'+response.data[1]+'</span></br><span>'+response.data[2]+'</span><button type="button" class="btn btn-success add-cart" id="bacon">Add to Cart</button></label>'
        //     document.getElementById("result").innerHTML=s
        var s = '<style>table {font-family: arial, sans-serif;border-collapse: collapse;width: 70%;text-align:center;border-radius:2px}td,th {border: 1px solid #dddddd;text-align: center;padding: 8px;}th {background-color:#e8c592;}</style><table align="center" cellpadding="2" style="text-align:center;font-family: arial,sans-serif;border-collapse: collapse"';
        s +='<tr></tr>';
        for(var i=0;i<result.length;i++)
        {
            var n = i+1;
            var r = i+2; 
            s +='<tr class="tdrow">';
            s +='<td  style="border: 1px solid #dddddd;"><label class="container"><div style="float:left"><span>Code:'+" "+result[i]+'</span></br> <span>'+result[++i]+'</span></br><span>'+result[++i]+'</span></br><span>'+result[++i]+'</span></div><div style="float:right">&nbsp;&nbsp;<button type="button" class="btn btn-success add-cart" id="bacon" onclick="addtocart()"' + result[n] + ',' result[r] +')>Add to Cart</button>&nbsp;&nbsp;<button type="button" class="btn btn-primary moreInfo" id="moreInfo" style="float:right" onclick="location.href=\'PuristReview.html\'">Review</button></div><div style="float:right"><input type="text" id="itemcount" style="width:40px;color:black"></div></label></td>';
            s +='</tr>';
        }
        s +='</table>'
        document.getElementById('result').innerHTML=s;
     
      })
      .catch(function (error) {
        console.log(error);
      });
}


function createBurger(){  
    //document.getElementById("delete").style.visibility='hidden';
    var randomCode=Math.floor(Math.random()*1000);
    var code = randomCode+"";
    var title = document.getElementById("title").value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    var productCode=Math.random().toString(36).substring(2,5);
    //console.log("random String is",ranstring);
    // document.getElementById("code").value=code;
    // var productCode=document.getElementById("code").value;
    // console.log("Product code",productCode);
    var burgerData ={
        Title : title,
        Price : price,
        Description : description,
        Code : productCode
    } 
    axios.post('http://52.53.149.11:3305/createitem',burgerData)
    .then(function (response) {
        console.log(response.data.Item);
        alert(response.data.Item);
        location.href = 'burger.html'
      })
      .catch(function (error) {
        console.log(error);
      });

}

function updatePrice(){
    var title = document.getElementById("title").value;
    var price = document.getElementById("price").value;
    var code = document.getElementById("code").value;
    var burgerData ={
        Title : title,
        Price : price,
        Description : "description",
        Code : code
    }
      axios.put('http://52.53.149.11:3305/item',burgerData)
      .then(function (response) {
          console.log(response);
          alert(response.data.Item);
          location.href = 'burger.html'
        })
        .catch(function (error) {
          console.log(error);
        });

}


// Adds item to local storage variable that user is adding to cart.
function addtocart(name, rate) {

    var isChanged = false;

/*    var order = JSON.parse(localStorage.getItem('order'));
    console.log("[DEBUG 01]: ", order)*/

    var item = {
        "name": name,
        "count": 1,
        "rate": rate,
    }

    var order = JSON.parse(localStorage.getItem('order'));
    console.log(order)

    if (order.items.length === 0) {
        order.items.push(item)
    } else {
        // Traverse through item and increase count if item already exist or add another item if it doesn't exist.
        for(var i = 0; i < order.items.length; i++) {
            if (order.items[i].name === name) {
                console.log("inside for");
                order.items[i].count++;
                isChanged = true;
                break;
            }
        }
        if (!isChanged) {
            order.items.push(item)
            // isChanged = false
        }
    }
    localStorage.setItem("order", JSON.stringify(order));

    // console.setItem("[DEBUG]")

    // console.log("Length of items: ", order.items.length)
    console.log("========================")

    for (var k = 0; k < order.items.length; k++) {
        console.log("Name: ", order.items[k].name)
        console.log("Count: ", order.items[k].count)
        
    }


}

// Function called when user clicks on Done after selecting all the items he/she wants to order.
// Also opens another page of cart.
function doneOrder() {

    var order = JSON.parse(localStorage.getItem('order'));

    console.log("[DEBUG]: ", typeof(order))
    console.log("[DEBUG]: ", order)


    axios.post('http://localhost:3000/order', order)
            .then(function (response){
                console.log(response);
                console.log("DEBUG]: Return response", response.data);
                localStorage.setItem("orderid", response.data.id)
                console.log(response.data.id)
                location.href = "cart.html";
            })
            .catch(function(error) {
                console.log(error);
            });
}


// Populate cart for current order and current user.
function populateCart() {
    console.log("[DEBUG CART]: Populate cart called.")

    var orderId = localStorage.getItem("orderid")

    console.log("[DEBUG CART]: Order ID is: ", orderId);

    axios.get('http://localhost:3000/view/' + orderId)
        .then(function (response) {
            // console.log(response.data.id);
            // console.log("[CART DEBUG] Fetched from database: ", response.data)
            // alert(response.data);

            // console.log("[DEBUG]: ", response.data.items.length)

            var result=[];
            for(var i=0;i<response.data.items.length;i++){
                console.log("[DEBUG LOOP]: Inside for loop.")
                result.push(response.data.items[i]);
                // console.log("[DEBUG DATA STORE]: ", result[i])
            }
            console.log("[DEBUG]: Length of items: ", result.length);

            // Create table structure
            var table = '<style>' +
                'table {' +
                    'font-family: arial, sans-serif;' +
                    'border-collapse: collapse;' +
                    'width: 70%;text-align:center;' +
                    'border-radius:2px}' +
                'td,th {' +
                    'border: 1px solid #dddddd;' +
                    'text-align: center;' +
                    'padding: 8px;}' +
                'th {' +
                    'background-color:#e8c592;}' +
                'td {' +
                    'background-color:#ffffcc;}' +
                '</style>' +
                '<table align="center" cellpadding="2" style="text-align:center;font-family: arial,sans-serif;border-collapse: collapse>"';

            table +='<tr>' +
                    '<th>ITEM NAME</th><th>COUNT</th><th>RATE</th><th>AMOUNT</th>' +
                '</tr>';

            
            for(var i=0;i<result.length;i++){
                /* console.log("in loop");*/
                console.log("[DEBUG]: Amount: ", result[i].amount);
                table += '<em></em><tr><td>' +
                    result[i].name +
                    '</td><td>' + result[i].count + '</td><td>' + result[i].rate + '</td><td>' + result[i].amount + '</td>' +
                    '</tr></em>';
                //console.log(response.data[i]);
            }
            table += '</table>';
            document.getElementById('itemlist').innerHTML = table;
        })
        .catch(function (error) {
            console.log(error);
        });
}